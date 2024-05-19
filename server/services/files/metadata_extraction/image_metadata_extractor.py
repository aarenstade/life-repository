import os
from typing import Any, Dict

from PIL import Image

from PIL import Image
import exifread
import pyheif
import pyexiv2


from models.file_metadata import ImageMetadata
from services.files.metadata_extraction.base import MetadataExtractor


class ImageMetadataExtractor(MetadataExtractor):
    def extract_metadata(self, file_path: str) -> ImageMetadata:
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File not found: {file_path}")

        try:
            image = Image.open(file_path)
            resolution = image.size
            color_mode = image.mode
            format = image.format
        except Exception as e:
            raise ValueError(f"Error opening image file: {e}")

        try:
            size = os.path.getsize(file_path)
        except OSError as e:
            raise ValueError(f"Error getting file size: {e}")

        try:
            created_at = os.path.getctime(file_path)
        except OSError as e:
            raise ValueError(f"Error getting file creation time: {e}")

        try:
            modified_at = os.path.getmtime(file_path)
        except OSError as e:
            raise ValueError(f"Error getting file modification time: {e}")

        exif_data = self.extract_exif_data(file_path)
        heif_data = self.extract_heif_data(file_path)
        xmp_data = self.extract_xmp_data(file_path)

        return ImageMetadata(
            size=size,
            created_at=created_at,
            modified_at=modified_at,
            resolution=resolution,
            color_mode=color_mode,
            format=format,
            exif_data=exif_data,
            heif_data=heif_data,
            xmp_data=xmp_data,
        )

    def extract_exif_data(self, file_path: str) -> Dict[str, Any]:
        try:
            with open(file_path, "rb") as f:
                tags = exifread.process_file(f)
            return {tag: str(value) for tag, value in tags.items()}
        except Exception as e:
            raise ValueError(f"Error extracting EXIF data: {e}")

    def extract_heif_data(self, file_path: str) -> Dict[str, Any]:
        if not file_path.lower().endswith(".heic"):
            return {}
        try:
            heif_file = pyheif.read(file_path)
            metadata = heif_file.metadata or []
            return {meta["type"]: meta["data"] for meta in metadata}
        except Exception as e:
            raise ValueError(f"Error extracting HEIF data: {e}")

    def extract_xmp_data(self, file_path: str) -> Dict[str, Any]:
        try:
            with pyexiv2.Image(file_path) as img:
                xmp_data = img.read_xmp()
            return xmp_data
        except Exception as e:
            raise ValueError(f"Error extracting XMP data: {e}")
