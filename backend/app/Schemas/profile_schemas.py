from pydantic import BaseModel
from fastapi import UploadFile

class SetProfileSchema(BaseModel):
    nickname:str
    bio:str
