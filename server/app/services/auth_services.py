from bson import ObjectId

from app.schemas.auth_schema import (
    RegisterUser,
    LoginUser
)

from app.database.connection import db

from app.utils.hashing import (
    hash_password,
    verify_password
)

from app.utils.jwt import (
    create_access_token
)


users_collection = db["users"]


def register_user(
    user: RegisterUser
):

    existing_user = users_collection.find_one(
        {
            "email": user.email
        }
    )

    if existing_user:
        raise ValueError(
            "User already exists"
        )

    hashed_password = hash_password(
        user.password
    )

    new_user = {
        "name": user.name,
        "email": user.email,
        "password": hashed_password,
        "role": "user"
    }

    result = users_collection.insert_one(
        new_user
    )

    token = create_access_token(
        {
            "user_id": str(
                result.inserted_id
            ),
            "role": "user"
        }
    )

    return {
        "message": "User registered successfully",
        "access_token": token
    }


def login_user(
    user: LoginUser
):

    existing_user = users_collection.find_one(
        {
            "email": user.email
        }
    )

    if not existing_user:
        raise ValueError(
            "Invalid credentials"
        )

    if not verify_password(
        user.password,
        existing_user["password"]
    ):
        raise ValueError(
            "Invalid credentials"
        )

    token = create_access_token(
        {
            "user_id": str(
                existing_user["_id"]
            ),
            "role": existing_user["role"]
        }
    )

    return {
        "message": "Login successful",
        "access_token": token,
        "role": existing_user["role"]
    }