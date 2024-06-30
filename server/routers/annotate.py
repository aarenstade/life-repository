import os
import traceback
from typing import List
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
        file_description = file_description[0] if file_description else {}

        if not file:
            continue

        file_annotations.append(
            {
                "file_id": file_id,
                "uri": file.get("path"),
                "description": file_description.get("manual_description"),
                "date_description": file_description.get("date_description"),
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
        "date_description": group.get("date_description"),
        "cover_image_file_id": group.get("cover_image_file_id"),
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


@router.post("/group/status", response_model=List[dict])
async def get_group_status(request: Request):
    body = await request.json()

    group_id = body["group_id"]
    file_ids = body["file_ids"]

    db = get_db()
    group = db.select("groups", "*", {"id": group_id})

    if not group:
        raise HTTPException(status_code=404, detail="Group not found")

    group = group[0]
    file_statuses = []

    for file_id in file_ids:
        file = db.select("files", "*", {"id": file_id})
        if not file:
            file_statuses.append(
                {
                    "file_id": file_id,
                    "exists_path": False,
                    "exists_db": False,
                    "data": None,
                }
            )
            continue

        file = file[0]
        file_path = file.get("path")
        exists_path = os.path.exists(file_path)
        exists_db = True

        file_groups = db.select(
            "file_groups", "*", {"file_id": file_id, "group_id": group_id}
        )
        if not file_groups:
            db.insert("file_groups", {"file_id": file_id, "group_id": group_id})

        file_data = {
            "file_id": file_id,
            "uri": file.get("path"),
            "description": file.get("description"),
            "date_description": file.get("date_description"),
            "tags": file.get("tags"),
            "annotated_at": file.get("created_at"),
            "added_at": file.get("created_at"),
            "status": "uploaded",
            "uploaded_at": file.get("created_at"),
            "metadata": file.get("metadata"),
        }

        file_statuses.append(
            {
                "file_id": file_id,
                "exists_path": exists_path,
                "exists_db": exists_db,
                "data": file_data,
            }
        )

    return file_statuses


"""
Write Functions

"""


@router.post("/insert/file", response_model=dict)
async def insert_file_annotation(request: Request):
    try:
        db = get_db()

        body = await request.json()
        file, path = body["file"], body["path"]

        if not file or not path:
            raise HTTPException(status_code=400, detail="File or path is required")

        file_id = file["file_id"]
        file_uri = file["uri"]
        file_description = file["description"]
        date_description = file.get("date_description")
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

        db.upsert("files", file_data)

        for thumbnail_path in thumbnail_paths:
            db.upsert(
                "file_thumbnails",
                {
                    "file_id": file_id,
                    "thumbnail_path": thumbnail_path,
                },
            )

        file_description_data = {
            "file_id": file_id,
            "manual_description": file_description,
            "date_description": date_description,
            "generated_description": None,
            "generated_description_model": None,
        }

        db.upsert("file_descriptions", file_description_data)

        for tag in file_tags:
            file_tag_data = {"file_id": file_id, "tag_id": tag["id"]}
            db.upsert("file_tags", file_tag_data)

        print("File and related data inserted successfully")
        return {"message": "File and related data inserted successfully"}
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.post("/update/file_descriptions", response_model=dict)
async def update_file_annotation(request: Request):
    db = get_db()

    file = await request.json()

    file_id = file["file_id"]
    file_description = file["description"]
    date_description = file.get("date_description")

    file_description_data = {
        "file_id": file_id,
        "manual_description": file_description,
        "date_description": date_description,
        "generated_description": None,
        "generated_description_model": None,
    }

    response = db.update(
        "file_descriptions", file_description_data, {"file_id": file_id}
    )
    print(response)
    return {"message": "File description updated successfully"}


@router.post("/update/file_tags", response_model=dict)
async def update_file_tags(request: Request):
    db = get_db()

    file = await request.json()
    file_id = file["file_id"]
    file_tags = file["tags"]

    db.delete("file_tags", {"file_id": file_id})

    for tag in file_tags:
        file_tag_data = {"file_id": file_id, "tag_id": tag["id"]}
        db.upsert("file_tags", file_tag_data)

    return {"message": "File tags updated successfully"}


@router.post("/delete/file", response_model=dict)
async def delete_file_annotation(request: Request):
    db = get_db()

    body = await request.json()
    file_id = body["file_id"]

    file_record = db.select("files", "path", {"id": file_id})

    if file_record:
        file_path = file_record[0]["path"]
        os.remove(file_path)
        db.delete("files", {"id": file_id})
        return {"message": "File deleted successfully"}

    return {"message": "File not found"}


@router.post("/insert/group", response_model=dict)
async def insert_group_annotation(request: Request):
    db = get_db()

    body = await request.json()
    group_id = body["group_id"]

    title = body.get("title")
    description = body.get("description")
    date_description = body.get("date_description")
    tags = body.get("tags")

    group_data = {
        "id": group_id,
        "title": title,
        "description": description,
        "date_description": date_description,
    }

    db.upsert("groups", group_data)

    for tag in tags:
        group_tag_data = {"group_id": group_id, "tag_id": tag["id"]}
        db.upsert("group_tags", group_tag_data)

    print("Group inserted successfully")
    return {"message": "Group inserted successfully"}


@router.post("/insert/file_groups", response_model=dict)
async def insert_file_groups(request: Request):
    print("inserting file groups!")
    db = get_db()

    body = await request.json()

    group_id = body["group_id"]
    cover_image_file_id = body.get("cover_image_file_id")
    file_ids = [file["file_id"] for file in body.get("files", [])]

    for file_id in file_ids:
        try:
            group_file_data = {"group_id": group_id, "file_id": file_id}
            db.upsert("file_groups", group_file_data)

            if file_id == cover_image_file_id:
                db.upsert("groups", {"cover_image_file_id": file_id}, {"id": group_id})

        except Exception as e:
            print(f"file_id {file_id}: Failed to insert file group data: {e}")

    return {"message": "File groups inserted successfully"}
