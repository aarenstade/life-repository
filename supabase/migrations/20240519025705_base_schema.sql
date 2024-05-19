CREATE TYPE file_type AS ENUM ('IMAGE', 'VIDEO', 'TEXT', 'AUDIO', 'ARCHIVE', 'DOCUMENT', 'OTHER');

-- file tables

CREATE TABLE image_metadata (
    id SERIAL PRIMARY KEY,
    width INTEGER,
    height INTEGER,
    color_mode VARCHAR(50),
    format VARCHAR(50)
);

CREATE TABLE video_metadata (
    id SERIAL PRIMARY KEY,
    duration INTEGER,
    width INTEGER,
    height INTEGER,
    framerate DECIMAL,
    codec VARCHAR(50),
    bitrate INTEGER
);

CREATE TABLE text_metadata (
    id SERIAL PRIMARY KEY,
    num_words INTEGER,
    language VARCHAR(50),
    encoding VARCHAR(50)
);

CREATE TABLE audio_metadata (
    id SERIAL PRIMARY KEY,
    bitrate INTEGER,
    duration INTEGER,
    sample_rate INTEGER,
    channels INTEGER,
    codec VARCHAR(50)
);

CREATE TABLE archive_metadata (
    id SERIAL PRIMARY KEY,
    num_files INTEGER,
    compression_type VARCHAR(50),
    encrypted BOOLEAN
);

CREATE TABLE document_metadata (
    id SERIAL PRIMARY KEY,
    num_pages INTEGER,
    author VARCHAR(255),
    title VARCHAR(255),
    language VARCHAR(50)
);

CREATE TABLE file_metadata (
    id SERIAL PRIMARY KEY,
    size BIGINT,
    created_at TIMESTAMP NOT NULL,
    modified_at TIMESTAMP NOT NULL,
    image_metadata_id INTEGER REFERENCES image_metadata(id),
    video_metadata_id INTEGER REFERENCES video_metadata(id),
    text_metadata_id INTEGER REFERENCES text_metadata(id),
    audio_metadata_id INTEGER REFERENCES audio_metadata(id),
    archive_metadata_id INTEGER REFERENCES archive_metadata(id),
    document_metadata_id INTEGER REFERENCES document_metadata(id)
);

CREATE TABLE files (
    id UUID NOT NULL DEFAULT gen_random_uuid (),
    name VARCHAR(255),
    type file_type NOT NULL,
    path VARCHAR(255) NOT NULL,
    metadata_id INTEGER REFERENCES file_metadata(id),
    PRIMARY KEY (id, path)
);