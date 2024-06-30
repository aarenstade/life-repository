const DATABASE_ENDPOINTS = {
  processing_jobs: {
    get: "db/processing_jobs/get",
    getAll: "db/processing_jobs/getAll",
    create: "db/processing_jobs/create",
    update: "db/processing_jobs/update",
    delete: "db/processing_jobs/delete",
  },
};

const FILE_IO_ENDPOINTS = {
  AUDIO: {
    wav: {
      write: "file-io/audio/wav/write",
    },
    mp3: {
      write: "file-io/audio/mp3/write",
    },
    read: "file-io/audio/read",
  },
  VIDEO: {
    stream: "file-io/video/stream",
    on_stream_chunk: "file-io/video/on_stream_chunk",
    on_stream_end: "file-io/video/on_stream_end",
    on_stream_error: "file-io/video/on_stream_error",
    mkv: {
      write: "file-io/video/mkv/write",
    },
    mp4: {
      write: "file-io/video/mp4/write",
    },
  },
  IMAGE: {
    read: "file-io/image/read",
    png: {
      write: "file-io/image/png/write",
    },
    jpg: {
      write: "file-io/image/jpg/write",
    },
  },
  TEXT: {
    read: "file-io/text/read",
    txt: {
      write: "file-io/text/txt/write",
    },
  },
};

// ffmpeg -i input.mkv -c:v libx264 -c:a aac output.mp4
const PROCESSING_ENDPOINTS = {
  VIDEO: {
    CONVERT: {
      to_proxy: "processing/video/convert/to_proxy",
      to_mp4: "processing/video/convert/to_mp4",
    },
  },
  TRANSCRIBE: {
    video_path: "processing/transcribe/video_path",
    audio_path: "processing/transcribe/audio_path",
  },
};

const ENDPOINTS = {
  DATABASE: DATABASE_ENDPOINTS,
  FILE_IO: FILE_IO_ENDPOINTS,
  PROCESSING: PROCESSING_ENDPOINTS,
};

export default ENDPOINTS;
