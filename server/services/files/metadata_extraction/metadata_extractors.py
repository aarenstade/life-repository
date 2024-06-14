import os
from typing import Dict, List
from concurrent.futures import ThreadPoolExecutor, as_completed

from models.files import File, FileType
from models.file_metadata import FileMetadata

from services.files.metadata_extraction.archive_metadata_extractor import (
    ArchiveMetadataExtractor,
)
from services.files.metadata_extraction.audio_metadata_extractor import (
    AudioMetadataExtractor,
)
from services.files.metadata_extraction.image_metadata_extractor import (
    ImageMetadataExtractor,
)
from services.files.metadata_extraction.text_metadata_extractor import (
    TextMetadataExtractor,
)
from services.files.metadata_extraction.video_metadata_extractor import (
    VideoMetadataExtractor,
)

from services.files.metadata_extraction.base import MetadataExtractor
from services.files.directory_file_organizer import DirectoryFileOrganizer

from utilities.general import generate_id


class FileMetadataExtractor:
    """
    FileMetadataExtractor is responsible for extracting metadata from various file types.

    It uses specific extractors for different file types such as images, videos, texts, audios, and archives.
    If no specific extractor is found for a file type, it extracts basic file system metadata.

    Attributes:
        extractors (Dict[FileType, MetadataExtractor]): A dictionary mapping file types to their respective metadata extractors.
    """

    def __init__(self):
        self.extractors: Dict[FileType, MetadataExtractor] = {
            FileType.IMAGE: ImageMetadataExtractor(),
            FileType.VIDEO: VideoMetadataExtractor(),
            FileType.TEXT: TextMetadataExtractor(),
            FileType.AUDIO: AudioMetadataExtractor(),
            FileType.ARCHIVE: ArchiveMetadataExtractor(),
            FileType.DOCUMENT: None,  # TODO: Add document metadata extractor
        }

    def _get_file_type(self, file_path: str) -> FileType:
        file_extension = file_path.split(".")[-1].lower()
        return DirectoryFileOrganizer.get_file_type(file_extension)

    def extract_file_metadata(self, file_path: str) -> FileMetadata:
        file_extension = file_path.split(".")[-1].lower()
        file_type = DirectoryFileOrganizer.get_file_type(file_extension)
        extractor = self.extractors.get(file_type, None)
        if extractor:
            return extractor.extract_metadata(file_path)
        else:
            size = os.path.getsize(file_path)
            created_at = os.path.getctime(file_path)
            modified_at = os.path.getmtime(file_path)
            return FileMetadata(
                size=size, created_at=created_at, modified_at=modified_at
            )

    def extract_files_metadata_concurrent(
        self,
        file_paths: List[str],
        max_workers: int = 5,
        return_raw_metadata: bool = False,
    ) -> List[FileMetadata]:
        def extract(file_path: str) -> FileMetadata:
            file_type = self._get_file_type(file_path)
            metadata = self.extract_file_metadata(file_path)
            return (
                metadata
                if return_raw_metadata
                else File(
                    id=generate_id(),
                    name=os.path.basename(file_path),
                    type=file_type,
                    path=file_path,
                    metadata=metadata,
                )
            )

        with ThreadPoolExecutor(max_workers=max_workers) as executor:
            future_to_file = {
                executor.submit(extract, file_path): file_path
                for file_path in file_paths
            }
            results = []
            for future in as_completed(future_to_file):
                file_path = future_to_file[future]
                try:
                    metadata = future.result()
                    results.append(metadata)
                except Exception as e:
                    print(f"Error extracting metadata for {file_path}: {e}")
        return results
