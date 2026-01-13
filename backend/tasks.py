import asyncio
import os
import json
import re
import subprocess
from typing import Optional
from datetime import datetime

from config import DOWNLOAD_DIR, OPENAI_API_KEY, HOST, PORT

# Cookies file path for YouTube authentication
COOKIES_FILE = os.path.join(os.path.dirname(__file__), "cookies.txt")
from models import (
    TaskType, 
    DownloadResult, 
    SummaryResult, 
    SpyResult, 
    SlideshowResult, 
    AudioResult
)

# In-memory task storage (replace with Supabase in production)
tasks_db: dict = {}

# Base URL for file downloads
API_BASE_URL = f"http://localhost:{PORT}"


def update_task_sync(task_id: str, updates: dict):
    """Update task in memory storage"""
    if task_id in tasks_db:
        tasks_db[task_id].update(updates)
        tasks_db[task_id]["updated_at"] = datetime.now().isoformat()


async def update_task_progress(task_id: str, progress: int, status: str = "processing"):
    """Update task progress"""
    update_task_sync(task_id, {"progress": progress, "status": status})


async def complete_task(task_id: str, result: dict):
    """Mark task as completed with result"""
    update_task_sync(task_id, {
        "progress": 100,
        "status": "completed",
        "result": result
    })


async def fail_task(task_id: str, error_message: str):
    """Mark task as failed with error"""
    update_task_sync(task_id, {
        "status": "failed",
        "error_message": error_message
    })


# Common yt-dlp options for VPS compatibility
def get_ydl_opts(output_template: str = None, format_str: str = None) -> dict:
    """Get robust yt-dlp options for VPS environments"""
    opts = {
        # Format selection with fallbacks
        'format': format_str or 'bestvideo+bestaudio/bestvideo*+bestaudio/best/bestvideo/bestaudio',
        
        # HTTP headers to mimic real browser
        'http_headers': {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
            'Sec-Fetch-User': '?1',
        },
        
        # SSL and network options
        'nocheckcertificate': True,
        'ignoreerrors': False,
        'no_warnings': True,
        'quiet': True,
        'no_color': True,
        
        # Retry settings
        'retries': 3,
        'fragment_retries': 3,
        
        # Output options
        'noplaylist': True,
        'merge_output_format': 'mp4',
        
        # Extractor options for YouTube
        'extractor_args': {
            'youtube': {
                'player_client': ['web', 'android', 'ios'],
                'skip': ['dash', 'hls'],
            }
        },
    }
    
    # Add output template if provided
    if output_template:
        opts['outtmpl'] = output_template
    
    # Add cookies if available
    if os.path.exists(COOKIES_FILE):
        opts['cookiefile'] = COOKIES_FILE
    
    return opts


def get_video_info(url: str) -> dict:
    """Extract video information using yt-dlp Python library"""
    import yt_dlp
    
    ydl_opts = get_ydl_opts()
    ydl_opts['skip_download'] = True
    ydl_opts['extract_flat'] = False
    
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            if info is None:
                raise Exception("Failed to get video info")
            return info
    except yt_dlp.utils.DownloadError as e:
        raise Exception(f"Download error: {str(e)}")
    except Exception as e:
        raise Exception(f"Failed to get video info: {str(e)}")


def download_video(url: str, task_id: str, options: dict = None) -> dict:
    """Download video using yt-dlp Python library with robust options"""
    import yt_dlp
    
    options = options or {}
    output_template = os.path.join(DOWNLOAD_DIR, f"{task_id}.%(ext)s")
    
    # Determine format string
    format_type = options.get('format', 'video')
    ytdlp_format = options.get('ytdlp_format')
    audio_bitrate = options.get('audio_bitrate', '320')
    
    if format_type == 'audio':
        # Audio download with robust format fallbacks
        format_str = 'bestaudio/best'
        ydl_opts = get_ydl_opts(output_template, format_str)
        ydl_opts['postprocessors'] = [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': audio_bitrate or '320',
        }]
    else:
        # Video download with quality fallbacks
        if ytdlp_format:
            format_str = f"{ytdlp_format}/bestvideo+bestaudio/best"
        else:
            # Robust format with multiple fallbacks
            format_str = 'bestvideo+bestaudio/bestvideo*+bestaudio/best/bestvideo/bestaudio'
        
        ydl_opts = get_ydl_opts(output_template, format_str)
    
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])
    except yt_dlp.utils.DownloadError as e:
        raise Exception(f"Download failed: {str(e)}")
    except Exception as e:
        raise Exception(f"Download error: {str(e)}")
    
    # Find the downloaded file
    for f in os.listdir(DOWNLOAD_DIR):
        if f.startswith(task_id):
            filepath = os.path.join(DOWNLOAD_DIR, f)
            return {
                "filepath": filepath,
                "filename": f,
                "file_size": os.path.getsize(filepath)
            }
    
    raise Exception("Downloaded file not found")


