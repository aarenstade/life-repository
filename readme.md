# Life Repository

> [!WARNING]
> This project is very much under development and a work in progress.

This is a system for building a centralized and searchable archive of all the documents in my life. For all the images, videos, notebooks, sketchbooks, all the way to tax documents, and more.

I basically want to:
- Start the process of building a centralized "life archive"
- Do data experiments, LLM experiments, and build a search engine.

Here's what I'm trying to build:
1. App to easily capture and annotate all my physical documents (notebooks, sketchbooks, etc).
2. App functionality for annotating existing files remotely (eg. files on a NAS server).
3. Build and experiment with different methods to search across all my files.
    - Basic SQL filter queries.
    - Fuzzy searching tags.
    - Similarity search on natural language queries.
    - Chat using an LLM chat agent
4. Various data science experiments.
    - Clustering and grouping.
    - Quantifying interesting things.
    - Constructing a semantic graph.

## Outline of the System

### Mobile App
Simple mobile app for:
- Connecting remotely to drive(s) on computer/NAS.
- Annotating photos/videos/documents/etc and uploading them to the server for processing.

Future features:
- Search using the different search methods listed above.
- View code experiments, visualizations, etc.

### Ingestion Server
Python FastAPI server that runs on computer/NAS, exposed to the internet, that interfaces with the app.
Does a few different things:
- Basic file navigation, listing files, viewing files, uploading files, etc.
- Ingesting and processing new files.
    - Metadata extraction.
    - Inserting into database.
    - AI processing.
        - Multi-modal image/video understanding.
        - Transcription and summarization.
        - LLM metadata extratction/synthesis.
- Tracking and logging processing status.
- Performing searches.

## Rough Notes on Data

### Data Extraction

Things we want to capture about each file:
- File type (eg. image, video, text, document, etc.)
- File extension (eg. jpg, png, heic, mp4, pdf, etc.)
- Tags (groups, people, attributes, etc)
- Manual content description
- Generated content description

## Rough Notes on Search
- Integrate vector search into Sqlite with [Sqlite-VSS](https://python.langchain.com/v0.1/docs/integrations/vectorstores/sqlitevss/)

