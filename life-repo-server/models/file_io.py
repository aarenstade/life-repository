from pydantic import BaseModel
from datetime import datetime


class FileItemModel(BaseModel):
    generic_file_type: str
    specific_file_type: str
    size_bytes: int
    added_at: datetime
    created_at: datetime
    modified_at: datetime
    is_directory: bool
    name: str
