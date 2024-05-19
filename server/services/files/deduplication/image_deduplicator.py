from typing import Dict, List, Optional, Tuple
from concurrent.futures import ThreadPoolExecutor, as_completed

import imagehash
from PIL import Image
from datasketch import MinHash

from models.file_metadata import FileType
from services.files.deduplication.base import Deduplicator, DuplicateResult
from services.files.directory_file_organizer import DirectoryFileOrganizer


class ImageDeduplicator(Deduplicator):
    def __init__(
        self, threshold: float = 0.5, hash_size: int = 16, num_perm: int = 256
    ):
        super().__init__(threshold, hash_size, num_perm)
        self.image_hashes: Dict[str, imagehash.ImageHash] = {}

    def _compute_hash(self, image_path: str) -> Optional[imagehash.ImageHash]:
        try:
            image = Image.open(image_path)
            phash = imagehash.phash(image, hash_size=self.hash_size)
            return phash
        except Exception:
            return None

    def _compute_image_minhash(self, phash: imagehash.ImageHash) -> Optional[MinHash]:
        try:
            minhash = MinHash(num_perm=self.num_perm)
            for hash_value in phash.hash.flatten():
                minhash.update(int(hash_value).to_bytes(1, byteorder="big"))
            return minhash
        except Exception:
            return None

    def add_image(self, image_path: str) -> None:
        phash = self._compute_hash(image_path)
        if phash is None:
            return
        minhash = self._compute_image_minhash(phash)
        if minhash is None:
            return
        self.lsh.insert(image_path, minhash)
        self.image_hashes[image_path] = phash

    def find_duplicates(self, image_path: str) -> Tuple[List[str], List[str]]:
        phash = self._compute_hash(image_path)
        if phash is None:
            return [], []
        minhash = self._compute_image_minhash(phash)
        if minhash is None:
            return [], []
        duplicates = self.lsh.query(minhash)
        similar_files = [
            dup for dup in duplicates if self._is_similar(phash, self.image_hashes[dup])
        ]
        exact_matches = [
            dup
            for dup in duplicates
            if self._is_exact_match(phash, self.image_hashes[dup])
        ]
        return similar_files, exact_matches

    def _is_similar(
        self, phash1: imagehash.ImageHash, phash2: imagehash.ImageHash
    ) -> bool:
        similarity = 1 - (phash1 - phash2) / len(phash1.hash.flatten())
        return similarity >= self.threshold

    def _is_exact_match(
        self, phash1: imagehash.ImageHash, phash2: imagehash.ImageHash
    ) -> bool:
        return phash1 == phash2

    def deduplicate_image_paths(self, image_paths: List[str]) -> List[DuplicateResult]:
        results: List[DuplicateResult] = []
        with ThreadPoolExecutor() as executor:
            futures = {
                executor.submit(self._process_image, image_path): image_path
                for image_path in image_paths
                if DirectoryFileOrganizer.get_file_type(image_path.split(".")[-1])
                == FileType.IMAGE
            }
            for future in as_completed(futures):
                image_path = futures[future]
                try:
                    duplicates, exact_matches = future.result()
                    if duplicates or exact_matches:
                        results.append(
                            DuplicateResult(
                                original=image_path,
                                duplicates=duplicates,
                                exact_matches=exact_matches,
                            )
                        )
                except Exception:
                    pass
        return results

    def _process_image(self, image_path: str) -> Tuple[List[str], List[str]]:
        duplicates, exact_matches = self.find_duplicates(image_path)
        if not duplicates and not exact_matches:
            self.add_image(image_path)
        return duplicates, exact_matches
