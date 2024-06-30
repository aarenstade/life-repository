// Deepgram transcript word
export interface TranscriptWord {
  word: string;
  punctuated_word: string;
  start: number;
  end: number;
  confidence: number;
}
