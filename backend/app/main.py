from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config.database import db

from app.routes.contact import router as contact_router
from app.routes.consultation import router as consultation_router
from app.routes.project import router as project_router
from app.routes.upload import router as upload_router
from app.routes.auth import router as auth_router
from app.routes.dashboard import router as dashboard_router
from app.routes.blog import router as blog_router

app = FastAPI()

app.add_middleware(
CORSMiddleware,
allow_origins=["*"],
allow_credentials=True,
allow_methods=["*"],
allow_headers=["*"]
)

app.include_router(contact_router)
app.include_router(consultation_router)
app.include_router(project_router)
app.include_router(upload_router)
app.include_router(auth_router)
app.include_router(dashboard_router)
app.include_router(blog_router)

@app.get("/")
async def root():

    collections = await db.list_collection_names()

    return {
    "message": "MongoDB Connected",
    "collections": collections
}

