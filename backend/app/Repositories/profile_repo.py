from uuid import UUID

from fastapi import HTTPException, UploadFile, Depends
from sqlalchemy.orm import Session
from supabase import Client

from Models.models import User
from Schemas.profile_schemas import SetProfileSchema

from main import SB_URL

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

def allowed_extensions(filename:str) -> str | None: # taken from https://light-tree.tistory.com/286
    if '.' not in filename:
        return None

    extension=filename.rsplit('.', 1)[1].lower()
    if extension in ALLOWED_EXTENSIONS:
        return extension

def update_profile(user_id:UUID, profile_schema:SetProfileSchema, profile_picture:UploadFile, session:Session, supabase_client:Client):
    user = session.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=400, detail="No user found")
    if not profile_picture.filename:
        raise HTTPException(status_code=400, detail="Profile picture file has no filename")

    extension=allowed_extensions(profile_picture.filename)
    if not extension:
        raise HTTPException(status_code=400, detail="File extension not allowed, try (.jpg, .jpeg, .png)")

    pfp_bytes = profile_picture.file.read()

    upload_resposta = supabase_client.storage.from_("profilepictures").upload(
                file=pfp_bytes,
                path=f"{user_id}.{extension}",
                file_options={"cache-control": "3600", "upsert": "false"}
                )

    url_resposta = f"{SB_URL}/storage/v1/object/public/profilepictures/{upload_resposta.path}"

    user.nickname = profile_schema.nickname
    user.bio = profile_schema.bio
    user.profile_picture = url_resposta

    session.commit()

    return {"message": "no error test"}
