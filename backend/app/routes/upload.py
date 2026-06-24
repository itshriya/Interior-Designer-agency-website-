from fastapi import APIRouter, UploadFile, File
from app.config.imagekitconfig import imagekit
import base64

router = APIRouter()

@router.post("/upload")
async def upload_image(
    file: UploadFile = File(...)
):

    file_content = await file.read()

    result = imagekit.upload_file(
        file=base64.b64encode(
            file_content
        ).decode(),
        file_name=file.filename
    )

    return {
        "image_url": result.url
    }