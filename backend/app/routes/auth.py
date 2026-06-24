from fastapi import APIRouter, HTTPException
from app.model.user import (
    UserSignup,
    UserLogin
)
from app.config.database import db
from app.config.security import (
    hash_password,
    verify_password,
    create_access_token
)

router = APIRouter()

@router.post("/signup")
async def signup(user: UserSignup):

    existing_user = await db.users.find_one(
        {"email": user.email}
    )

    if existing_user:

        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    user_data = user.model_dump()

    user_data["password"] = hash_password(
        user.password
    )

    await db.users.insert_one(user_data)

    return {
        "message": "User created successfully"
    }

@router.post("/login")
async def login(user: UserLogin):

    existing_user = await db.users.find_one(
        {"email": user.email}
    )

    if not existing_user:

        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    valid_password = verify_password(
        user.password,
        existing_user["password"]
    )

    if not valid_password:

        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    token = create_access_token(
        {
            "email":
            existing_user["email"]
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }