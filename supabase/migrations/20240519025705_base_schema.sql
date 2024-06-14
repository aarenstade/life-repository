CREATE TYPE file_type AS ENUM ('IMAGE', 'VIDEO', 'TEXT', 'AUDIO', 'ARCHIVE', 'DOCUMENT', 'OTHER');

-- file tables

CREATE TABLE file_metadata (
    id UUID NOT NULL DEFAULT gen_random_uuid (),
    file_id UUID NOT NULL,
    size NUMERIC,
    created_at TIMESTAMP NOT NULL,
    modified_at TIMESTAMP NOT NULL,
    image_width NUMERIC,
    image_height NUMERIC,
    image_color_mode VARCHAR(50),
    image_format VARCHAR(50),
    image_properties JSONB,
    image_xmp_data JSONB,
    image_location JSONB,
    video_duration NUMERIC,
    video_width NUMERIC,
    video_height NUMERIC,
    video_framerate DECIMAL,
    video_codec VARCHAR(50),
    video_bitrate NUMERIC,
    video_properties JSONB,
    video_location JSONB,
    text_num_words NUMERIC,
    text_language VARCHAR(50),
    text_encoding VARCHAR(50),
    audio_bitrate NUMERIC,
    audio_duration NUMERIC,
    audio_sample_rate NUMERIC,
    audio_channels NUMERIC,
    audio_codec VARCHAR(50),
    archive_num_files NUMERIC,
    archive_compression_type VARCHAR(50),
    archive_encrypted BOOLEAN,
    document_num_pages NUMERIC,
    document_author VARCHAR(255),
    document_title VARCHAR(255),
    document_language VARCHAR(50),
    PRIMARY KEY (id)
);

CREATE TABLE files (
    id UUID NOT NULL DEFAULT gen_random_uuid (),
    name VARCHAR(255),
    type file_type NOT NULL,
    path VARCHAR(255) NOT NULL,
    PRIMARY KEY (id, path)
);