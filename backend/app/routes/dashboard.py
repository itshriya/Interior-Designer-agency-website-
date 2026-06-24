from fastapi import APIRouter
from app.config.database import db

router = APIRouter()

@router.get("/dashboard/stats")
async def dashboard_stats():

    users_count = await db.users.count_documents({})

    designs_count = await db.projects.count_documents({})

    consultations_count = await db.consultations.count_documents({})

    return {
        "users": users_count,
        "designs": designs_count,
        "consultations": consultations_count
    }