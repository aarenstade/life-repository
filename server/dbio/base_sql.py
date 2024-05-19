from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional


class BaseSQLDatabaseAdapter(ABC):
    @abstractmethod
    def insert(self, table: str, data: Dict[str, Any]) -> Dict[str, Any]:
        pass

    @abstractmethod
    def select(
        self, table: str, columns: str = "*", filters: Optional[Dict[str, Any]] = None
    ) -> List[Dict[str, Any]]:
        pass

    @abstractmethod
    def update(
        self, table: str, data: Dict[str, Any], filters: Dict[str, Any]
    ) -> Dict[str, Any]:
        pass

    @abstractmethod
    def delete(self, table: str, filters: Dict[str, Any]) -> bool:
        pass
