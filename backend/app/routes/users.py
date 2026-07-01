from fastapi import APIRouter, HTTPException, Depends
from bson import ObjectId

from app.config.database import db
from app.config.security import get_current_user
from pydantic import BaseModel

router = APIRouter()


class UpdateRole(BaseModel):
    role: str


@router.get("/")
async def get_users(current_user=Depends(get_current_user)):

    if current_user["role"] != "admin":
        raise HTTPException(
            status_code=403,
            detail="Access denied"
        )

    users = []

    async for user in db.users.find():

        users.append(
            {
                "id": str(user["_id"]),
                "name": user.get("name"),
                "email": user.get("email"),
                "role": user.get("role"),
                "created_at": user.get("created_at")
            }
        )

    return users


@router.get("/{user_id}")
async def get_user(
    user_id: str,
    current_user=Depends(get_current_user)
):

    if current_user["role"] != "admin":
        raise HTTPException(
            status_code=403,
            detail="Access denied"
        )

    if not ObjectId.is_valid(user_id):
        raise HTTPException(
            status_code=400,
            detail="Invalid user id"
        )

    user = await db.users.find_one(
        {
            "_id": ObjectId(user_id)
        }
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return {
        "id": str(user["_id"]),
        "name": user.get("name"),
        "email": user.get("email"),
        "role": user.get("role"),
        "created_at": user.get("created_at")
    }


@router.put("/{user_id}/role")
async def update_role(
    user_id: str,
    data: UpdateRole,
    current_user=Depends(get_current_user)
):

    if current_user["role"] != "admin":
        raise HTTPException(
            status_code=403,
            detail="Access denied"
        )

    if data.role not in ["admin", "user"]:
        raise HTTPException(
            status_code=400,
            detail="Invalid role"
        )

    result = await db.users.update_one(
        {
            "_id": ObjectId(user_id)
        },
        {
            "$set": {
                "role": data.role
            }
        }
    )

    if result.modified_count == 0:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return {
        "message": "Role updated successfully"
    }


@router.delete("/{user_id}")
async def delete_user(
    user_id: str,
    current_user=Depends(get_current_user)
):

    if current_user["role"] != "admin":
        raise HTTPException(
            status_code=403,
            detail="Access denied"
        )

    user = await db.users.find_one(
        {
            "_id": ObjectId(user_id)
        }
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    if user["email"] == current_user["email"]:
        raise HTTPException(
            status_code=400,
            detail="You cannot delete your own account."
        )

    await db.users.delete_one(
        {
            "_id": ObjectId(user_id)
        }
    )

    return {
        "message": "User deleted successfully"
    }