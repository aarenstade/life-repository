from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional, TypeVar, Generic

T = TypeVar("T")


class SQLDatabaseAdapter(ABC, Generic[T]):
    @abstractmethod
    def connect(self, connection_string: str = None) -> None:
        """
        Establish a connection to the database.

        :param connection_string: The connection string to the database.
        """
        pass

    @abstractmethod
    def disconnect(self) -> None:
        """
        Close the connection to the database.
        """
        pass

    @abstractmethod
    def execute_query(
        self, query: str, parameters: Optional[Dict[str, Any]] = None
    ) -> None:
        """
        Execute a SQL query that does not return rows.

        :param query: The SQL query to execute.
        :param parameters: Optional dictionary of parameters to bind to the query.
        """
        pass

    @abstractmethod
    def fetch_one(
        self, query: str, parameters: Optional[Dict[str, Any]] = None
    ) -> Optional[T]:
        """
        Execute a SQL query and return a single row.

        :param query: The SQL query to execute.
        :param parameters: Optional dictionary of parameters to bind to the query.
        :return: A single row or None if no row is found.
        """
        pass

    @abstractmethod
    def fetch_all(
        self, query: str, parameters: Optional[Dict[str, Any]] = None
    ) -> List[T]:
        """
        Execute a SQL query and return all rows.

        :param query: The SQL query to execute.
        :param parameters: Optional dictionary of parameters to bind to the query.
        :return: A list of rows.
        """
        pass

    @abstractmethod
    def insert(self, table: str, data: Dict[str, Any]) -> None:
        """
        Insert a record into a table.

        :param table: The name of the table to insert into.
        :param data: A dictionary representing the data to insert.
        """
        pass

    @abstractmethod
    def update(
        self, table: str, data: Dict[str, Any], conditions: Dict[str, Any]
    ) -> None:
        """
        Update records in a table.

        :param table: The name of the table to update.
        :param data: A dictionary representing the data to update.
        :param conditions: A dictionary representing the conditions to match for the update.
        """
        pass

    @abstractmethod
    def delete(self, table: str, conditions: Dict[str, Any]) -> None:
        """
        Delete records from a table.

        :param table: The name of the table to delete from.
        :param conditions: A dictionary representing the conditions to match for the delete.
        """
        pass
