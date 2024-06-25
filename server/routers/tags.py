import os
import traceback
from fastapi import APIRouter, HTTPException, Request
from typing import List

from dbio.supabase import SupabaseDatabaseAdapter

router = APIRouter()


@router.get("/autocomplete", response_model=List[dict])
async def get_tag_annotations(request: Request, search: str):
    try:
        db = SupabaseDatabaseAdapter(
            url=os.environ["SUPABASE_URL"], key=os.environ["SUPABASE_SECRET_KEY"]
        )

        try:
            results = (
                db.client.table("tags")
                .select("id, tag")
                .ilike("tag", f"{search}%")
                .execute()
            )
        except Exception as e:
            print(e)
            print(traceback.format_exc())
            raise HTTPException(status_code=500, detail=str(e))

        return results.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/insert", response_model=dict)
async def insert_tag(request: Request):
    db = SupabaseDatabaseAdapter(
        url=os.environ["SUPABASE_URL"], key=os.environ["SUPABASE_SECRET_KEY"]
    )

    body = await request.json()
    response = db.insert("tags", {"tag": body["tag"].lower()})
    return response[0] if response else None
