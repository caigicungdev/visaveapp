from pydantic import BaseModel, HttpUrl
from typing import Optional, Literal, Union, List
from datetime import datetime

# Task types
TaskType = Literal["download", "summary", "spy", "slideshow", "audio"]
TaskStatus = Literal["pending", "processing", "completed", "failed"]


# Request Models
class ProcessRequest(BaseModel):
    type: TaskType
    url: str
    format: Optional[Literal["video", "audio"]] = None
    quality: Optional[str] = None
    ytdlp_format: Optional[str] = None
    audio_bitrate: Optional[str] = None


# Response Models
class CreateTaskResponse(BaseModel):
    task_id: str
    message: str


class DownloadResult(BaseModel):
    type: Literal["download"] = "download"
    download_url: str
    filename: str
    file_size: int
    duration: Optional[int] = None
    thumbnail_url: Optional[str] = None


class SummaryResult(BaseModel):
    type: Literal["summary"] = "summary"
    markdown: str
    word_count: int
    topics: List[str]


class SpyResult(BaseModel):
    type: Literal["spy"] = "spy"
    platform: str
    author: str
    author_avatar: Optional[str] = None
    title: str
    description: str
    view_count: int
    like_count: int
    comment_count: int
    share_count: Optional[int] = None
    tags: List[str]
    duration: int
    thumbnail_url: str
    publish_date: Optional[str] = None


class SlideshowResult(BaseModel):
    type: Literal["slideshow"] = "slideshow"
    download_url: str
    images: List[str]
    audio_url: Optional[str] = None
    filename: str


class AudioResult(BaseModel):
    type: Literal["audio"] = "audio"
    download_url: str
    filename: str
    duration: float
    format: str
    file_size: int
    # Optional fields for separated tracks
    vocals_url: Optional[str] = None
    vocals_filename: Optional[str] = None
    instrumental_url: Optional[str] = None
    instrumental_filename: Optional[str] = None


TaskResult = Union[DownloadResult, SummaryResult, SpyResult, SlideshowResult, AudioResult]


class Task(BaseModel):
    id: str
    user_id: Optional[str] = None
    type: TaskType
    status: TaskStatus
    progress: int
    input_url: str
    result: Optional[TaskResult] = None
    error_message: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
