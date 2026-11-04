from uuid import UUID

from fastapi import HTTPException, UploadFile
from sqlalchemy.orm import Session
from supabase import Client

from Models.models import User
from Schemas.profile_schemas import SetProfileSchema

from config import SB_URL

def validate_image_upload(file: UploadFile) -> str:
    if not file.filename:
        raise HTTPException(status_code=400, detail="Profile picture file has no filename")
    if not file.size:
        raise HTTPException(status_code=400, detail="Profile picture file has no size")
    if file.size > 102400:
        raise HTTPException(status_code=400, detail="File size too large, limit = 100KB")

    _, separator, suffix = file.filename.rpartition(".")
    extension = suffix.lower() if separator else ""
    if extension not in {"jpg", "jpeg", "png"}:
        raise HTTPException(status_code=400, detail="File extension not allowed, try (.jpg, .jpeg, .png)")

    return extension

def update_profile(user_id:UUID, profile_schema:SetProfileSchema, profile_picture:UploadFile, session:Session, supabase_client:Client):
    user = session.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="No user found")
    extension = validate_image_upload(profile_picture)

    pfp_bytes = profile_picture.file.read()

    upload_resposta = supabase_client.storage.from_("profilepictures").upload(
                file=pfp_bytes,
                path=f"{user_id}.{extension}",
                file_options={"cache-control": "3600", "upsert": "true"}
                )

    url_resposta = f"{SB_URL}/storage/v1/object/public/profilepictures/{upload_resposta.path}"

    user.nickname = profile_schema.nickname
    user.bio = profile_schema.bio
    user.profile_picture = url_resposta

    session.commit()

    return {"message": "no error test"}