async def process_download(task_id: str, url: str, options: dict = None):
    """Process video download task - downloads video/audio with format options"""
    try:
        options = options or {}
        await update_task_progress(task_id, 10)
        
        # Get video info first
        info = get_video_info(url)
        await update_task_progress(task_id, 30)
        
        # Download with options
        await update_task_progress(task_id, 50)
        download_result = download_video(url, task_id, options)
        await update_task_progress(task_id, 90)
        
        # Determine result type based on format
        format_type = options.get('format', 'video')
        
        # Helper to strict sanitize filename
        def sanitize_filename(name):
            # Replace invalid chars with underscore
            clean = re.sub(r'[\\/*?:"<>|]', "", name)
            # Replace spaces with underscores
            clean = re.sub(r'\s+', "_", clean)
            return clean[:50]  # Limit length

        # Get title and builder platform-aware filename
        title = info.get('title', 'video')
        extractor = info.get('extractor', 'unknown').replace(':', '').title()
        
        # Clean up platform name (e.g. "YoutubeTab" -> "Youtube")
        if 'youtube' in extractor.lower(): extractor = 'YouTube'
        elif 'tiktok' in extractor.lower(): extractor = 'TikTok'
        elif 'instagram' in extractor.lower(): extractor = 'Instagram'
        elif 'facebook' in extractor.lower(): extractor = 'Facebook'
        
        clean_title = sanitize_filename(title)
        
        # Extension from actual file
        actual_ext = os.path.splitext(download_result['filename'])[1]
        if not actual_ext: actual_ext = ".mp4"
        
        # Formatted Name: My_Video_TikTok.mp4
        display_filename = f"{clean_title}_{extractor}{actual_ext}"
        
        if format_type == 'audio':
            result = AudioResult(
                download_url=f"{API_BASE_URL}/api/files/{download_result['filename']}?download_name={display_filename.replace('.mp4', '.mp3')}",
                filename=display_filename.replace('.mp4', '.mp3'),
                duration=info.get('duration', 0) or 0,
                format="mp3",
                file_size=download_result['file_size']
            )
        else:
            result = DownloadResult(
                download_url=f"{API_BASE_URL}/api/files/{download_result['filename']}?download_name={display_filename}",
                filename=display_filename,
                file_size=download_result['file_size'],
                duration=info.get('duration'),
                thumbnail_url=info.get('thumbnail')
            )
        
        await complete_task(task_id, result.model_dump())
        
    except Exception as e:
        await fail_task(task_id, str(e))


