import json
import os

ROOT_PATH = os.path.join(os.path.expanduser("~"), "life-repository")
CONFIG_PATH = os.path.join(ROOT_PATH, "config.json")
TMP_DIR = os.path.join(ROOT_PATH, "data", "tmp")  # TODO get from global config
DATA_DIR = os.path.join(ROOT_PATH, "data")  # TODO get from global config
ANNOTATED_FILES_DIR = os.path.join(DATA_DIR, "annotation-app")
THUMBNAILS_DIR = os.path.join(DATA_DIR, "thumbnails")


def load_config():
    if not os.path.exists(CONFIG_PATH):
        with open(CONFIG_PATH, "w") as file:
            json.dump({}, file)
    with open(CONFIG_PATH, "r") as file:
        return json.load(file)


os.makedirs(TMP_DIR, exist_ok=True)
os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(THUMBNAILS_DIR, exist_ok=True)


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
        config_data = load_config()
        self.root_path = ROOT_PATH
        self.config_path = CONFIG_PATH
        self.tmp_dir = TMP_DIR
        self.data_dir = DATA_DIR
        self.thumbnails_dir = THUMBNAILS_DIR
        self.image_file_types = config_data.get("image_file_types", IMAGE_FILE_TYPES)
        self.audio_file_types = config_data.get("audio_file_types", AUDIO_FILE_TYPES)
        self.text_file_types = config_data.get("text_file_types", TEXT_FILE_TYPES)
        self.video_file_types = config_data.get("video_file_types", VIDEO_FILE_TYPES)
        self.data_file_types = config_data.get("data_file_types", DATA_FILE_TYPES)
        self.max_file_upload_size_bytes = config_data.get(
            "max_file_upload_size_bytes", MAX_FILE_UPLOAD_SIZE_BYTES
        )

        self.frame_pattern = "frame_%05d.jpg"
