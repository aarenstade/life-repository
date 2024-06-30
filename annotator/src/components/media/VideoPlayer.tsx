import { FC, useEffect, useRef } from "react";
import { BASE_VIDEOJS_OPTIONS } from "../../../shared/config/playback";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import React from "react";

interface VideoPlayerProps {
  hls_url: string;
  dash_url?: string;
  width?: number;
  widthClassname?: string;
  onReady?: (player: any) => void;
}

const VideoPlayer: FC<VideoPlayerProps> = ({ hls_url, dash_url, width, onReady, widthClassname }) => {
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    if (!playerRef.current) {
      let options = {
        ...BASE_VIDEOJS_OPTIONS,
        sources: [
          {
            src: hls_url,
            type: "application/x-mpegURL",
          },
          {
            src: dash_url,
            type: "application/dash+xml",
          },
        ],
      };

      const videoElement = document.createElement("video-js");
      videoElement.classList.add("vjs-big-play-centered");
      videoElement.style.width = `${width}px`;

      videoRef.current?.appendChild(videoElement);

      const player = (playerRef.current = videojs(videoElement, options, () => {
        onReady && onReady(player);
      }));
    } else {
      const player = playerRef.current;
      if (player) {
        player.autoplay(BASE_VIDEOJS_OPTIONS.autoplay);
        player.src(BASE_VIDEOJS_OPTIONS.sources);
      }
    }
  }, [videoRef]);

  useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  return (
    <div data-vjs-player className={widthClassname ? widthClassname : "w-full"}>
      <div ref={videoRef} />
    </div>
  );
};

export default VideoPlayer;