async def process_summary(task_id: str, url: str):
    """Process AI summary task - generates summary from video content"""
    try:
        await update_task_progress(task_id, 10)
        
        # Get video info
        info = get_video_info(url)
        await update_task_progress(task_id, 30)
        
        title = info.get('title', 'Unknown Video')
        description = info.get('description', '')
        
        # If OpenAI is configured, use it for summarization
        if OPENAI_API_KEY:
            try:
                from openai import OpenAI
                client = OpenAI(api_key=OPENAI_API_KEY)
                
                await update_task_progress(task_id, 50)
                
                response = client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=[
                        {"role": "system", "content": "You are a helpful assistant that summarizes video content. Create a well-structured markdown summary with key points and topics."},
                        {"role": "user", "content": f"Summarize this video:\n\nTitle: {title}\n\nDescription: {description}"}
                    ],
                    max_tokens=1000
                )
                
                summary_text = response.choices[0].message.content
                await update_task_progress(task_id, 80)
                
            except Exception as e:
                # Fallback to basic summary
                summary_text = f"## {title}\n\n{description[:500]}..."
        else:
            # Generate basic summary without AI
            await update_task_progress(task_id, 60)
            summary_text = f"""## Video Summary: {title}

### Description
{description[:1000] if description else 'No description available.'}

### Video Details
- **Duration**: {info.get('duration', 'N/A')} seconds
- **Views**: {info.get('view_count', 'N/A')}
- **Upload Date**: {info.get('upload_date', 'N/A')}
"""
        
        # Extract topics from tags
        tags = info.get('tags', []) or []
        topics = tags[:5] if tags else ['Video', 'Content']
        
        result = SummaryResult(
            markdown=summary_text,
            word_count=len(summary_text.split()),
            topics=topics
        )
        
        await complete_task(task_id, result.model_dump())
        
    except Exception as e:
        await fail_task(task_id, str(e))


async def process_spy(task_id: str, url: str):
    """Process metadata extraction task - extracts all video metadata"""
    try:
        await update_task_progress(task_id, 20)
        
        # Get video info
        info = get_video_info(url)
        await update_task_progress(task_id, 70)
        
        # Determine platform
        extractor = info.get('extractor', 'Unknown')
        platform = extractor.replace(':', ' ').title()
        
        # Format date from YYYYMMDD to DD/MM/YYYY
        upload_date = info.get('upload_date', '')
        formatted_date = upload_date
        if upload_date and len(upload_date) == 8:
            try:
                dt = datetime.strptime(upload_date, "%Y%m%d")
                formatted_date = dt.strftime("%d/%m/%Y")
            except ValueError:
                pass

        result = SpyResult(
            platform=platform,
            author=info.get('uploader', info.get('channel', 'Unknown')),
            author_avatar=info.get('uploader_url'),
            title=info.get('title', 'Unknown'),
            description=info.get('description', '')[:500],
            view_count=info.get('view_count', 0) or 0,
            like_count=info.get('like_count', 0) or 0,
            comment_count=info.get('comment_count', 0) or 0,
            share_count=info.get('repost_count', 0) or 0,
            tags=info.get('tags', [])[:10] or [],
            duration=info.get('duration', 0) or 0,
            thumbnail_url=info.get('thumbnail', ''),
            publish_date=formatted_date
        )
        
        await complete_task(task_id, result.model_dump())
        
    except Exception as e:
        await fail_task(task_id, str(e))


