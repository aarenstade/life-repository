from enum import Enum
from typing import Optional
from pydantic import BaseModel

from models.file_metadata import FileMetadata


class FileType(str, Enum):
    IMAGE = "IMAGE"
    VIDEO = "VIDEO"
    TEXT = "TEXT"
    AUDIO = "AUDIO"
    ARCHIVE = "ARCHIVE"
    DOCUMENT = "DOCUMENT"
    OTHER = "OTHER"


class File(BaseModel):
    id: str
    name: Optional[str] = None
    type: FileType
    path: str
    metadata_id: Optional[int] = None
    metadata: Optional[FileMetadata] = None

    class Config:
        from_attributes = True
