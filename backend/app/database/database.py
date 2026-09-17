from sqlalchemy import URL, create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

# vou colocar no ambiente virtual ainda
URL_DB = URL.create(
    drivername="postgresql+psycopg2",
    username="postgres",
    password="montreal@1930#",
    host="localhost",
    port=5432,
    database="book_database",
)

engine = create_engine(URL_DB)
SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False
)   

def get_session():
    try:
        with SessionLocal() as session:
            yield session
    finally:
        session.close()

class Base(DeclarativeBase):
    pass
