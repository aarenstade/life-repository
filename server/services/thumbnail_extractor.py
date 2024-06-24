import os
import shlex
import subprocess
from typing import List, Optional, Union

from PIL import Image, ExifTags

from config import Config
from utilities.image import convert_heic_to_jpg

config = Config()


class ThumbnailExtractor:
    def __init__(
        self,
        media_path: str,
        output_dir: str,
        media_type: Optional[str] = None,
        media_id: Optional[str] = None,
        size: int = 512,
    ):
        self.media_path = media_path
        self.media_id = media_id or os.path.splitext(os.path.basename(media_path))[0]
        self.output_dir = output_dir
        self.media_type = media_type or self._determine_media_type()
        self.size = size

        os.makedirs(self.output_dir, exist_ok=True)

    def _determine_media_type(self) -> str:
        extension = os.path.splitext(self.media_path)[1].lower().replace(".", "")
        if extension in config.video_file_types:
            return "video"
        elif extension in config.image_file_types:
            return "image"
        else:
            raise ValueError("Unsupported media type")

    def _run_command(self, command: str) -> subprocess.CompletedProcess:
        return subprocess.run(
            command,
            shell=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
        )

    def _get_video_duration(self) -> float:
        duration_command = f"ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 {shlex.quote(self.media_path)}"
        result = self._run_command(duration_command)
        if result.returncode != 0:
            raise RuntimeError(f"Failed to get video duration: {result.stderr}")
        return float(result.stdout.strip())

    def _extract_frame(self, time: float, output_path: str) -> None:
        frame_command = f"ffmpeg -ss {time} -i {shlex.quote(self.media_path)} -frames:v 1 {shlex.quote(output_path)}"
        result = self._run_command(frame_command)
        if result.returncode != 0:
            raise RuntimeError(f"Failed to extract frame: {result.stderr}")

    def _process_image(
        self, input_path: str, output_path: str, quality: int = 60
    ) -> None:
        img = Image.open(input_path)
        img.thumbnail((self.size, self.size))
        img = self._maintain_orientation(img)
        img.save(output_path, "JPEG", quality=quality)

    def _maintain_orientation(self, img: Image) -> Image:
        try:
            for orientation in ExifTags.TAGS.keys():
                if ExifTags.TAGS[orientation] == "Orientation":
                    break
            exif = img._getexif()
            if exif is not None:
                orientation = exif.get(orientation)
                if orientation == 3:
                    img = img.rotate(180, expand=True)
                elif orientation == 6:
                    img = img.rotate(270, expand=True)
                elif orientation == 8:
                    img = img.rotate(90, expand=True)
        except (AttributeError, KeyError, IndexError):
            pass
        return img

    def _extract_video(self, n: int) -> List[str]:
        paths = []
        duration = self._get_video_duration()
        intervals = duration / n

        for i in range(n):
            time = i * intervals
            output_path = os.path.join(self.output_dir, f"{self.media_id}_{i}.jpg")
            self._extract_frame(time, output_path)
            self._process_image(output_path, output_path)
            paths.append(output_path)

        return paths

    def _extract_image(self) -> str:
        dest_path = os.path.join(self.output_dir, f"{self.media_id}.jpg")
        if self.media_path.lower().endswith(".heic"):
            convert_heic_to_jpg(self.media_path, dest_path)
        else:
            self._process_image(self.media_path, dest_path, quality=10)
        return dest_path

    def extract(self) -> Optional[Union[List[str], str]]:
        try:
            if self.media_type == "video":
                return self._extract_video(1)
            elif self.media_type == "image":
                return [self._extract_image()]
            else:
                raise ValueError("Unsupported media type")
        except Exception as e:
            print(f"ERROR EXTRACTING THUMBNAILS: {e}")
            return None
