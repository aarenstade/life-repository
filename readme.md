# Life Repository

> [!WARNING]
> This project is very much under development and a work in progress.

This is a system for building a centralized and searchable archive of all the documents in my life. For all the images, videos, notebooks, sketchbooks, all the way to tax documents, and more.

Overall, there are a few sub-goals:
1. Digitize my physical documents, notebooks, drawings, etc.
2. Quickly annotate and tag files with a mobile app.
3. Upload and store all files w/ metadata in a central location (NAS server).
4. Use different methods to search across all my files.
    - Basic SQL filter queries.
    - Fuzzy searching tags.
    - Similarity search on natural language queries.
    - Chat using an LLM chat agent
5. Experimenting with various data science methods.
    - Clustering and grouping.
    - Quantifying interesting things.

I basically want a NAS storage system for all my data, with integrated AI, that I can experiment with.

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

Categories to label things:
- File category (eg. image, video, text, document, etc.)
- File type (eg. jpg, png, heic, mp4, pdf, etc.)
- Origin medium (eg. physical, digital)
- Groups (arbitrary groups to put file into, exiting or new)
- Tags (list of tags to attach to file)
- Manual content description
- Generated content description



