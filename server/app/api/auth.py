from fastapi import APIRouter, HTTPException

from app.schemas.auth_schema import (
    RegisterUser,
    LoginUser
)

from app.services.auth_services import (
    register_user,
    login_user
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/register")
def register(
    user: RegisterUser
):
    try:
        return register_user(user)

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


@router.post("/login")
def login(
    user: LoginUser
):
    try:
        return login_user(user)

    except ValueError as e:
        raise HTTPException(
            status_code=401,
            detail=str(e)
        )