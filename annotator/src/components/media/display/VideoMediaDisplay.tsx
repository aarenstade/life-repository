import { FC } from "react";
import LocalVideoPlayer from "../LocalVideoPlayer";
import React from "react";

interface VideoMediaDisplayProps {
  path: string;
}

const VideoMediaDisplay: FC<VideoMediaDisplayProps> = ({ path }) => {
  return <LocalVideoPlayer path={path} />;
};

export default VideoMediaDisplay;
