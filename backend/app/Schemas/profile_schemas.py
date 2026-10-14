from pydantic import BaseModel

class SetProfileSchema(BaseModel):
    nickname:str
    bio:str
