import uuid
import os
import io
import asyncio
import functools
import cv2
import numpy as np
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, BackgroundTasks, UploadFile, File, Header, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, StreamingResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from datetime import datetime
from PIL import Image
from rembg import remove

# Import routers (optional - inpainting requires torch which is heavy)
try:
    from routers import inpainting
    HAS_INPAINTING = True
except ImportError:
    HAS_INPAINTING = False
    print("⚠️ Inpainting router disabled (torch not installed)")

from config import SUPABASE_URL, SUPABASE_SERVICE_KEY, CORS_ORIGINS, HOST, PORT, DOWNLOAD_DIR
from models import ProcessRequest, CreateTaskResponse, Task
from tasks import process_task, tasks_db

# Rate limiting and auth
from rate_limiter import rate_limiter
from auth import get_current_user, get_client_ip


async def check_rate_limit(request: Request, endpoint: str) -> JSONResponse | None:
    """
    Check rate limit for a request. Returns error response if limit exceeded.
    Returns None if request is allowed.
    """
    # Get user or use IP
    user = await get_current_user(request)
    
    if user:
        identifier = f"user:{user.id}"
        is_premium = user.is_premium
    else:
        identifier = f"ip:{get_client_ip(request)}"
        is_premium = False
    
    allowed, remaining, reset_seconds = rate_limiter.check_rate_limit(
        identifier, endpoint, is_premium
    )
    
    if not allowed:
        return JSONResponse(
            status_code=429,
            content={
                "error": "Rate limit exceeded",
                "message": f"Too many requests. Please wait {reset_seconds} seconds.",
                "retry_after": reset_seconds
            },
            headers={
                "X-RateLimit-Remaining": "0",
                "X-RateLimit-Reset": str(reset_seconds),
                "Retry-After": str(reset_seconds)
            }
        )
    
    # Record the request
    rate_limiter.record_request(identifier, endpoint)
    return None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifecycle manager"""
    print("🚀 Starting V-Tool API Server...")
    print(f"📁 Download directory: {DOWNLOAD_DIR}")
    
    if SUPABASE_URL and SUPABASE_SERVICE_KEY:
        print("✅ Supabase configured")
    else:
        print("⚠️ Supabase not configured - using in-memory storage")
    
    yield
    
    print("👋 Shutting down V-Tool API Server...")


# Create FastAPI app
app = FastAPI(
    title="V-Tool API",
    description="Media Processing SaaS Backend",
    version="1.0.0",
    lifespan=lifespan
)

# Register routers (optional)
if HAS_INPAINTING:
    app.include_router(inpainting.router)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if not os.path.exists("static"):
    os.makedirs("static")
app.mount("/static", StaticFiles(directory="static"), name="static")

nft_path = "static/nft"
if not os.path.exists(nft_path):
    os.makedirs(nft_path)
app.mount("/api/nft", StaticFiles(directory=nft_path), name="nft")

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "ok",
        "service": "V-Tool API",
        "version": "1.0.0"
    }


@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "download_dir": DOWNLOAD_DIR,
        "active_tasks": len(tasks_db)
    }


@app.post("/api/process", response_model=CreateTaskResponse)
async def create_process_task(
    request: ProcessRequest,
    background_tasks: BackgroundTasks,
    req: Request
):
    """
    Create a new processing task.
    
    - Creates a task record
    - Returns task_id immediately
    - Processes the task in the background
    """
    # Check rate limit for this task type
    rate_limit_error = await check_rate_limit(req, request.type)
    if rate_limit_error:
        return rate_limit_error
    
    task_id = str(uuid.uuid4())
    
    try:
        # Build options dict
        options = {
            "format": request.format,
            "quality": request.quality,
            "ytdlp_format": request.ytdlp_format,
            "audio_bitrate": request.audio_bitrate,
        }
        
        # Create task in memory storage
        task_data = {
            "id": task_id,
            "type": request.type,
            "status": "pending",
            "progress": 0,
            "input_url": request.url,
            "options": options,
            "result": None,
            "error_message": None,
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat()
        }
        tasks_db[task_id] = task_data
        
        # Start background processing with options
        background_tasks.add_task(process_task, task_id, request.type, request.url, options)
        
        return CreateTaskResponse(
            task_id=task_id,
            message=f"Task created successfully. Processing {request.type} for URL: {request.url}"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/tasks/{task_id}")
async def get_task(task_id: str):
    """
    Get task status and result.
    """
    if task_id not in tasks_db:
        raise HTTPException(status_code=404, detail="Task not found")
    
    return tasks_db[task_id]


@app.delete("/api/tasks/{task_id}")
async def delete_task(task_id: str):
    """
    Delete a task and its files.
    """
    if task_id in tasks_db:
        del tasks_db[task_id]
    
    # Clean up downloaded files
    for f in os.listdir(DOWNLOAD_DIR):
        if f.startswith(task_id):
            os.remove(os.path.join(DOWNLOAD_DIR, f))
    
    return {"message": "Task deleted successfully"}


@app.get("/api/files/{filename}")
async def serve_file(filename: str, download_name: str = None, range: str = Header(None)):
    """
    Serve downloaded files with Range support for seeking.
    Optionally set Content-Disposition filename with download_name.
    """
    filepath = os.path.join(DOWNLOAD_DIR, filename)
    
    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="File not found")
        
    file_size = os.path.getsize(filepath)
    headers = {
        "Content-Disposition": f'attachment; filename="{download_name or filename}"',
        "Accept-Ranges": "bytes"
    }

    # Handle Range Header
    if range:
        try:
            start, end = range.replace("bytes=", "").split("-")
            start = int(start)
            end = int(end) if end else file_size - 1
            
            # Cap end at file size
            if end >= file_size:
                end = file_size - 1
                
            chunk_size = (end - start) + 1
            
            headers.update({
                "Content-Range": f"bytes {start}-{end}/{file_size}",
                "Content-Length": str(chunk_size)
            })
            
            with open(filepath, "rb") as f:
                f.seek(start)
                content = f.read(chunk_size)
                
            return StreamingResponse(
                io.BytesIO(content),
                status_code=206,
                headers=headers,
                media_type="application/octet-stream"
            )
        except Exception:
            # If range parsing fails, fallback to full file
            pass

    return FileResponse(
        filepath,
        filename=download_name or filename,
        media_type="application/octet-stream",
        headers={"Accept-Ranges": "bytes"}
    )


@app.get("/api/tasks")
async def list_tasks():
    """
    List all tasks.
    """
    return list(tasks_db.values())


# Allowed image extensions for background removal
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}


def _process_remove_bg(image_bytes: bytes) -> bytes:
    """
    Synchronous function to process background removal.
    This runs in a thread pool to avoid blocking the event loop.
    Uses alpha_matting for cleaner edges on logos and graphics.
    """
    input_image = Image.open(io.BytesIO(image_bytes))
    
    # Use alpha matting for cleaner edges (especially good for logos)
    # alpha_matting_foreground_threshold: higher = more aggressive foreground detection
    # alpha_matting_background_threshold: lower = more aggressive background removal
    output_image = remove(
        input_image,
        alpha_matting=True,
        alpha_matting_foreground_threshold=240,
        alpha_matting_background_threshold=10,
        alpha_matting_erode_size=10,
    )
    
    # Save to bytes
    output_buffer = io.BytesIO()
    output_image.save(output_buffer, format="PNG")
    output_buffer.seek(0)
    return output_buffer.getvalue()


@app.post("/api/v1/remove-bg")
async def remove_background(req: Request, file: UploadFile = File(...)):
    """
    Remove background from an uploaded image.
    
    - Accepts: .jpg, .jpeg, .png, .webp
    - Returns: PNG image with transparent background
    """
    # Check rate limit
    rate_limit_error = await check_rate_limit(req, "remove_bg")
    if rate_limit_error:
        return rate_limit_error
    
    # Validate file extension
    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename provided")
    
    file_ext = os.path.splitext(file.filename)[1].lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
        )
    
    try:
        # Read file into memory
        image_bytes = await file.read()
        
        if not image_bytes:
            raise HTTPException(status_code=400, detail="Empty file uploaded")
        
        # Process in thread pool to avoid blocking
        loop = asyncio.get_event_loop()
        result_bytes = await loop.run_in_executor(
            None,
            functools.partial(_process_remove_bg, image_bytes)
        )
        
        # Return as streaming response
        return StreamingResponse(
            io.BytesIO(result_bytes),
            media_type="image/png",
            headers={
                "Content-Disposition": f"attachment; filename=removed_bg_{file.filename.rsplit('.', 1)[0]}.png"
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Failed to process image: {str(e)}"
        )


def _process_remove_watermark(image_bytes: bytes) -> bytes:
    """
    Remove semi-transparent watermarks from image.
    Uses local contrast detection and inpainting.
    """
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    if img is None:
        raise ValueError("Could not decode image")
    
    h, w = img.shape[:2]
    result = img.copy()
    
    # Define corner regions where watermarks typically appear
    regions = [
        (int(h * 0.80), h, int(w * 0.60), w),      # bottom-right (most common)
        (int(h * 0.80), h, 0, int(w * 0.40)),      # bottom-left
        (0, int(h * 0.20), int(w * 0.60), w),      # top-right
        (0, int(h * 0.20), 0, int(w * 0.40)),      # top-left
    ]
    
    for y1, y2, x1, x2 in regions:
        roi = img[y1:y2, x1:x2].copy()
        gray = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
        
        # Detect watermark using local contrast
        blur = cv2.GaussianBlur(gray, (31, 31), 0)
        diff = cv2.absdiff(gray, blur)
        
        # Lower threshold = more sensitive detection
        _, mask = cv2.threshold(diff, 8, 255, cv2.THRESH_BINARY)
        
        # Also detect very light or very dark areas (common watermark colors)
        _, light = cv2.threshold(gray, 220, 255, cv2.THRESH_BINARY)
        _, dark = cv2.threshold(gray, 35, 255, cv2.THRESH_BINARY_INV)
        
        # Combine all detections
        combined = cv2.bitwise_or(mask, light)
        combined = cv2.bitwise_or(combined, dark)
        
        # Clean up
        kernel = np.ones((5, 5), np.uint8)
        combined = cv2.morphologyEx(combined, cv2.MORPH_CLOSE, kernel)
        combined = cv2.dilate(combined, kernel, iterations=1)
        
        # Apply inpainting if watermark detected
        if np.sum(combined) > 50:
            inpainted = cv2.inpaint(roi, combined, inpaintRadius=5, flags=cv2.INPAINT_TELEA)
            result[y1:y2, x1:x2] = inpainted
    
    _, encoded = cv2.imencode('.png', result)
    return encoded.tobytes()


@app.post("/api/v1/remove-watermark")
async def remove_watermark(req: Request, file: UploadFile = File(...)):
    """
    Remove watermark from an uploaded image.
    
    - Accepts: .jpg, .jpeg, .png, .webp
    - Returns: PNG image with watermark removed
    """
    # Check rate limit
    rate_limit_error = await check_rate_limit(req, "remove_watermark")
    if rate_limit_error:
        return rate_limit_error
    
    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename provided")
    
    file_ext = os.path.splitext(file.filename)[1].lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
        )
    
    try:
        image_bytes = await file.read()
        
        if not image_bytes:
            raise HTTPException(status_code=400, detail="Empty file uploaded")
        
        loop = asyncio.get_event_loop()
        result_bytes = await loop.run_in_executor(
            None,
            functools.partial(_process_remove_watermark, image_bytes)
        )
        
        return StreamingResponse(
            io.BytesIO(result_bytes),
            media_type="image/png",
            headers={
                "Content-Disposition": f"attachment; filename=no_watermark_{file.filename.rsplit('.', 1)[0]}.png"
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Failed to process image: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host=HOST, port=PORT, reload=True)
