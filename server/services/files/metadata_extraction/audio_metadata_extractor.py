import os
import ffmpeg

from models.file_metadata import AudioMetadata
from services.files.metadata_extraction.base import MetadataExtractor


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
