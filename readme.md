# Life Repository

> [!WARNING]
> This project is very much under development and a work in progress.

This is a system for building a centralized and searchable archive of all the documents in my life. For all the images, videos, notebooks, sketchbooks, all the way to tax documents, and more.

I basically want to:
- Start the process of building a centralized "life archive"
- Do data experiments, LLM experiments, and build a search engine around all my documents.

####  Right now, the goals are:
1. **An app** for interfacing, annotating, and managing the system.
    - Capturing and annotating physical documents (notebooks, sketchbooks, etc).
    - Annotating and uploading files from my phone.
    - Annotating files on the central storage server.
    - A search + chat interface for exploring.
2. **Pipelines for information extraction** across masses of existing files.    
3. **Central NAS storage server** to hold the files and host app backend.
4. **Data science experiments**.
    - Constructing and exploring a big graph database.
    - Clustering and grouping by different properties.
    - Quantifying interesting things and finding patterns.

## Outline of the System

### App
Simple React Native (Expo) mobile app for:
- Connecting remotely to drive(s) on computer/NAS.
- Annotating photos/videos/documents/etc and uploading them to the server for processing.

Future features:
- Structured search interface
- Retrieval chat interface
- View code experiments, visualizations, etc.

### Server
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