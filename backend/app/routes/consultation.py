from fastapi import APIRouter, HTTPException
from bson import ObjectId
from datetime import datetime

from app.model.consultation import Consultation
from app.config.database import db

router = APIRouter()

@router.post("/consultation")
async def create_consultation(
data: Consultation
):


    consultation = data.model_dump()

    consultation["status"] = "pending"

    consultation["created_at"] = (
        datetime.utcnow()
)

    result = await db.consultations.insert_one(
    consultation
)

    return {
    "message":
    "Consultation booked successfully",

    "id":
    str(
        result.inserted_id
    )
}


@router.get("/consultations")
async def get_consultations():


    consultations = []

    async for consultation in (
    db.consultations.find()
    .sort(
        "created_at",
        -1
    )
):

        consultation["_id"] = str(
        consultation["_id"]
    )

        consultations.append(
        consultation
    )

    return consultations


@router.put(
"/consultation/{consultation_id}/status"
)
async def update_consultation_status(
consultation_id: str,
status: str
):

    result = await db.consultations.update_one(
    {
        "_id":
        ObjectId(
            consultation_id
        )
    },
    {
        "$set": {
            "status": status
        }
    }
)

    if result.matched_count == 0:

        raise HTTPException(
        status_code=404,
        detail=
        "Consultation not found"
    )

    return {
    "message":
    "Status updated successfully"
}
@router.delete(
"/consultation/{consultation_id}"
)
async def delete_consultation(
consultation_id: str
):


    result = await db.consultations.delete_one(
    {
        "_id":
        ObjectId(
            consultation_id
        )
    }
)

    if result.deleted_count == 0:

        raise HTTPException(
        status_code=404,
        detail=
        "Consultation not found"
    )

        return {
    "message":
    "Consultation deleted successfully"
}
