from fastapi import APIRouter, HTTPException, Depends
from typing import Optional
from pydantic import BaseModel
from app.config.database import db
from app.config.security import get_current_user

router = APIRouter()

# ---------- Request model for profile updates ----------
class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None

# ---------- GET current profile ----------
@router.get("/profile")
async def get_profile(payload: dict = Depends(get_current_user)):
    email = payload.get("email")
    if not email:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = await db.users.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "name": user.get("name", ""),
        "email": user.get("email", ""),
        "phone": user.get("phone", ""),
        "created_at": str(user.get("created_at", "")),
    }

# ---------- PUT update profile ----------
@router.put("/profile")
async def update_profile(
    data: ProfileUpdate,
    payload: dict = Depends(get_current_user)
):
    email = payload.get("email")
    if not email:
        raise HTTPException(status_code=401, detail="Invalid token")

    # Prepare the fields to update (only those provided)
    update_fields = {}
    if data.name is not None:
        update_fields["name"] = data.name
    if data.phone is not None:
        update_fields["phone"] = data.phone

    if not update_fields:
        raise HTTPException(status_code=400, detail="No fields to update")

    result = await db.users.update_one(
        {"email": email},
        {"$set": update_fields}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")

    return {"message": "Profile updated successfully"}