async def process_slideshow(task_id: str, url: str):
    """Process slideshow extraction task - extracts images from TikTok slideshows"""
    import httpx
    import re
    import zipfile
    from io import BytesIO
    
    try:
        await update_task_progress(task_id, 10)
        
        images = []
        
        # For TikTok URLs, use HTTP scraping
        if 'tiktok.com' in url.lower():
            try:
                headers = {
                    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.5',
                }
                
                await update_task_progress(task_id, 20)
                
                async with httpx.AsyncClient(follow_redirects=True, timeout=30) as client:
                    response = await client.get(url, headers=headers)
                    html = response.text
                    
                    await update_task_progress(task_id, 30)
                    
                    # Look for imagePost pattern in HTML - get ALL images
                    # Match the entire imagePost section to get all image objects
                    image_section = re.search(r'"imagePost":\s*\{"images":\s*\[(.*?)\]\s*,', html, re.DOTALL)
                    
                    if image_section:
                        images_data = image_section.group(1)
                        
                        # Split by image objects and extract first URL from each
                        # Each image object has an imageURL with urlList
                        image_objects = re.findall(r'\{"imageURL":\s*\{"urlList":\s*\["([^"]+)"', images_data)
                        
                        for encoded_url in image_objects:
                            # Decode the URL (replace \u002F with /)
                            decoded_url = encoded_url.replace('\\u002F', '/').replace('\\/', '/')
                            if decoded_url and 'tiktokcdn' in decoded_url:
                                images.append(decoded_url)
                    
                    # Deduplicate while preserving order
                    seen = set()
                    unique_images = []
                    for img in images:
                        if img not in seen:
                            seen.add(img)
                            unique_images.append(img)
                    images = unique_images[:20]  # Allow up to 20 images
                    
            except Exception as http_error:
                print(f"TikTok HTTP extraction error: {http_error}")
        
        # Fallback to yt-dlp for other platforms or if HTTP extraction failed
        if not images:
            try:
                info = get_video_info(url)
                await update_task_progress(task_id, 40)
                
                # Get thumbnails/images if available
                thumbnails = info.get('thumbnails', [])
                images = [t.get('url') for t in thumbnails if t.get('url')][:20]
                
                # If no thumbnails, use the main thumbnail
                if not images and info.get('thumbnail'):
                    images = [info.get('thumbnail')]
                    
            except Exception as yt_error:
                print(f"yt-dlp error: {yt_error}")
        
        if not images:
            raise Exception("No images found. This URL may not be a slideshow or TikTok may have changed their page structure.")
        
        await update_task_progress(task_id, 50)
        
        # Download images and create ZIP file
        zip_path = os.path.join(DOWNLOAD_DIR, f"{task_id}_slideshow.zip")
        
        async with httpx.AsyncClient(timeout=30) as client:
            with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
                for i, img_url in enumerate(images):
                    try:
                        # Download image
                        img_response = await client.get(img_url, headers={
                            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15',
                            'Referer': 'https://www.tiktok.com/'
                        })
                        
                        if img_response.status_code == 200:
                            # Determine extension
                            content_type = img_response.headers.get('content-type', 'image/jpeg')
                            ext = 'jpg' if 'jpeg' in content_type else 'png' if 'png' in content_type else 'webp' if 'webp' in content_type else 'jpg'
                            
                            # Add to ZIP
                            filename = f"image_{i+1:02d}.{ext}"
                            zipf.writestr(filename, img_response.content)
                            
                        # Update progress
                        progress = 50 + int((i + 1) / len(images) * 40)
                        await update_task_progress(task_id, progress)
                        
                    except Exception as download_error:
                        print(f"Failed to download image {i+1}: {download_error}")
        
        await update_task_progress(task_id, 95)
        
        result = SlideshowResult(
            download_url=f"{API_BASE_URL}/api/files/{task_id}_slideshow.zip",
            images=images,
            audio_url=None,
            filename=f"{task_id}_slideshow.zip"
        )
        
        await complete_task(task_id, result.model_dump())
        
    except Exception as e:
        await fail_task(task_id, str(e))


