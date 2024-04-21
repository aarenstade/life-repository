import os

TMP_DIR = os.path.join(
    os.path.expanduser("~"), "life-repository", "data", "tmp"
)  # TODO get from global config
DATA_DIR = os.path.join(
    os.path.expanduser("~"), "life-repository", "data"
)  # TODO get from global config

os.makedirs(TMP_DIR, exist_ok=True)
os.makedirs(DATA_DIR, exist_ok=True)

VIDEO_FILE_TYPES = [
    "mp4",
    "avi",
    "flv",
    "mov",
    "webm",
    "mkv",
    "mpeg",
    "mpv",
    "m2v",
    "3gp",
]

IMAGE_FILE_TYPES = [
    "jpg",
    "jpeg",
    "png",
    "heic",
    "gif",
    "bmp",
    "svg",
    "tiff",
    "tif",
    "webp",
    "ico",
]

AUDIO_FILE_TYPES = [
    "mp3",
    "wav",
    "ogg",
    "flac",
    "aac",
    "m4a",
    "aiff",
    "aiff",
    "flac",
    "m4a",
]

TEXT_FILE_TYPES = [
    "txt",
    "doc",
    "docx",
    "pdf",
    "odt",
    "rtf",
    "tex",
    "wks",
    "wps",
    "wpd",
    "pages",
    "md",
]

DATA_FILE_TYPES = [
    "csv",
    "xls",
    "xlsx",
    "ppt",
    "pptx",
    "json",
    "xml",
    "sql",
    "db",
    "log",
    "dat",
]

MAX_FILE_UPLOAD_SIZE_BYTES = 100 * 1024 * 1024  # 100 MB


class Config:
    def __init__(self):
        pass
