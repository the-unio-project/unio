from datetime import datetime
from typing import Annotated, List
from fastapi import Body, Depends, HTTPException, APIRouter
from uuid import UUID, uuid4
from sqlalchemy.orm import Session

from Schemas.book_schemas import BookResponseSchema, CreateBookSchema, DeleteBookSchema, EditBookSchema
from Database.database import get_session

from Repositories.static_storage import BookRepository

CRUD_ROUTER = APIRouter()
SessionDep = Annotated[Session, Depends(get_session)]

@CRUD_ROUTER.post("/", response_model=BookResponseSchema)
async def create_book(book: CreateBookSchema, session: SessionDep) -> BookResponseSchema:
    repo = BookRepository(session)
    try: # Validação do formato de dados pedido, causa um erro se errado
        _ = datetime.strptime(book.launch_date, "%Y-%m-%d")
    except:
        raise HTTPException(status_code=400, detail="Invalid date format")

    return repo.create_book(book)

@CRUD_ROUTER.get("/{book_id}", response_model=BookResponseSchema)
async def read_single_book(book_id: UUID, session: SessionDep) -> BookResponseSchema:
    repo = BookRepository(session)
    book = repo.get_by_id(book_id)
    if book is None:
        raise HTTPException(status_code=404, detail="no book found for id provided")
    return book

@CRUD_ROUTER.get("/", response_model=List[BookResponseSchema])
async def list_books(session: SessionDep) -> List[BookResponseSchema]:
    repo = BookRepository(session)
    return repo.get_all()

@CRUD_ROUTER.put("/{book_id}", response_model=BookResponseSchema)
async def replace_book(book: CreateBookSchema, book_id: UUID, session: SessionDep) -> BookResponseSchema:
    repo = BookRepository(session)
    return repo.replace_book(book, book_id)

@CRUD_ROUTER.patch("/{book_id}", response_model=BookResponseSchema)
async def edit_book(book: EditBookSchema, book_id: UUID, session: SessionDep) -> BookResponseSchema:
    repo = BookRepository(session)
    return repo.edit_book(book, book_id)

# TODO: integrar com base de dados
@CRUD_ROUTER.delete("/{book_id}", response_model=DeleteBookSchema)
async def delete_book(book_id: UUID, session: SessionDep):
    repo = BookRepository(session)
    return repo.delete_book(book_id)
