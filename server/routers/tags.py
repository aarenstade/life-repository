from fastapi import APIRouter, HTTPException, Request
from typing import List

router = APIRouter()


@router.get("/autocomplete", response_model=List[str])
async def get_tag_annotations(request: Request, search: str):
    print(request.app.state)
    db = request.app.state.db

    try:
        tags = db.fetch_all(
            "SELECT tag FROM tags WHERE tag LIKE :search_tag ORDER BY tag ASC LIMIT 10",
            {"search_tag": f"%{search}%"},
        )
        if not tags:
            return []
        return [tag["tag"] for tag in tags]
    finally:
        db.disconnect()


@router.post("/insert", response_model=dict)
async def insert_tag(request: Request):
    body = await request.json()
    db = request.app.state.db
    try:
        db.insert("tags", {"tag": body["tag"]})
        return {"message": "Tag inserted successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.disconnect()
