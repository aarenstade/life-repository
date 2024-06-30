export interface MediaTranscriptionCompletion {
  media: {
    path: string;
    audio_blob?: Blob;
    video_blob?: Blob;
    metadata?: {
      duration: number;
    };
  };

  transcript_data?: any; // TODO type
  errors?: string[]; // TODO type
}
