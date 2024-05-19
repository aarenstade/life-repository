from typing import Any, Dict, List, Optional
from supabase import create_client, Client

from dbio.base_sql import BaseSQLDatabaseAdapter


class SupabaseDatabaseAdapter(BaseSQLDatabaseAdapter):
    def __init__(self, url: str, key: str):
        self.client: Client = create_client(url, key)

    def insert(self, table: str, data: Dict[str, Any]) -> Dict[str, Any]:
        try:
            response = self.client.table(table).insert(data).execute()
            return response.data if response.data else []
        except Exception as e:
            print(f"Error inserting data into {table}: {e}")
            return []

    def select(
        self, table: str, columns: str = "*", filters: Optional[Dict[str, Any]] = None
    ) -> List[Dict[str, Any]]:
        try:
            query = self.client.table(table).select(columns)
            if filters:
                for key, value in filters.items():
                    query = query.eq(key, value)
            response = query.execute()
            if response.data:
                return response.data
        except Exception as e:
            print(f"Error executing select query: {e}")
        return []

    def update(
        self, table: str, data: Dict[str, Any], filters: Dict[str, Any]
    ) -> Dict[str, Any]:
        try:
            query = self.client.table(table).update(data)
            if filters:
                for key, value in filters.items():
                    query = query.eq(key, value)
            response = query.execute()
            if response.data:
                return response.data
        except Exception as e:
            print(f"Error executing update query: {e}")
        return []

    def delete(self, table: str, filters: Dict[str, Any]) -> bool:
        try:
            response = self.client.table(table).delete()
            for key, value in filters.items():
                response = response.eq(key, value)
            response = response.execute()
            if response.data:
                return response.data
        except Exception as e:
            print(f"Error executing delete query: {e}")
        return []
