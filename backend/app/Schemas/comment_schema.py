from pydantic import BaseModel

class CreateCommentSchema(BaseModel):
    comment:str
