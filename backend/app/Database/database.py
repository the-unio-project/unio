import os

from sqlalchemy import URL, create_engine, event
from sqlalchemy.orm import sessionmaker, DeclarativeBase

DB_USER = os.getenv("db_user")
DB_PASSWORD = os.getenv("db_password")
DB_HOST = os.getenv("db_host")
DB_NAME = os.getenv("db_name")
DB_SCHEMA = os.getenv("db_schema")

_DB_PORT = os.getenv("db_port")
if not _DB_PORT:
    raise RuntimeError("DB_PORT env value empty")
if not _DB_PORT.isnumeric():
    raise RuntimeError("DB_PORT env value invalid")
DB_PORT = int(_DB_PORT)

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

@event.listens_for(engine, "connect", insert=True)
def set_current_schema(dbapi_connection, connection_record):
    cursor_obj = dbapi_connection.cursor()
    cursor_obj.execute('SET search_path TO "%s"' % DB_SCHEMA)
    cursor_obj.close()

def get_session():
    try:
        with SessionLocal() as session:
            yield session
    finally:
        session.close()

class Base(DeclarativeBase):
    pass
