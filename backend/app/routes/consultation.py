from fastapi import APIRouter
from app.model.consultation import Consultation
from app.config.database import db
from datetime import datetime

router = APIRouter()

@router.post("/consultation")
async def create_consultation(data: Consultation):

    consultation = data.model_dump()
    consultation["created_at"] = datetime.utcnow()

    result = await db.consultations.insert_one(
        consultation
    )

    return {
        "message": "Consultation booked successfully",
        "id": str(result.inserted_id)
    }


@router.get("/consultations")
async def get_consultations():

    consultations = []

    async for consultation in db.consultations.find().sort("created_at", -1):

        consultation["_id"] = str(
            consultation["_id"]
        )

        consultations.append(
            consultation
        )

    return consultations