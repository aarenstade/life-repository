import os
from fastapi import APIRouter, Request
from typing import List

from dbio.supabase import SupabaseDatabaseAdapter

router = APIRouter()


@router.get("/autocomplete", response_model=List[str])
async def get_tag_annotations(request: Request, search: str):
    db = SupabaseDatabaseAdapter(
        url=os.environ["SUPABASE_URL"], key=os.environ["SUPABASE_SECRET_KEY"]
    )

    results = (
        db.client.from_("tags")
        .select("tag")
        .like("tag", f"%{search.lower()}%")
        .limit(10)
        .execute()
    )

    return [result["tag"] for result in results.data]


@router.post("/insert", response_model=dict)
async def insert_tag(request: Request):
    db = SupabaseDatabaseAdapter(
        url=os.environ["SUPABASE_URL"], key=os.environ["SUPABASE_SECRET_KEY"]
    )

    body = await request.json()
    db.insert("tags", {"tag": body["tag"].lower()})
    return {"message": "Tag inserted successfully."}
