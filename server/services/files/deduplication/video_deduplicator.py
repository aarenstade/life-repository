import os
import uuid
import shutil
from typing import List, Optional, Dict
from concurrent.futures import ThreadPoolExecutor, as_completed

from datasketch import MinHash

from services.files.deduplication.base import Deduplicator, DuplicateResult
from services.video.frame_extractor import FrameExtractor

from config import Config

config = Config()


"""

TODO THIS NEEDS MAJOR DEBUGGING AND FIXING

"""


class VideoDeduplicator(Deduplicator):
    def __init__(
        self,
        threshold: float = 0.5,
        hash_size: int = 16,
        num_perm: int = 256,
        tmp_dir: str = os.path.join(
            config.tmp_dir, f"video_frames_{str(uuid.uuid4())}"
        ),
    ):
        super().__init__(threshold, hash_size, num_perm)
        self.tmp_dir = tmp_dir
        self.keyframes_dict = {}
        self.hashes_dict = {}

    def _compute_minhash(self, data: bytes) -> Optional[MinHash]:
        try:
            minhash = MinHash(num_perm=self.num_perm)
            minhash.update(data)
            return minhash
        except Exception:
            return None

    def _extract_keyframes(self, video_path: str) -> List[bytes]:
        video_tmp_dir = os.path.join(self.tmp_dir, os.path.basename(video_path))
        frame_extractor = FrameExtractor(
            video_path, method="uniform", output_dir=video_tmp_dir
        )
        frame_paths = frame_extractor.extract_frames(uniform_count=10)
        keyframes = []
        for frame_path in frame_paths:
            with open(frame_path, "rb") as frame_file:
                keyframes.append(frame_file.read())
        return keyframes

    def _extract_keyframes_concurrently(
        self, video_paths: List[str]
    ) -> Dict[str, List[bytes]]:
        keyframes_dict = {}
        with ThreadPoolExecutor() as executor:
            futures = {
                executor.submit(self._extract_keyframes, video_path): video_path
                for video_path in video_paths
            }
            for future in as_completed(futures):
                video_path = futures[future]
                try:
                    keyframes_dict[video_path] = future.result()
                except Exception:
                    keyframes_dict[video_path] = []
        return keyframes_dict

    def _compute_hashes(
        self, keyframes_dict: Dict[str, List[bytes]]
    ) -> Dict[str, MinHash]:
        hashes_dict = {}
        for video_path, keyframes in keyframes_dict.items():
            combined_minhash = MinHash(num_perm=self.num_perm)
            for frame in keyframes:
                frame_minhash = self._compute_minhash(frame)
                if frame_minhash:
                    combined_minhash.merge(frame_minhash)
            hashes_dict[video_path] = combined_minhash
            self.lsh.insert(video_path, combined_minhash)
        return hashes_dict

    def deduplicate_video_paths(self, video_paths: List[str]) -> List[DuplicateResult]:
        results = []

        # Step 1: Extract all frames concurrently
        self.keyframes_dict = self._extract_keyframes_concurrently(video_paths)

        print("Extracted keyframes for all videos")
        print(self.keyframes_dict)

        # Step 2: Compute and merge hashes for each video
        self.hashes_dict = self._compute_hashes(self.keyframes_dict)

        # Step 3: Compare merged hashes to find duplicates
        for video_path, video_minhash in self.hashes_dict.items():
            duplicates = []
            for other_video_path, other_video_minhash in self.hashes_dict.items():
                if video_path != other_video_path and self.lsh.query(video_minhash):
                    duplicates.append(other_video_path)
            if duplicates:
                results.append(
                    DuplicateResult(
                        original=video_path, duplicates=duplicates, exact_matches=[]
                    )
                )
            else:
                self.add_video(video_path, video_path)

        shutil.rmtree(self.tmp_dir, ignore_errors=True)
        return results
