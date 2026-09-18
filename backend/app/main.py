from fastapi import FastAPI

from Routes import CRUD
from database.database import Base, engine

app = FastAPI()

@app.get("/")
async def root():
    return{"message": "Default Path"}
