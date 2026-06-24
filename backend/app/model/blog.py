from pydantic import BaseModel


class Blog(BaseModel):
    title: str
    category: str
    content: str
    image_url: str
    author: str
    status: str