async def process_audio(task_id: str, url: str, options: dict = None):
    """Process audio extraction task - extracts audio + vocals + instrumental"""
    try:
        await update_task_progress(task_id, 10)
        options = options or {}
        
        # Get video info first
        info = get_video_info(url)
        await update_task_progress(task_id, 20)
        
        # Download audio first
        await update_task_progress(task_id, 30)
        audio_options = {'format': 'audio', 'audio_bitrate': options.get('audio_bitrate', '320')}
        download_result = download_video(url, task_id, options=audio_options)
        
        filepath = download_result['filepath']
        filename = download_result['filename']
        file_size = download_result['file_size']
        
        vocals_url = None
        vocals_filename = None
        instrumental_url = None
        instrumental_filename = None
        
        # Auto-separate vocals and instrumental
        await update_task_progress(task_id, 50)
        
        # Run demucs with --two-stems vocals to get vocals + instrumental (no_vocals)
        cmd = [
            "demucs",
            "-n", "htdemucs",
            "--two-stems", "vocals",
            "--mp3",
            "--mp3-bitrate", "320",
            filepath,
            "-o", DOWNLOAD_DIR
        ]
        
        # Run command
        process = await asyncio.create_subprocess_exec(
            *cmd,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )
        _, stderr = await process.communicate()
        
        if process.returncode != 0:
            print(f"Demucs warning: {stderr.decode()} - Continuing with just full audio")
        else:
            await update_task_progress(task_id, 90)
            
            # Find the output files
            track_name = os.path.splitext(filename)[0]
            model_name = "htdemucs"
            base_path = os.path.join(DOWNLOAD_DIR, model_name, track_name)
            
            # Identify files
            vocals_src = os.path.join(base_path, "vocals.mp3")
            instr_src = os.path.join(base_path, "no_vocals.mp3")
            
            # Move vocals
            if os.path.exists(vocals_src):
                vocals_filename = f"{task_id}_vocals.mp3"
                vocals_dest = os.path.join(DOWNLOAD_DIR, vocals_filename)
                os.rename(vocals_src, vocals_dest)
                vocals_url = f"{API_BASE_URL}/api/files/{vocals_filename}"
                
            # Move instrumental
            if os.path.exists(instr_src):
                instrumental_filename = f"{task_id}_instrumental.mp3"
                instr_dest = os.path.join(DOWNLOAD_DIR, instrumental_filename)
                os.rename(instr_src, instr_dest)
                instrumental_url = f"{API_BASE_URL}/api/files/{instrumental_filename}"
        
        await update_task_progress(task_id, 95)
        
        # Helper to strict sanitize filename
        def sanitize_filename(name):
            # Replace invalid chars with underscore
            clean = re.sub(r'[\\/*?:"<>|]', "", name)
            # Replace spaces with underscores
            clean = re.sub(r'\s+', "_", clean)
            return clean[:50]  # Limit length

        # Get title and builder platform-aware filename
        title = info.get('title', 'audio')
        extractor = info.get('extractor', 'unknown').replace(':', '').title()
        
        # Clean up platform name
        if 'youtube' in extractor.lower(): extractor = 'YouTube'
        elif 'tiktok' in extractor.lower(): extractor = 'TikTok'
        elif 'instagram' in extractor.lower(): extractor = 'Instagram'
        elif 'facebook' in extractor.lower(): extractor = 'Facebook'
        
        clean_title = sanitize_filename(title)
        
        # Base display name: My_Song_YouTube.mp3
        display_base = f"{clean_title}_{extractor}"
        display_full = f"{display_base}.mp3"
        display_vocals = f"{display_base}_Vocals.mp3"
        display_instr = f"{display_base}_Instrumental.mp3"

        result = AudioResult(
            download_url=f"{API_BASE_URL}/api/files/{filename}?download_name={display_full}",
            filename=display_full,
            duration=info.get('duration', 0) or 0,
            format="mp3",
            file_size=file_size,
            vocals_url=f"{vocals_url}?download_name={display_vocals}" if vocals_url else None,
            vocals_filename=display_vocals if vocals_url else None,
            instrumental_url=f"{instrumental_url}?download_name={display_instr}" if instrumental_url else None,
            instrumental_filename=display_instr if instrumental_url else None
        )
        
        await complete_task(task_id, result.model_dump())
        
    except Exception as e:
        await fail_task(task_id, str(e))


async def process_task(task_id: str, type: TaskType, url: str, options: dict = None):
    """Route task to appropriate processor"""
    try:
        if type == "download":
            await process_download(task_id, url, options)
        elif type == "summary":
            await process_summary(task_id, url)
        elif type == "spy":
            await process_spy(task_id, url)
        elif type == "slideshow":
            await process_slideshow(task_id, url)
        elif type == "audio":
            await process_audio(task_id, url, options)
        else:
            raise Exception(f"Unknown task type: {type}")
            
    except Exception as e:
        await fail_task(task_id, str(e))


# Task processor mapping
PROCESSORS = {
    "download": process_download,
    "summary": process_summary,
    "spy": process_spy,
    "slideshow": process_slideshow,
    "audio": process_audio,
}


async def process_task(task_id: str, task_type: TaskType, url: str, options: dict = None):
    """Main task processor that routes to specific handlers"""
    options = options or {}
    processor = PROCESSORS.get(task_type)
    if processor:
        # Pass options to download processor
        if task_type == 'download':
            await processor(task_id, url, options)
        else:
            await processor(task_id, url)
    else:
        await fail_task(task_id, f"Unknown task type: {task_type}")
