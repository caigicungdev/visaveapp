from fastapi import APIRouter, UploadFile, File, HTTPException, Request
from fastapi.responses import StreamingResponse, JSONResponse
from pydantic import BaseModel
import io
import cv2
import numpy as np
from PIL import Image
import torch
from simple_lama_inpainting import SimpleLama
import asyncio
import functools
import ssl

# Import rate limiter
from rate_limiter import rate_limiter
from auth import get_current_user, get_client_ip

# Bypass SSL verification for model download
try:
    _create_unverified_https_context = ssl._create_unverified_context
except AttributeError:
    pass
else:
    ssl._create_default_https_context = _create_unverified_https_context

print("DEBUG: Loading inpainting router")

router = APIRouter(prefix="/api/v1/inpainting", tags=["inpainting"])

# Initialize model
# Note: Using OpenCV fallback by default if LaMa fails or for stability until numpy matches
USE_OPENCV_FALLBACK = True

try:
    if not USE_OPENCV_FALLBACK:
        print("DEBUG: Initializing LaMa model...")
        lama_model = SimpleLama()
        print("✅ LaMa Inpainting model loaded successfully")
    else:
        print("ℹ️ Using OpenCV Fallback for Inpainting (Stability Mode)")
        lama_model = None
except Exception as e:
    print(f"⚠️ Failed to load LaMa model: {e}")
    lama_model = None

def _process_inpainting(image_bytes: bytes, mask_bytes: bytes) -> bytes:
    # Fallback to OpenCV if LaMa is not loaded
    if lama_model is None or USE_OPENCV_FALLBACK:
        nparr_img = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr_img, cv2.IMREAD_COLOR)
        
        nparr_mask = np.frombuffer(mask_bytes, np.uint8)
        mask_img = cv2.imdecode(nparr_mask, cv2.IMREAD_GRAYSCALE)
        
        # Ensure mask matches image size
        if img.shape[:2] != mask_img.shape[:2]:
            mask_img = cv2.resize(mask_img, (img.shape[1], img.shape[0]))
            
        # Threshold mask to binary
        _, mask_binary = cv2.threshold(mask_img, 127, 255, cv2.THRESH_BINARY)
        
        # Dilate mask slightly to cover edges
        kernel = np.ones((5,5), np.uint8)
        mask_dilated = cv2.dilate(mask_binary, kernel, iterations=2)
        
        # Inpaint
        # Radius 3 is standard for Telea
        result = cv2.inpaint(img, mask_dilated, 3, cv2.INPAINT_TELEA)
        
        _, encoded = cv2.imencode('.png', result)
        return encoded.tobytes()

    # LaMa Implementation
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    mask = Image.open(io.BytesIO(mask_bytes)).convert("L")

    result = lama_model(image, mask)

    output_buffer = io.BytesIO()
    result.save(output_buffer, format="PNG")
    output_buffer.seek(0)
    return output_buffer.getvalue()


async def _check_inpainting_rate_limit(request: Request) -> JSONResponse | None:
    """Check rate limit for inpainting endpoint."""
    user = await get_current_user(request)
    
    if user:
        identifier = f"user:{user.id}"
        is_premium = user.is_premium
    else:
        identifier = f"ip:{get_client_ip(request)}"
        is_premium = False
    
    allowed, remaining, reset_seconds = rate_limiter.check_rate_limit(
        identifier, "inpainting", is_premium
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
    
    rate_limiter.record_request(identifier, "inpainting")
    return None


@router.post("/remove-object")
async def remove_object(
    request: Request,
    image: UploadFile = File(...),
    mask: UploadFile = File(...)
):
    """
    Remove object from image.
    Uses LaMa if available, else OpenCV Telea fallback.
    """
    # Check rate limit
    rate_limit_error = await _check_inpainting_rate_limit(request)
    if rate_limit_error:
        return rate_limit_error
    
    try:
        image_bytes = await image.read()
        mask_bytes = await mask.read()

        if not image_bytes or not mask_bytes:
            raise HTTPException(status_code=400, detail="Empty image or mask uploaded")

        # Process in thread pool
        loop = asyncio.get_event_loop()
        result_bytes = await loop.run_in_executor(
            None,
            functools.partial(_process_inpainting, image_bytes, mask_bytes)
        )

        return StreamingResponse(
            io.BytesIO(result_bytes),
            media_type="image/png"
        )

    except Exception as e:
        print(f"Inpainting error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

