
import os

# Environment Values

SECRET_KEY=os.getenv("SECRET_KEY")
ALGORITHM=os.getenv("ALGORITHM")
AT_TIMEOUT=os.getenv("AT_TIMEOUT")

DB_USER = os.getenv("db_user")
DB_PASSWORD = os.getenv("db_password")
DB_HOST = os.getenv("db_host")
DB_NAME = os.getenv("db_name")
DB_SCHEMA = os.getenv("db_schema")

SB_URL=os.getenv("supabase_url")
SB_KEY=os.getenv("supabase_key")

_DB_PORT_ = os.getenv("db_port")
if not _DB_PORT_:
    raise Exception("DB_PORT env value empty")
elif not _DB_PORT_.isnumeric():
    raise Exception("DB_PORT env value invalid")
DB_PORT = int(_DB_PORT_)

S3_URL = os.getenv("s3_endpoint_url")
S3_ACCESS_KEY = os.getenv("s3_access_key")
S3_SECRET_KEY = os.getenv("s3_secret_access_key")
S3_REGION = os.getenv("s3_region_name")
