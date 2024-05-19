from typing import Optional
from pydantic import BaseModel
from datetime import datetime


class FileMetadata(BaseModel):
    size: int
    created_at: datetime
    modified_at: datetime


class ImageMetadata(BaseModel):
    width: Optional[int] = None
    height: Optional[int] = None
    color_mode: Optional[str] = None
    format: Optional[str] = None


class VideoMetadata(BaseModel):
    duration: Optional[int] = None
    width: Optional[int] = None
    height: Optional[int] = None
    framerate: Optional[float] = None
    codec: Optional[str] = None
    bitrate: Optional[int] = None


class TextMetadata(BaseModel):
    num_words: Optional[int] = None
    language: Optional[str] = None
    encoding: Optional[str] = None


class AudioMetadata(BaseModel):
    bitrate: Optional[int] = None
    duration: Optional[int] = None
    sample_rate: Optional[int] = None
    channels: Optional[int] = None
    codec: Optional[str] = None


class ArchiveMetadata(BaseModel):
    num_files: Optional[int] = None
    compression_type: Optional[str] = None
    encrypted: Optional[bool] = None


class DocumentMetadata(BaseModel):
    num_pages: Optional[int] = None
    author: Optional[str] = None
    title: Optional[str] = None
    language: Optional[str] = None
