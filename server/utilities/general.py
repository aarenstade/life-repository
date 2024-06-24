import os
import uuid

from dbio.supabase import SupabaseDatabaseAdapter


def get_db():
    return SupabaseDatabaseAdapter(
        url=os.environ["SUPABASE_URL"], key=os.environ["SUPABASE_SECRET_KEY"]
    )


def generate_id():
    return str(uuid.uuid4())
