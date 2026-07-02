from fastapi import APIRouter, HTTPException, Depends
from bson import ObjectId
from pydantic import BaseModel
from typing import Optional
from app.config.database import db
from app.config.security import get_current_user

router = APIRouter()

# ---------- Pydantic model for saving an item ----------
class SaveItemRequest(BaseModel):
    title: str
    category: str
    image_url: str
    type: Optional[str] = "design"   # "design" or "blog"
    original_id: Optional[str] = None

# ---------- GET all saved items ----------
@router.get("/saved-designs")
async def get_saved_items(payload: dict = Depends(get_current_user)):
    email = payload.get("email")
    if not email:
        raise HTTPException(status_code=401, detail="Invalid token")

    saved_cursor = db.saved_designs.find({"user_email": email})
    saved_items = []
    async for doc in saved_cursor:
        saved_items.append({
            "_id": str(doc["_id"]),
            "title": doc.get("title", ""),
            "category": doc.get("category", ""),
            "image_url": doc.get("image_url", ""),
            "type": doc.get("type", "design"),
        })
    return saved_items

# ---------- POST save a new item ----------
@router.post("/saved-designs")
async def save_item(data: SaveItemRequest, payload: dict = Depends(get_current_user)):
    email = payload["email"]

    doc = {
        "user_email": email,
        "title": data.title,
        "category": data.category,
        "image_url": data.image_url,
        "type": data.type,
    }
    if data.original_id:
        doc["original_id"] = data.original_id

    result = await db.saved_designs.insert_one(doc)
    return {"message": "Item saved", "id": str(result.inserted_id)}

# ---------- DELETE saved item ----------
@router.delete("/saved-designs/{item_id}")
async def remove_saved_item(item_id: str, payload: dict = Depends(get_current_user)):
    email = payload.get("email")
    if not email:
        raise HTTPException(status_code=401, detail="Invalid token")

    if not ObjectId.is_valid(item_id):
        raise HTTPException(status_code=400, detail="Invalid item ID")

    result = await db.saved_designs.delete_one({
        "_id": ObjectId(item_id),
        "user_email": email
    })

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Item not found")

    return {"message": "Item removed"}