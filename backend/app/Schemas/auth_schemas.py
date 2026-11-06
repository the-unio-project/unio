from pydantic import BaseModel

class RegisterSchema(BaseModel):
    name: str
    email: str
    password: str

    class Config:
        from_attribute = True

class LoginSchema(BaseModel):
    email: str
    password: str

    class Config:
        from_attribute = True
