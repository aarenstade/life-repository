import os
import ffmpeg
import json
import subprocess
from typing import Optional, Tuple, Dict, Any

from models.file_metadata import VideoMetadata
from services.files.metadata_extraction.base import MetadataExtractor
from utilities.geo import GeoDataParser


class VideoMetadataExtractor(MetadataExtractor):
    def extract_metadata(self, file_path: str) -> VideoMetadata:
        try:
            if not os.path.exists(file_path):
                raise FileNotFoundError(f"File not found: {file_path}")

            probe = self._probe_video(file_path)
            video_stream = self._get_video_stream(probe)
            properties = self._get_video_properties(file_path)
            resolution = self._get_resolution(video_stream)

            return VideoMetadata(
                size=os.path.getsize(file_path),
                created_at=os.path.getctime(file_path),
                modified_at=os.path.getmtime(file_path),
                duration=self._get_duration(probe),
                width=resolution[0] if resolution[0] else None,
                height=resolution[1] if resolution[1] else None,
                framerate=self._get_framerate(video_stream),
                bitrate=self._get_bitrate(probe),
                properties=self._get_video_properties(file_path),
                location=self._get_video_location(properties),
            )
        except Exception as e:
            raise RuntimeError(f"Failed to extract video metadata: {str(e)}")

    def _probe_video(self, file_path: str) -> Dict[str, Any]:
        try:
            return ffmpeg.probe(file_path)
        except ffmpeg.Error as e:
            raise ValueError(f"Error probing video file: {e.stderr.decode()}")

    def _get_video_stream(self, probe: Dict[str, Any]) -> Dict[str, Any]:
        video_stream = next(
            (stream for stream in probe["streams"] if stream["codec_type"] == "video"),
            None,
        )
        if video_stream is None:
            raise ValueError("No video stream found in file")
        return video_stream

    def _get_duration(self, probe: Dict[str, Any]) -> Optional[float]:
        try:
            return float(probe["format"]["duration"])
        except (KeyError, ValueError, TypeError):
            return None

    def _get_resolution(
        self, video_stream: Dict[str, Any]
    ) -> Tuple[Optional[int], Optional[int]]:
        try:
            return int(video_stream["width"]), int(video_stream["height"])
        except (KeyError, ValueError, TypeError) as e:
            return None, None

    def _get_framerate(self, video_stream: Dict[str, Any]) -> Optional[float]:
        try:
            return eval(video_stream["r_frame_rate"])
        except (KeyError, ValueError, TypeError, SyntaxError):
            return None

    def _get_codec(self, video_stream: Dict[str, Any]) -> Optional[str]:
        try:
            return video_stream["codec_name"]
        except KeyError:
            return None

    def _get_bitrate(self, probe: Dict[str, Any]) -> Optional[int]:
        try:
            return int(probe["format"]["bit_rate"])
        except (KeyError, ValueError, TypeError):
            return None

    def _get_video_properties(self, file_path: str) -> Dict[str, Any]:
        try:
            command = ["exiftool", "-json", file_path]
            result = subprocess.run(
                command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True
            )
            if result.returncode != 0:
                raise Exception(f"Error running exiftool: {result.stderr}")
            metadata = json.loads(result.stdout)[0]
            return metadata
        except Exception as e:
            return {"error": str(e)}

    def _get_video_location(
        self, metadata: Dict[str, Any]
    ) -> Optional[Tuple[float, float]]:
        try:
            coords = {
                "latitude": metadata.get("GPSLatitude"),
                "longitude": metadata.get("GPSLongitude"),
                "altitude": metadata.get("GPSAltitude"),
            }
            parsed = GeoDataParser(coords).convert_geo_data()
            if (
                parsed.get("latitude") is not None
                and parsed.get("longitude") is not None
            ):
                return parsed["latitude"], parsed["longitude"]
            return None
        except Exception:
            return None
