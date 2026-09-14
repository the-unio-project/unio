from fastapi import FastAPI

from Routes import CRUD
from database.database import Base, engine

app = FastAPI()

app.include_router(
        router=CRUD.CRUD_ROUTER,
        prefix="/books",
        tags=["books"]
        )

@app.get("/")
async def root():
    return{"message": "Default Path"}
