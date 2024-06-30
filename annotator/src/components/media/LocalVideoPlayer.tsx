import { FC, useState } from "react";
import { filePath } from "../../../shared/utilities/general";
import LoadingIndicator from "../general/LoadingIndicator";
import React from "react";

interface LocalVideoPlayerProps {
  path: string;
}

const LocalVideoPlayer: FC<LocalVideoPlayerProps> = ({ path }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className='group relative'>
      {isLoading && (
        <div className='absolute inset-0 flex justify-center items-center'>
          <LoadingIndicator />
        </div>
      )}
      <video
        id='video-player'
        className='w-full h-auto group-hover:controls'
        onMouseOver={(event) => (event.currentTarget.controls = true)}
        onMouseOut={(event) => (event.currentTarget.controls = false)}
        src={filePath(path)}
        onCanPlay={() => setIsLoading(false)}
        onWaiting={() => setIsLoading(true)}
      />
    </div>
  );
};

export default LocalVideoPlayer;
