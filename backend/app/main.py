from fastapi import FastAPI
from dotenv import load_dotenv

from Routes import CRUD

# Environment Values

# Routing & App

app = FastAPI()

app.include_router(
        router=CRUD.CRUD_ROUTER,
        prefix="/books",
        tags=["books"]
        )

@app.get("/")
async def root():
    return{"message": "Default Path"}
