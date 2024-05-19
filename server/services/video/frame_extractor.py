import os
import traceback

import cv2
from tqdm import tqdm

from config import Config

config = Config()


class FrameExtractor:
    def __init__(
        self,
        video_path,
        method="interval",
        output_dir=None,
        debug_progress=True,
    ):
        """
        Args:
            video_path (str): Path to the video file to be processed.
            method (str, optional): Method to be used for frame extraction. Can be 'interval' or 'histogram'. Defaults to 'interval'.
            output_dir (str, optional): Directory where the extracted frames will be saved. If not provided, frames will be saved in a default directory. Defaults to None.
        """
        self.method = method
        self.video_path = video_path
        self.debug_progress = debug_progress
        self.frame_paths = []
        self.output_dir = (
            output_dir
            if output_dir
            else os.path.join(
                config.tmp_dir,
                os.path.basename(self.video_path).split(".")[0] + "_frames",
            )
        )

    def extract_frames(self, skip_interval=10, uniform_count=10):
        try:
            if self.method == "histogram":
                self._histogram_clustering_extraction()
            elif self.method == "interval":
                self._interval_extraction(skip_interval)
            elif self.method == "uniform":
                self._uniform_extraction(uniform_count)
            else:
                raise ValueError("Invalid method")
            return sorted(self.frame_paths)
        except Exception as e:
            print(f"Error extracting frames: {e}")
            print(traceback.format_exc())
            return []

    def _histogram_clustering_extraction(self):
        raise NotImplementedError(
            "Histogram clustering extraction is not implemented yet."
        )

    def _interval_extraction(self, skip_interval):
        if not os.path.exists(self.output_dir):
            os.makedirs(self.output_dir)

        print(f"Extracting frames from {self.video_path} to {self.output_dir}...")

        cap = cv2.VideoCapture(self.video_path)

        if not cap.isOpened():
            raise IOError(f"Unable to open video file: {self.video_path}")

        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        if total_frames == 0:
            raise ValueError("The video contains no frames.")

        print(f"Skipping every {skip_interval} frames...")

        frame_number = 0
        frame_file_number = 0
        progress_bar = tqdm(total=total_frames) if self.debug_progress else None

        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            if frame_number % skip_interval == 0:
                frame_file = os.path.join(
                    self.output_dir, config.frame_pattern % frame_file_number
                )
                if not cv2.imwrite(frame_file, frame):
                    raise IOError(f"Failed to write frame to {frame_file}")
                self.frame_paths.append(frame_file)
                frame_file_number += 1

            frame_number += 1
            if self.debug_progress:
                progress_bar.update(1)

        if self.debug_progress:
            progress_bar.close()
        cap.release()

    def _uniform_extraction(self, num_frames_to_extract):
        if not os.path.exists(self.output_dir):
            os.makedirs(self.output_dir)

        print(f"Extracting {num_frames_to_extract} uniformly spaced frames...")

        cap = cv2.VideoCapture(self.video_path)

        if not cap.isOpened():
            raise IOError(f"Unable to open video file: {self.video_path}")

        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        if total_frames == 0:
            raise ValueError("The video contains no frames.")

        interval = max(1, total_frames // num_frames_to_extract)

        frame_file_number = 0
        progress_bar = (
            tqdm(total=num_frames_to_extract) if self.debug_progress else None
        )

        for i in range(num_frames_to_extract):
            cap.set(cv2.CAP_PROP_POS_FRAMES, i * interval)
            ret, frame = cap.read()
            if not ret:
                break

            frame_file = os.path.join(
                self.output_dir, config.frame_pattern % frame_file_number
            )
            if not cv2.imwrite(frame_file, frame):
                raise IOError(f"Failed to write frame to {frame_file}")
            self.frame_paths.append(frame_file)
            frame_file_number += 1

            if self.debug_progress:
                progress_bar.update(1)

        if self.debug_progress:
            progress_bar.close()
        cap.release()
