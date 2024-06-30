export const VIDEO_HEIGHT_PERCENTAGES = {
  "4:3": "75%",
  "16:9": "56.25%",
  "16:10": "62.5%",
  "21:9": "42.86%",
  "32:9": "28.125%",
};

export const BASE_VIDEOJS_OPTIONS: any = {
  autoplay: false,
  controls: true,
  responsive: true,
  fluid: true,
  preload: "metadata",
  html5: {
    hls: {
      limitRenditionByPlayerDimensions: false,
      smoothQualityChange: true,
      overrideNative: false,
    },
  },
};

export const DEFAULT_VIDEO_WIDTH = 1280;
export const PROXY_VIDEO_MIME_TYPE = "video/mp4; codecs=h264";
export const PLAYBACK_VIEWER_ID = "playback-viewer";

export const MAX_MS_BETWEEN_WORDS = 300;
export const DEFAULT_TIMECODE_PADDING = 75;
