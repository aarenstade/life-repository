import os
from typing import Dict, List, Tuple, Union

from models.files import FileType
from models.file_metadata import (
    FileMetadata,
    ImageMetadata,
    VideoMetadata,
    TextMetadata,
    AudioMetadata,
    ArchiveMetadata,
    DocumentMetadata,
)


class DirectoryFileOrganizer:
    IMAGE_EXTENSIONS = {"png", "jpg", "jpeg", "bmp", "gif", "heic"}
    VIDEO_EXTENSIONS = {"mp4", "avi", "mov", "mkv"}
    TEXT_EXTENSIONS = {"txt", "md", "doc", "docx", "pdf"}
    AUDIO_EXTENSIONS = {"mp3", "wav", "aac", "flac"}
    ARCHIVE_EXTENSIONS = {"zip", "rar", "tar", "gz"}
    DOCUMENT_EXTENSIONS = {"pdf", "doc", "docx", "ppt", "pptx"}

    @staticmethod
    def get_file_type(file_extension: str) -> FileType:
        file_extension = file_extension.lower().replace(".", "")
        if file_extension in DirectoryFileOrganizer.IMAGE_EXTENSIONS:
            return FileType.IMAGE
        elif file_extension in DirectoryFileOrganizer.VIDEO_EXTENSIONS:
            return FileType.VIDEO
        elif file_extension in DirectoryFileOrganizer.TEXT_EXTENSIONS:
            return FileType.TEXT
        elif file_extension in DirectoryFileOrganizer.AUDIO_EXTENSIONS:
            return FileType.AUDIO
        elif file_extension in DirectoryFileOrganizer.ARCHIVE_EXTENSIONS:
            return FileType.ARCHIVE
        elif file_extension in DirectoryFileOrganizer.DOCUMENT_EXTENSIONS:
            return FileType.DOCUMENT
        else:
            return FileType.OTHER

    @staticmethod
    def list_files_recursive(directory_path: str) -> List[str]:
        file_paths = []
        for root, _, files in os.walk(directory_path):
            for file in files:
                file_path = os.path.join(root, file)
                file_paths.append(file_path)
        return file_paths

    @staticmethod
    def group_files_by_type(
        files: Union[
            List[
                Tuple[
                    str,
                    Union[
                        FileMetadata,
                        ImageMetadata,
                        VideoMetadata,
                        TextMetadata,
                        AudioMetadata,
                        ArchiveMetadata,
                        DocumentMetadata,
                    ],
                ]
            ],
            List[str],
        ]
    ) -> Union[
        Dict[
            FileType,
            List[
                Tuple[
                    str,
                    Union[
                        FileMetadata,
                        ImageMetadata,
                        VideoMetadata,
                        TextMetadata,
                        AudioMetadata,
                        ArchiveMetadata,
                        DocumentMetadata,
                    ],
                ]
            ],
        ],
        Dict[FileType, List[str]],
    ]:
        grouped_files = {
            FileType.IMAGE: [],
            FileType.VIDEO: [],
            FileType.TEXT: [],
            FileType.AUDIO: [],
            FileType.ARCHIVE: [],
            FileType.DOCUMENT: [],
            FileType.OTHER: [],
        }

        if all(isinstance(file, str) for file in files):
            for file_path in files:
                file_type = DirectoryFileOrganizer.get_file_type(
                    file_path.split(".")[-1].lower()
                )
                grouped_files[file_type].append(file_path)
        else:
            for file_path, file_metadata in files:
                file_type = DirectoryFileOrganizer.get_file_type(
                    file_path.split(".")[-1].lower()
                )
                grouped_files[file_type].append((file_path, file_metadata))

        return grouped_files
