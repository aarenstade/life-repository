from typing import Optional
from pydantic import BaseModel
from datetime import datetime


class FileMetadata(BaseModel):
    size: Optional[int] = None
    created_at: Optional[datetime] = None
    modified_at: Optional[datetime] = None


class ImageMetadata(FileMetadata):
    width: Optional[int] = None
    height: Optional[int] = None
    color_mode: Optional[str] = None
    format: Optional[str] = None
    properties: Optional[dict] = None
    xmp_data: Optional[dict] = None
    location: Optional[tuple[float, float]] = None


class VideoMetadata(FileMetadata):
    duration: Optional[float] = None
    width: Optional[int] = None
    height: Optional[int] = None
    framerate: Optional[float] = None
    codec: Optional[str] = None
    bitrate: Optional[int] = None
    properties: Optional[dict] = None
    location: Optional[tuple[float, float]] = None


class TextMetadata(FileMetadata):
    num_words: Optional[int] = None
    language: Optional[str] = None
    encoding: Optional[str] = None


class AudioMetadata(FileMetadata):
    bitrate: Optional[int] = None
    duration: Optional[float] = None
    sample_rate: Optional[int] = None
    channels: Optional[int] = None
    codec: Optional[str] = None


class ArchiveMetadata(FileMetadata):
    num_files: Optional[int] = None
    compression_type: Optional[str] = None
    encrypted: Optional[bool] = None


class DocumentMetadata(FileMetadata):
    num_pages: Optional[int] = None
    author: Optional[str] = None
    title: Optional[str] = None
    language: Optional[str] = None
