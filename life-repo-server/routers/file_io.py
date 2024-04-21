import os
import shutil
from typing import List

from fastapi import APIRouter, HTTPException
from fastapi import UploadFile, File, HTTPException
from fastapi.responses import JSONResponse

from config import (
    DATA_DIR,
    IMAGE_FILE_TYPES,
    MAX_FILE_UPLOAD_SIZE_BYTES,
    VIDEO_FILE_TYPES,
    AUDIO_FILE_TYPES,
    TEXT_FILE_TYPES,
    DATA_FILE_TYPES,
)

ALLOWED_FILE_TYPES = (
    IMAGE_FILE_TYPES
    + VIDEO_FILE_TYPES
    + AUDIO_FILE_TYPES
    + TEXT_FILE_TYPES
    + DATA_FILE_TYPES
)


router = APIRouter()


@router.get("/read-dir/", response_model=List[str])
async def read_dir(path: str):
    """Reads the contents of a directory."""
    try:
        return os.listdir(path)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Directory not found")


@router.get("/list-files-recursive/", response_model=List[str])
async def list_files_recursive(path: str):
    """Lists all files in a directory recursively."""
    files_list = []  # Initialize the list to collect file paths

    async def _list_files_recursive(inner_path: str):
        """Inner function to recursively list files."""
        try:
            for item in os.listdir(inner_path):
                full_path = os.path.join(inner_path, item)
                if os.path.isdir(full_path):
                    await _list_files_recursive(full_path)
                else:
                    files_list.append(full_path)
        except FileNotFoundError:
            raise HTTPException(status_code=404, detail="Directory not found")

    await _list_files_recursive(path)  # Start the recursive listing
    return files_list


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
