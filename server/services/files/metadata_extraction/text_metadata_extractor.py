import os

import chardet
from langdetect import detect

from models.file_metadata import TextMetadata
from services.files.metadata_extraction.base import MetadataExtractor
from services.files.directory_file_organizer import DirectoryFileOrganizer


class TextMetadataExtractor(MetadataExtractor):
    def extract_metadata(self, file_path: str) -> TextMetadata:
        size = os.path.getsize(file_path)
        created_at = os.path.getctime(file_path)
        modified_at = os.path.getmtime(file_path)

        with open(file_path, "rb") as file:
            raw_data = file.read()
            encoding_info = chardet.detect(raw_data)
            encoding = encoding_info["encoding"]
            text = raw_data.decode(encoding)

        num_words = len(text.split())
        language = self.detect_language(text)

        return TextMetadata(
            size=size,
            created_at=created_at,
            modified_at=modified_at,
            num_words=num_words,
            language=language,
            encoding=encoding,
        )

    def detect_language(self, text: str) -> str:
        try:
            language = detect(text)
        except Exception as e:
            raise RuntimeError(f"Failed to detect language: {str(e)}")
        return language
