from sqlalchemy import URL, create_engine, event
from sqlalchemy.orm import sessionmaker

from config import DB_USER, DB_PASSWORD, DB_HOST, DB_NAME, DB_SCHEMA, DB_PORT

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
