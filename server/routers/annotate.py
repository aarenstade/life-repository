import os
from fastapi import APIRouter, HTTPException, Request
from typing import List

from dbio.supabase import SupabaseDatabaseAdapter

router = APIRouter()


@router.post("/insert/file", response_model=dict)
async def insert_file_annotation(request: Request):
    db = SupabaseDatabaseAdapter(
        url=os.environ["SUPABASE_URL"], key=os.environ["SUPABASE_SECRET_KEY"]
    )

    body = await request.json()
    print(body)
    file, path = body["file"], body["path"]

    if not file or not path:
        raise HTTPException(status_code=400, detail="File or path is required")

    file_id = file["file_id"]
    file_uri = file["uri"]
    file_description = file["description"]
    file_tags = file["tags"]

    file_data = {
        "id": file_id,
        "name": os.path.basename(file_uri),
        "type": "IMAGE",
        "path": path,
    }

    db.insert("files", file_data)

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
    db = SupabaseDatabaseAdapter(
        url=os.environ["SUPABASE_URL"], key=os.environ["SUPABASE_SECRET_KEY"]
    )

    body = await request.json()
    print(body)
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
