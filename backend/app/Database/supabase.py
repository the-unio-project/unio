from main import SB_URL, SB_KEY
from supabase import create_client, Client
from supabase.client import ClientOptions

if not SB_URL or not SB_KEY:
    raise Exception("Supabase Client unable to start as supabase_url and supabase_key are empty")

def get_supabase():
    supabase: Client = create_client(
            SB_URL,
            SB_KEY,
            options=ClientOptions(
                postgrest_client_timeout=10,
                storage_client_timeout=10,
                schema="public",
                )
            )

    yield supabase
