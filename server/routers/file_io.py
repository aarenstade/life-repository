import datetime
import os
import shutil
from typing import List
import mimetypes

from fastapi import APIRouter, HTTPException, Request
from fastapi import UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel


# TODO remove this completely and utilize a partial type from tables
class FileItemModel(BaseModel):
    generic_file_type: str
    specific_file_type: str
    size_bytes: int
    added_at: str
    created_at: str
    modified_at: str
    is_directory: bool
    name: str


from config import (
    DATA_DIR,
    IMAGE_FILE_TYPES,
    MAX_FILE_UPLOAD_SIZE_BYTES,
    VIDEO_FILE_TYPES,
    AUDIO_FILE_TYPES,
    TEXT_FILE_TYPES,
    DATA_FILE_TYPES,
    load_config,
)

ALLOWED_FILE_TYPES = (
    IMAGE_FILE_TYPES
    + VIDEO_FILE_TYPES
    + AUDIO_FILE_TYPES
    + TEXT_FILE_TYPES
    + DATA_FILE_TYPES
)


router = APIRouter()


async def gather_file_details(full_path: str, item: str) -> dict:
    """Gathers details of a file or directory."""
    file_info = os.stat(full_path)
    mime_type, _ = mimetypes.guess_type(full_path)
    return {
        "name": item,
        "is_directory": os.path.isdir(full_path),
        "generic_file_type": mime_type.split("/")[0] if mime_type else "unknown",
        "specific_file_type": mime_type if mime_type else "unknown",
        "size_bytes": file_info.st_size,
        "added_at": datetime.datetime.fromtimestamp(file_info.st_ctime).strftime(
            "%Y-%m-%d %H:%M:%S"
        ),
        "created_at": datetime.datetime.fromtimestamp(file_info.st_ctime).strftime(
            "%Y-%m-%d %H:%M:%S"
        ),
        "modified_at": datetime.datetime.fromtimestamp(file_info.st_mtime).strftime(
            "%Y-%m-%d %H:%M:%S"
        ),
    }


async def list_directory_contents(path: str, recursive: bool = False) -> List[dict]:
    """Lists contents of a directory, optionally recursively."""
    files_details = []

    async def _list_contents(inner_path: str):
        try:
            for item in os.listdir(inner_path):
                full_path = os.path.join(inner_path, item)
                if os.path.isdir(full_path):
                    files_details.append(await gather_file_details(full_path, item))
                    if recursive:
                        await _list_contents(full_path)
                else:
                    files_details.append(await gather_file_details(full_path, item))
        except FileNotFoundError:
            raise HTTPException(status_code=404, detail="Directory not found")

    await _list_contents(path)
    return files_details


@router.get("/read-dir/", response_model=List[FileItemModel])
async def read_dir(request: Request, path: str):
    """Reads the contents of a directory and returns file details."""
    config = load_config()
    root_paths = config.get("root_paths", [])

    if not any(path.startswith(root_path) for root_path in root_paths):
        raise HTTPException(status_code=403, detail="Access denied")

    try:
        directory_contents = await list_directory_contents(path, recursive=False)
        return directory_contents
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Directory not found")


@router.get("/list-files-recursive/", response_model=List[FileItemModel])
async def list_files_recursive(request: Request, path: str):
    """Lists all files in a directory recursively and returns their details."""
    try:
        directory_contents = await list_directory_contents(path, recursive=True)
        return directory_contents
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Directory not found")


@router.get("/get-file/")
async def get_file(path: str):
    """Returns the contents of a file."""
    try:
        with open(path, "r") as file:
            return file.read()
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="File not found")


@router.post("/upload-file/")
async def upload_file(file: UploadFile = File(...)):
    # Check file size
    file_size = len(await file.read())
    if file_size > MAX_FILE_UPLOAD_SIZE_BYTES:
        raise HTTPException(status_code=413, detail="File size exceeds limit of 10MB")

    # Reset file pointer after reading for size
    await file.seek(0)

    # Validate file type
    file_extension = file.filename.split(".")[-1]
    if file_extension not in ALLOWED_FILE_TYPES:
        raise HTTPException(status_code=400, detail="File type not allowed")

    # Define secure file path (prevents directory traversal attacks)
    secure_filename = file.filename.replace("..", "").replace("/", "").replace("\\", "")
    file_path = os.path.join(DATA_DIR, secure_filename)

    # Save file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(await file.read(), buffer)

    # Note: For production, consider scanning the file for malware here if it's to be executed or opened by the system.
    # This can be done using third-party services or open-source tools. Ensure that the scanning process is secure and respects user privacy.

    return JSONResponse(
        status_code=200,
        content={"message": "File uploaded successfully", "filename": secure_filename},
    )


# Consider adding routes for:
# - Creating directories
# - Writing to files
# - Deleting files or directories
