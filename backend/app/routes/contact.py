from fastapi import APIRouter
from app.model.contact import Contact
from app.config.database import db
from datetime import datetime
router = APIRouter()

@router.post("/contact")
async def create_contact(contact: Contact):

    contact_data = contact.model_dump()
    contact_data["created_at"] = datetime.utcnow()

    await db.contacts.insert_one(contact_data)

    return {
        "message": "Contact form submitted successfully"
    }

@router.get("/contacts")
async def get_contacts():

    contacts = []

    async for contact in db.contacts.find().sort("created_at", -1):

        contact["_id"] = str(
            contact["_id"]
        )

        contacts.append(contact)

    return contacts