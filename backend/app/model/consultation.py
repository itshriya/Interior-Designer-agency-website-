from pydantic import BaseModel, EmailStr

class Consultation(BaseModel):

    name: str
    email: EmailStr
    phone: str
    project_type: str
    budget: str
    preferred_date: str
    message: str