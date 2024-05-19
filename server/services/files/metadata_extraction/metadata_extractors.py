import os
from typing import Dict

from PIL import Image

import ffmpeg
import chardet
import zipfile
import tarfile
from langdetect import detect

from models.files import FileType
from models.file_metadata import (
    ArchiveMetadata,
    AudioMetadata,
    FileMetadata,
    ImageMetadata,
    TextMetadata,
    VideoMetadata,
)

from services.files.metadata_extraction.base import MetadataExtractor
from services.files.directory_file_organizer import DirectoryFileOrganizer


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

        return ImageMetadata(
            size=size,
            created_at=created_at,
            modified_at=modified_at,
            resolution=resolution,
            color_mode=color_mode,
            format=format,
        )


class VideoMetadataExtractor(MetadataExtractor):
    def extract_metadata(self, file_path: str) -> VideoMetadata:
        try:
            if not os.path.exists(file_path):
                raise FileNotFoundError(f"File not found: {file_path}")

            size = os.path.getsize(file_path)
            created_at = os.path.getctime(file_path)
            modified_at = os.path.getmtime(file_path)

            try:
                probe = ffmpeg.probe(file_path)
            except ffmpeg.Error as e:
                raise ValueError(f"Error probing video file: {e.stderr.decode()}")

            video_stream = next(
                (
                    stream
                    for stream in probe["streams"]
                    if stream["codec_type"] == "video"
                ),
                None,
            )

            if video_stream is None:
                raise ValueError("No video stream found in file")

            try:
                duration = float(probe["format"]["duration"])
            except (KeyError, ValueError, TypeError):
                duration = None

            try:
                resolution = (int(video_stream["width"]), int(video_stream["height"]))
            except (KeyError, ValueError, TypeError):
                resolution = (None, None)

            try:
                framerate = eval(video_stream["r_frame_rate"])
            except (KeyError, ValueError, TypeError, SyntaxError):
                framerate = None

            try:
                codec = video_stream["codec_name"]
            except KeyError:
                codec = None

            try:
                bitrate = int(probe["format"]["bit_rate"])
            except (KeyError, ValueError, TypeError):
                bitrate = None

            return VideoMetadata(
                size=size,
                created_at=created_at,
                modified_at=modified_at,
                duration=duration,
                resolution=resolution,
                framerate=framerate,
                codec=codec,
                bitrate=bitrate,
            )
        except Exception as e:
            raise RuntimeError(f"Failed to extract video metadata: {str(e)}")


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


class AudioMetadataExtractor(MetadataExtractor):
    def extract_metadata(self, file_path: str) -> AudioMetadata:
        try:
            if not os.path.exists(file_path):
                raise FileNotFoundError(f"File not found: {file_path}")

            size = os.path.getsize(file_path)
            created_at = os.path.getctime(file_path)
            modified_at = os.path.getmtime(file_path)

            try:
                probe = ffmpeg.probe(file_path)
            except ffmpeg.Error as e:
                raise ValueError(f"Error probing audio file: {e.stderr.decode()}")

            format_info = probe.get("format", {})
            streams_info = next(
                (
                    stream
                    for stream in probe.get("streams", [])
                    if stream.get("codec_type") == "audio"
                ),
                None,
            )

            if streams_info is None:
                raise ValueError("No audio stream found in file")

            try:
                bitrate = int(format_info.get("bit_rate", 0))
            except (KeyError, ValueError, TypeError):
                bitrate = None

            try:
                duration = float(format_info.get("duration", 0.0))
            except (KeyError, ValueError, TypeError):
                duration = None

            try:
                sample_rate = int(streams_info.get("sample_rate", 0))
            except (KeyError, ValueError, TypeError):
                sample_rate = None

            try:
                channels = int(streams_info.get("channels", 0))
            except (KeyError, ValueError, TypeError):
                channels = None

            try:
                codec = streams_info.get("codec_name", "unknown")
            except KeyError:
                codec = None

            return AudioMetadata(
                size=size,
                created_at=created_at,
                modified_at=modified_at,
                bitrate=bitrate,
                duration=duration,
                sample_rate=sample_rate,
                channels=channels,
                codec=codec,
            )
        except Exception as e:
            raise RuntimeError(f"Failed to extract audio metadata: {str(e)}")


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

    def extract_metadata(self, file_path: str) -> FileMetadata:
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
