from dotenv import load_dotenv

load_dotenv()

import os
import uvicorn
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers.file_io import router as file_io_router
from routers.transcribe import router as transcribe_router
from routers.tags import router as tags_router
from lib.database.sqlite3 import SQLite3Adapter
from config import load_config


def initialize_database() -> SQLite3Adapter:
    print("Initializing database")
    database_path = config.get("sqlite_database_path")
    schema_path = config.get("sqlite_database_schema_path")

    if not database_path:
        raise ValueError("Database path not set in configuration")

    if not schema_path:
        raise ValueError("Database schema path not set in configuration")

    db = SQLite3Adapter(connection_string=database_path)
    db.connect()

    if not db.fetch_all("SELECT name FROM sqlite_master WHERE type='table'"):
        db.initialize_schema(schema_path)

    print("Database initialized")
    return db


@asynccontextmanager
async def lifespan(application: FastAPI):
    db = initialize_database()
    application.state.db = db
    yield
    db.disconnect()


def create_app():
    app = FastAPI(lifespan=lifespan)

    environment = os.getenv("ENVIRONMENT", "dev")  # Default to 'development' if not set

    if environment == "dev":
        logger = logging.getLogger("uvicorn")
        logger.warning("Running in development mode - allowing CORS for all origins")
        app.add_middleware(
            CORSMiddleware,
            allow_origins=["*"],
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )

    app.include_router(file_io_router, prefix="/paths")
    app.include_router(transcribe_router, prefix="/transcribe")
    app.include_router(tags_router, prefix="/tags")

    return app


config = load_config()
app = create_app()


@app.get("/config")
async def get_config():
    return load_config()


if __name__ == "__main__":
    uvicorn.run(app="main:app", host="0.0.0.0", reload=True)
