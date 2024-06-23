import datetime
import json
import os
import shutil
from typing import List
import mimetypes

from fastapi import (
    Request,
    APIRouter,
    HTTPException,
    UploadFile,
    HTTPException,
    Form,
    File,
)

from fastapi.responses import FileResponse, JSONResponse

from pydantic import BaseModel
import subprocess


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
    ANNOTATED_FILES_DIR,
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
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(path)


@router.post("/upload-file/")
async def upload_file(file: UploadFile = File(...), metadata: str = Form(...)):
    file_size = len(await file.read())
    if file_size > MAX_FILE_UPLOAD_SIZE_BYTES:
        raise HTTPException(status_code=413, detail="File size exceeds limit of 10MB")

    await file.seek(0)

    file_extension = file.filename.split(".")[-1]
    if file_extension not in ALLOWED_FILE_TYPES:
        raise HTTPException(status_code=400, detail="File type not allowed")

    secure_filename = file.filename.replace("..", "").replace("/", "").replace("\\", "")
    file_path = os.path.join(ANNOTATED_FILES_DIR, secure_filename)
    os.makedirs(os.path.dirname(file_path), exist_ok=True)

    with open(file_path, "wb") as buffer:
        while True:
            chunk = await file.read(1024)  # Read in chunks of 1024 bytes
            if not chunk:
                break
            buffer.write(chunk)

    try:
        metadata_dict = json.loads(metadata)
        metadata_args = []
        for key, value in metadata_dict.items():
            if isinstance(value, list):
                value = ",".join(map(str, value))
            metadata_args.append(f"-{key}={value}")

        subprocess.run(["exiftool", *metadata_args, file_path])
    except (json.JSONDecodeError, subprocess.CalledProcessError) as e:
        print("Error adding metadata:", e)

    return JSONResponse(
        status_code=200,
        content={
            "message": "File uploaded successfully",
            "filename": secure_filename,
            "path": file_path,
        },
    )


# Consider adding routes for:
# - Creating directories
# - Writing to files
# - Deleting files or directories
