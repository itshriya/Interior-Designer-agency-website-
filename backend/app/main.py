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
from app.routes.settings import router as settings_router
from app.routes.users import router as users_router
from app.routes.profiles import router as profile_router
from app.routes.saved_design import router as saved_designs_router
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
app.include_router(
    settings_router,
    prefix="/settings",
    tags=["Settings"]
)
app.include_router(
    users_router,
    prefix="/users",
    tags=["Users"]
)
app.include_router(profile_router, tags=["Profile"])
app.include_router(saved_designs_router, tags=["Saved Designs"])
@app.get("/")
async def root():

    collections = await db.list_collection_names()

    return {
    "message": "MongoDB Connected",
    "collections": collections
}

