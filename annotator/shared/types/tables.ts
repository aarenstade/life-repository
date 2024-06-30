export interface ProcessingJob {
  job_id: string;
  project_id: string;
  job_type: string;
  job_payload: any; // JSONB
  status: string;
  started_at: string; // TIMESTAMP
  updated_at: string; // TIMESTAMP
  completed_at?: string; // TIMESTAMP
  progress_percentage: number;
}
