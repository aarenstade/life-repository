import os
from fastapi import APIRouter, HTTPException, Request

from config import Config
from utilities.general import get_db
from services.thumbnail_extractor import ThumbnailExtractor


config = Config()

router = APIRouter()

"""

Read Functions

"""


@router.get("/group/{group_id}", response_model=dict)
async def get_group_annotation(group_id: str):
    db = get_db()

    group = db.select("groups", "*", {"id": group_id})
    group = group[0] if group else None

    if not group:
        raise HTTPException(status_code=404, detail="Group not found")

    group_tags = db.select("group_tags", "*", {"group_id": group_id})
    tags = [tag["tag_id"] for tag in group_tags]

    files = db.select("file_groups", "*", {"group_id": group_id})
    file_ids = [file["file_id"] for file in files]

    file_annotations = []
    for file_id in file_ids:
        file = db.select("files", "*", {"id": file_id})
        file_description = db.select("file_descriptions", "*", {"file_id": file_id})
        file_tags = db.select("file_tags", "*", {"file_id": file_id})
        tags = [tag["tag_id"] for tag in file_tags]

        file = file[0] if file else None
        file_description = file_description[0] if file_description else None

        if not file:
            continue

        file_annotations.append(
            {
                "file_id": file_id,
                "uri": file.get("path"),
                "description": file_description.get("manual_description"),
                "tags": tags,
                "annotated_at": file_description.get("created_at"),
                "added_at": file.get("created_at"),
                "status": "uploaded",
                "uploaded_at": file.get("created_at"),
                "metadata": file.get("metadata"),
            }
        )
    group_annotation = {
        "group_id": group_id,
        "title": group.get("title"),
        "description": group.get("description"),
        "tags": tags,
        "files": file_annotations,
        "created_at": group.get("created_at"),
        "updated_at": group.get("updated_at"),
    }

    return group_annotation


@router.get("/groups/ids", response_model=list)
async def get_all_group_ids():
    db = get_db()

    groups = db.select("groups", "*")
    group_ids = [group["id"] for group in groups]

    return group_ids


"""

Write Functions

"""


@router.post("/insert/file", response_model=dict)
async def insert_file_annotation(request: Request):
    db = get_db()

    body = await request.json()
    file, path = body["file"], body["path"]

    if not file or not path:
        raise HTTPException(status_code=400, detail="File or path is required")

    file_id = file["file_id"]
    file_uri = file["uri"]
    file_description = file["description"]
    file_tags = file["tags"]

    thumbnail_extractor = ThumbnailExtractor(
        media_path=path, output_dir=config.thumbnails_dir
    )
    thumbnail_paths = thumbnail_extractor.extract()
    thumbnail_paths = thumbnail_paths if thumbnail_paths else []

    file_data = {
        "id": file_id,
        "name": os.path.basename(file_uri),
        "type": "IMAGE",
        "path": path,
    }

    db.insert("files", file_data)

    for thumbnail_path in thumbnail_paths:
        db.insert(
            "file_thumbnails",
            {
                "file_id": file_id,
                "thumbnail_path": thumbnail_path,
            },
        )

    file_description_data = {
        "file_id": file_id,
        "manual_description": file_description,
        "generated_description": None,
        "generated_description_model": None,
    }

    db.insert("file_descriptions", file_description_data)

    for tag in file_tags:
        file_tag_data = {"file_id": file_id, "tag_id": tag["id"]}
        db.insert("file_tags", file_tag_data)

    print("File and related data inserted successfully")
    return {"message": "File and related data inserted successfully"}


@router.post("/insert/group", response_model=dict)
async def insert_group_annotation(request: Request):
    db = get_db()

    body = await request.json()
    group_id = body["group_id"]
    title, description = body["title"], body["description"]
    tags = body["tags"]

    group_data = {
        "id": group_id,
        "title": title,
        "description": description,
    }

    db.insert("groups", group_data)

    for tag in tags:
        group_tag_data = {"group_id": group_id, "tag_id": tag["id"]}
        db.insert("group_tags", group_tag_data)

    print("Group inserted successfully")
    return {"message": "Group inserted successfully"}


@router.post("/insert/file_groups", response_model=dict)
async def insert_file_groups(request: Request):
    db = get_db()

    body = await request.json()

    group_id = body["group_id"]
    cover_image_file_id = body["cover_image_file_id"]
    file_ids = [file["file_id"] for file in body.get("files", [])]

    for file_id in file_ids:
        try:
            group_file_data = {"group_id": group_id, "file_id": file_id}
            db.insert("file_groups", group_file_data)

            if file_id == cover_image_file_id:
                db.update("groups", {"cover_image_file_id": file_id}, {"id": group_id})

        except Exception as e:
            print(f"Failed to insert file group data for file_id {file_id}: {e}")

    return {"message": "File groups inserted successfully"}
