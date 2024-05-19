from enum import Enum
from typing import Optional
from pydantic import BaseModel


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

    class Config:
        from_attributes = True
