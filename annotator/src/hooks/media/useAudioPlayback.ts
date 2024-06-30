import { useState, useEffect } from "react";
import { filePath } from "../../../shared/utilities/general";

const useAudioPlayback = (path: string) => {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const abspath = filePath(path);
    const newAudio = new Audio(abspath);
    setAudio(newAudio);

    newAudio.onended = () => {
      setIsPlaying(false);
    };

    return () => {
      newAudio.pause();
      setAudio(null);
    };
  }, [path]);

  const play = () => {
    if (audio) {
      audio.play();
      setIsPlaying(true);
    }
  };

  const pause = () => {
    if (audio) {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const addTimeUpdateListener = (callback: (currentTime: number) => void) => {
    audio?.addEventListener("timeupdate", () => callback(audio.currentTime));
  };

  const removeTimeUpdateListener = (callback: (currentTime: number) => void) => {
    audio?.removeEventListener("timeupdate", () => callback(audio.currentTime));
  };

  return {
    play,
    pause,
    isPlaying,
    addTimeUpdateListener,
    removeTimeUpdateListener,
  };
};

export default useAudioPlayback;
