from config import load_config
from lib.database.sqlite3 import SQLite3Adapter


def fill_tags_test_data():
    config = load_config()
    db = SQLite3Adapter(connection_string=config.get("sqlite_database_path"))
    db.connect()
    tags = [
        {"type": "generic", "tag": "tag1"},
        {"type": "generic", "tag": "tag2"},
        {"type": "specific", "tag": "tag3"},
        {"type": "specific", "tag": "tag4"},
        {"type": "misc", "tag": "tag5"},
        {"type": "generic", "tag": "tag6"},
        {"type": "generic", "tag": "tag7"},
        {"type": "specific", "tag": "tag8"},
        {"type": "specific", "tag": "tag9"},
        {"type": "misc", "tag": "tag10"},
        {"type": "generic", "tag": "tag11"},
        {"type": "generic", "tag": "tag12"},
        {"type": "specific", "tag": "tag13"},
        {"type": "specific", "tag": "tag14"},
        {"type": "misc", "tag": "tag15"},
        {"type": "generic", "tag": "tag16"},
        {"type": "generic", "tag": "tag17"},
        {"type": "specific", "tag": "tag18"},
        {"type": "specific", "tag": "tag19"},
        {"type": "misc", "tag": "tag20"},
        {"type": "generic", "tag": "tag21"},
        {"type": "generic", "tag": "tag22"},
        {"type": "specific", "tag": "tag23"},
        {"type": "specific", "tag": "tag24"},
        {"type": "misc", "tag": "tag25"},
        {"type": "generic", "tag": "tag26"},
        {"type": "generic", "tag": "tag27"},
        {"type": "specific", "tag": "tag28"},
        {"type": "specific", "tag": "tag29"},
        {"type": "misc", "tag": "tag5"},
    ]

    for tag in tags:
        db.insert(
            "tags",
            {
                "type": tag["type"],
                "tag": tag["tag"],
            },
        )

    db.disconnect()
