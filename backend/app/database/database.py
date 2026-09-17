from sqlalchemy import URL, create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

from main import DB_USER, DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT

# vou colocar no ambiente virtual ainda
URL_DB = URL.create(
    drivername="postgresql+psycopg2",
    username=DB_USER,
    password=DB_PASSWORD,
    host=DB_HOST,
    port=DB_PORT,
    database=DB_NAME,
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
