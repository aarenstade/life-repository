import os
import ffmpeg

from models.file_metadata import VideoMetadata
from services.files.metadata_extraction.base import MetadataExtractor
from services.files.directory_file_organizer import DirectoryFileOrganizer


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
