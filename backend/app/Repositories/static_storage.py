from fastapi import HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID

from Models.models import Book
from Schemas.schemas import CreateBookSchema, DeleteBookSchema, EditBookSchema

class BookRepository:
    def __init__(self, session: Session):
        self.session = session

    def create_book(self, book: CreateBookSchema):
        new_book = Book(**book.model_dump())
        self.session.add(new_book)
        self.session.commit()
        self.session.refresh(new_book)
        return new_book

    def get_by_id(self, book_id: UUID) -> Optional[Book]:
        return self.session.query(Book).filter(Book.id == book_id).first()

    def get_all(self) -> List[Book]:
        return self.session.query(Book).order_by(Book.created_at.asc()).all()

    def replace_book(self, new_book: CreateBookSchema, book_id: UUID):
        book = self.get_by_id(book_id)
        if book is None:
            return None
        book.name = new_book.name
        book.author = new_book.author
        book.launch_date = new_book.launch_date
        book.genre = new_book.genre
        self.session.commit()
        self.session.refresh(book)
        return book

    def edit_book(self, new_book: EditBookSchema, book_id: UUID):
        book = self.get_by_id(book_id)
        if book is None:
            return None
        update_data = new_book.model_dump(exclude_unset=True)
        if not update_data:
            raise HTTPException(status_code=404, detail="Nenhum dado válido encontrado")
        for field, value in update_data.items():
            setattr(book, field, value)
        self.session.commit()
        self.session.refresh(book)
        return book

    def delete_book(self, book_id: UUID):
        book = self.get_by_id(book_id)
        if book is None:
            return None
        self.session.delete(book)
        self.session.commit()
        return DeleteBookSchema(mensagem=f"Livro {book.name} deletado com sucesso!", uuid=book_id)
