from fastapi import APIRouter
from app.model.project import Project
from app.config.database import db
from datetime import datetime
from fastapi import HTTPException
from bson import ObjectId

router = APIRouter()

@router.post("/project")
async def create_project(project: Project):

    project_data = project.model_dump()

    project_data["created_at"] = datetime.utcnow()

    result = await db.projects.insert_one(
        project_data
    )

    return {
        "message":"Project created",
        "id": str(result.inserted_id)
    }


@router.get("/projects")
async def get_projects():

    projects = []

    async for project in db.projects.find():

        project["_id"] = str(
            project["_id"]
        )

        projects.append(project)

    return projects

#When someone clicks:/project/6858ab...they see the full project details page.
@router.get("/project/{project_id}")
async def get_project(project_id: str):

    project = await db.projects.find_one(
        {
            "_id": ObjectId(project_id)
        }
    )

    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )

    project["_id"] = str(project["_id"])

    return project


@router.delete("/project/{project_id}")
async def delete_project(project_id: str):

    await db.projects.delete_one(
        {
            "_id": ObjectId(project_id)
        }
    )

    return {
        "message":"Project deleted"
    }

@router.put("/project/{project_id}")
async def update_project(
    project_id: str,
    project: Project
):

    await db.projects.update_one(
        {
            "_id": ObjectId(project_id)
        },
        {
            "$set": project.model_dump()
        }
    )

    return {
        "message":"Project updated"
    }