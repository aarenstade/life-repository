import sqlite3
from typing import Any, Dict, List, Optional, TypeVar, Generic

from config import load_config
from .base import SQLDatabaseAdapter
from workspace.singleton import Singleton

T = TypeVar("T")

config = load_config()


class SQLite3Adapter(SQLDatabaseAdapter[T], metaclass=Singleton):
    def __init__(self, connection_string: str = config.get("sqlite_database_path")):
        self.connection = None
        self.connection_string = connection_string
        self.initialized = True

    def initialize_schema(self, schema_path: str) -> None:
        with open(schema_path, "r") as f:
            schema = f.read()
            self.execute_query(schema)

    def connect(self) -> None:
        print(f"Connecting to {self.connection_string}")
        self.connection = sqlite3.connect(self.connection_string)
        self.connection.row_factory = sqlite3.Row

    def disconnect(self) -> None:
        if self.connection:
            self.connection.close()
            self.connection = None

    def _ensure_connection(self):
        if not self.connection:
            try:
                self.connect()
            except Exception as e:
                raise Exception("Failed to re-establish database connection.") from e

    def execute_query(
        self, query: str, parameters: Optional[Dict[str, Any]] = None
    ) -> None:
        self._ensure_connection()
        cursor = self.connection.cursor()
        if parameters:
            cursor.execute(query, parameters)
        else:
            cursor.execute(query)
        self.connection.commit()

    def fetch_one(
        self, query: str, parameters: Optional[Dict[str, Any]] = None
    ) -> Optional[T]:
        self._ensure_connection()
        cursor = self.connection.cursor()
        if parameters:
            cursor.execute(query, parameters)
        else:
            cursor.execute(query)
        row = cursor.fetchone()
        return dict(row) if row else None

    def fetch_all(
        self, query: str, parameters: Optional[Dict[str, Any]] = None
    ) -> List[T]:
        self._ensure_connection()
        cursor = self.connection.cursor()
        if parameters:
            cursor.execute(query, parameters)
        else:
            cursor.execute(query)
        rows = cursor.fetchall()
        return [dict(row) for row in rows]

    def insert(self, table: str, data: Dict[str, Any]) -> None:
        self._ensure_connection()
        keys = ", ".join(data.keys())
        placeholders = ", ".join(["?" for _ in data])
        query = f"INSERT INTO {table} ({keys}) VALUES ({placeholders})"
        self.execute_query(query, tuple(data.values()))

    def update(
        self, table: str, data: Dict[str, Any], conditions: Dict[str, Any]
    ) -> None:
        self._ensure_connection()
        set_clause = ", ".join([f"{key} = ?" for key in data.keys()])
        condition_clause = " AND ".join([f"{key} = ?" for key in conditions.keys()])
        query = f"UPDATE {table} SET {set_clause} WHERE {condition_clause}"
        self.execute_query(query, tuple(data.values()) + tuple(conditions.values()))

    def delete(self, table: str, conditions: Dict[str, Any]) -> None:
        self._ensure_connection()
        condition_clause = " AND ".join([f"{key} = ?" for key in conditions.keys()])
        query = f"DELETE FROM {table} WHERE {condition_clause}"
        self.execute_query(query, tuple(conditions.values()))
