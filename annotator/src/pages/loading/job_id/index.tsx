import LoadingIndicator from "../../../components/general/LoadingIndicator";
import { ipcRenderer } from "electron";
import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ENDPOINTS from "../../../../shared/config/endpoints";
import ProgressBar from "../../../components/general/ProgressBar";
import React from "react";

interface JobLoadingPageProps {}

const JobLoadingPage: FC<JobLoadingPageProps> = () => {
  const { job_id } = useParams();
  const [job, setJob] = useState<any>(null);

  const fetchJobStatus = async () => {
    const response = await ipcRenderer.invoke(ENDPOINTS.DATABASE.processing_jobs.get, { job_id });
    if (response.status === "completed") window.location.href = "/";
    setJob(response);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchJobStatus();
    }, 500);

    return () => clearInterval(interval);
  }, [job_id]);

  return (
    <div>
      <div className='text-center text-lg font-semibold'>{job ? `Status: ${job.status}` : "Loading..."}</div>
      <div className='w-full'>{job && job.progress_percentage && <ProgressBar value={job.progress_percentage} />}</div>
      <LoadingIndicator />
    </div>
  );
};

export default JobLoadingPage;
