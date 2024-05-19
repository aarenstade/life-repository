import os
import zipfile
import tarfile

from models.file_metadata import ArchiveMetadata
from services.files.metadata_extraction.base import MetadataExtractor


class ArchiveMetadataExtractor(MetadataExtractor):
    def extract_metadata(self, file_path: str) -> ArchiveMetadata:
        try:
            size = os.path.getsize(file_path)
            created_at = os.path.getctime(file_path)
            modified_at = os.path.getmtime(file_path)
        except (OSError, ValueError) as e:
            raise RuntimeError(f"Failed to retrieve file system metadata: {str(e)}")

        if zipfile.is_zipfile(file_path):
            try:
                with zipfile.ZipFile(file_path, "r") as archive:
                    num_files = len(archive.namelist())
                    compression_type = "zip"
                    encrypted = any(info.flag_bits & 0x1 for info in archive.infolist())
            except (zipfile.BadZipFile, RuntimeError) as e:
                raise RuntimeError(f"Failed to extract ZIP archive metadata: {str(e)}")
        elif tarfile.is_tarfile(file_path):
            try:
                with tarfile.open(file_path, "r") as archive:
                    num_files = len(archive.getnames())
                    compression_type = "tar"
                    encrypted = False  # tar files do not support encryption by default
            except (tarfile.TarError, RuntimeError) as e:
                raise RuntimeError(f"Failed to extract TAR archive metadata: {str(e)}")
        else:
            raise ValueError("Unsupported archive format")

        return ArchiveMetadata(
            size=size,
            created_at=created_at,
            modified_at=modified_at,
            num_files=num_files,
            compression_type=compression_type,
            encrypted=encrypted,
        )
