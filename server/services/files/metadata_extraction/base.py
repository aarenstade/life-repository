from abc import ABC, abstractmethod

from models.file_metadata import FileMetadata


class MetadataExtractor(ABC):
    @abstractmethod
    def extract_metadata(self, file_path: str) -> FileMetadata:
        pass
