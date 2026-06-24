from pydantic import BaseModel

class Project(BaseModel):

    title: str
    category: str
    description: str
    location: str
    images: list[str]