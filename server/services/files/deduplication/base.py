from abc import ABC, abstractmethod
from typing import Dict, List, Optional
from datasketch import MinHash, MinHashLSH
from pydantic import BaseModel


class DuplicateResult(BaseModel):
    original: str
    duplicates: List[str]
    exact_matches: List[str]


class Deduplicator(ABC):
    def __init__(
        self, threshold: float = 0.5, hash_size: int = 16, num_perm: int = 256
    ):
        self.threshold: float = threshold
        self.hash_size: int = hash_size
        self.num_perm: int = num_perm
        self.lsh: MinHashLSH = MinHashLSH(threshold=threshold, num_perm=num_perm)
        self.hashes: Dict[str, MinHash] = {}

    def _compute_minhash(self, data: bytes) -> Optional[MinHash]:
        try:
            minhash = MinHash(num_perm=self.num_perm)
            minhash.update(data)
            return minhash
        except Exception:
            return None

    def add_item(self, item_id: str, data: bytes) -> None:
        minhash = self._compute_minhash(data)
        if minhash is None:
            return
        self.lsh.insert(item_id, minhash)
        self.hashes[item_id] = minhash

    def find_duplicates(self, data: bytes) -> List[str]:
        minhash = self._compute_minhash(data)
        if minhash is None:
            return []
        return self.lsh.query(minhash)
