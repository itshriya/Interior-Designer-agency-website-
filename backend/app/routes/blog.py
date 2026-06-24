from fastapi import APIRouter, HTTPException
from bson import ObjectId

from app.config.database import db
from app.model.blog import Blog

router = APIRouter()


@router.post("/blog")
async def create_blog(blog: Blog):

    blog_data = blog.model_dump()

    result = await db.blogs.insert_one(
        blog_data
    )

    return {
        "message": "Blog created successfully",
        "id": str(result.inserted_id)
    }


@router.get("/blogs")
async def get_blogs():

    blogs = []

    async for blog in db.blogs.find():

        blog["_id"] = str(
            blog["_id"]
        )

        blogs.append(blog)

    return blogs


@router.get("/blog/{blog_id}")
async def get_blog(blog_id: str):

    blog = await db.blogs.find_one(
        {
            "_id": ObjectId(blog_id)
        }
    )

    if not blog:

        raise HTTPException(
            status_code=404,
            detail="Blog not found"
        )

    blog["_id"] = str(
        blog["_id"]
    )

    return blog


@router.put("/blog/{blog_id}")
async def update_blog(
    blog_id: str,
    blog: Blog
):

    result = await db.blogs.update_one(
        {
            "_id": ObjectId(blog_id)
        },
        {
            "$set": blog.model_dump()
        }
    )

    if result.matched_count == 0:

        raise HTTPException(
            status_code=404,
            detail="Blog not found"
        )

    return {
        "message": "Blog updated successfully"
    }


@router.delete("/blog/{blog_id}")
async def delete_blog(
    blog_id: str
):

    result = await db.blogs.delete_one(
        {
            "_id": ObjectId(blog_id)
        }
    )

    if result.deleted_count == 0:

        raise HTTPException(
            status_code=404,
            detail="Blog not found"
        )

    return {
        "message": "Blog deleted successfully"
    }