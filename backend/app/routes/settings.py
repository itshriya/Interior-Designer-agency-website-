from typing import Optional

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr

from app.config.database import db
from app.config.security import (
    get_current_user,
    verify_password,
    hash_password
)

router = APIRouter()


class UpdateSettings(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None

    current_password: Optional[str] = None
    new_password: Optional[str] = None


@router.get("/")
async def get_settings(
    current_user=Depends(get_current_user)
):
    user = await db.users.find_one(
        {"email": current_user["email"]}
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return {
        "name": user.get("name"),
        "email": user.get("email"),
        "role": user.get("role")
    }


@router.put("/")
async def update_settings(
    data: UpdateSettings,
    current_user=Depends(get_current_user)
):

    user = await db.users.find_one(
        {"email": current_user["email"]}
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    update_data = {}

    # Update Name
    if data.name is not None:
        update_data["name"] = data.name

    # Update Email
    if data.email is not None:

        existing = await db.users.find_one(
            {
                "email": data.email,
                "_id": {"$ne": user["_id"]}
            }
        )

        if existing:
            raise HTTPException(
                status_code=400,
                detail="Email already exists"
            )

        update_data["email"] = data.email

    # Update Password (Optional)
    password_requested = (
        data.current_password is not None or
        data.new_password is not None
    )

    if password_requested:

        if not data.current_password or not data.new_password:
            raise HTTPException(
                status_code=400,
                detail="Both current and new password are required."
            )

        if not verify_password(
            data.current_password,
            user["password"]
        ):
            raise HTTPException(
                status_code=400,
                detail="Current password is incorrect."
            )

        if data.current_password == data.new_password:
            raise HTTPException(
                status_code=400,
                detail="New password cannot be the same as the current password."
            )

        update_data["password"] = hash_password(
            data.new_password
        )

    if not update_data:
        raise HTTPException(
            status_code=400,
            detail="Nothing to update."
        )

    await db.users.update_one(
        {"_id": user["_id"]},
        {
            "$set": update_data
        }
    )

    return {
        "message": "Settings updated successfully."
    }

@router.delete("/")
async def delete_account(
    current_user=Depends(get_current_user)
):

    user = await db.users.find_one(
        {"email": current_user["email"]}
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    await db.users.delete_one(
        {"_id": user["_id"]}
    )

    return {
        "message": "Account deleted successfully."
    }