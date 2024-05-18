import os
from enum import Enum
from typing import Any, Tuple, Optional
from pydantic import BaseModel


class FileType(str, Enum):
    IMAGE = "Image"
    VIDEO = "Video"
    TEXT = "Text"
    AUDIO = "Audio"
    ARCHIVE = "Archive"
    DOCUMENT = "Document"
    OTHER = "Other"


class FileMetadata(BaseModel):
    size: int
    created_at: Optional[Any] = None
    modified_at: Optional[Any] = None


class ImageMetadata(FileMetadata):
    resolution: Optional[Tuple[int, int]] = None
    color_mode: Optional[str] = None
    format: Optional[str] = None


class VideoMetadata(FileMetadata):
    duration: Optional[float] = None
    resolution: Optional[Tuple[int, int]] = None
    framerate: Optional[float] = None
    codec: Optional[str] = None
    bitrate: Optional[int] = None


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
