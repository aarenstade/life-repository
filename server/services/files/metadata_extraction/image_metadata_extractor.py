import os
from typing import Any, Dict, Tuple, Union

from PIL import Image
from models.file_metadata import ImageMetadata

from services.files.metadata_extraction.base import MetadataExtractor
from services.files.metadata_extraction.image_metadata_functions import (
    get_image_location,
    get_image_properties,
    get_image_xmp_metadata,
)


class ImageMetadataExtractor(MetadataExtractor):
    def extract_metadata(self, file_path: str) -> ImageMetadata:
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File not found: {file_path}")

        width = None
        height = None
        format = None
        color_mode = None

        try:
            image = Image.open(file_path)
            color_mode = image.mode
            image_size = image.size
            format = image.format
            width = image_size[0] if image_size else None
            height = image_size[1] if image_size else None
        except Exception as e:
            print(f"Error opening image file: {e}")

        return ImageMetadata(
            width=width or None,
            height=height or None,
            format=format or None,
            color_mode=color_mode or None,
            size=self._get_file_size(file_path),
            created_at=self._get_file_creation_time(file_path),
            modified_at=self._get_file_modification_time(file_path),
            properties=self.extract_base_properties(file_path),
            xmp_data=self.extract_xmp_properties(file_path),
            location=self.extract_image_location(file_path),
        )

    def _get_file_size(self, file_path: str) -> int:
        try:
            return os.path.getsize(file_path)
        except Exception as e:
            print(f"Error getting file size: {e}")
            return 0

    def _get_file_creation_time(self, file_path: str) -> float:
        try:
            return os.path.getctime(file_path)
        except Exception as e:
            print(f"Error getting file creation time: {e}")
            return 0.0

    def _get_file_modification_time(self, file_path: str) -> float:
        try:
            return os.path.getmtime(file_path)
        except Exception as e:
            print(f"Error getting file modification time: {e}")
            return 0.0

    def extract_base_properties(self, file_path: str) -> Dict[str, Any]:
        try:
            return get_image_properties(file_path)
        except Exception as e:
            print(f"Error extracting base properties: {e}")
            return {}

    def extract_xmp_properties(self, file_path: str) -> Dict[str, Any]:
        try:
            return get_image_xmp_metadata(file_path)
        except Exception as e:
            print(f"Error extracting XMP properties: {e}")
            return {}

    def extract_image_location(
        self, file_path: str
    ) -> Union[Tuple[float, float], None]:
        try:
            return get_image_location(file_path)
        except Exception as e:
            print(f"Error extracting image location: {e}")
            return None
