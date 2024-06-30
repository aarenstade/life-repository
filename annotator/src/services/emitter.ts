import mitt from "mitt";

const PLAYBACK_EVENTS = {
  PAUSE: "playback.pause",
  RESET: "playback.reset",
  PLAY: "playback.play",
  SEEK_TO: "playback.seek_to",
  UPDATE_STACK: "playback.update_stack",
};

const UI_EVENTS = {
  CLICK: {
    TEXT_TIMELINE: {
      SPAN: "ui.click.text_timeline.span",
    },
  },
  SELECTION: {
    TEXT_TIMELINE: {
      OUTSIDE: "ui.selection.text_timeline.outside",
    },
  },
};

const AI_EVENTS = {
  ASSIGN_MEDIA: "generation.assign_media",
};

const OPERATIONS = {
  ACTION: {
    REMOVE_WORD_GAPS: "transcript.remove_word_gaps",
  },
};

export const EMITTER_EVENTS = {
  playback: PLAYBACK_EVENTS,
  ai: AI_EVENTS,
  ui: UI_EVENTS,
  operations: OPERATIONS,
};

export type EmitterEvent = {
  type: string;
  data: any;
};

const emitter = mitt();
export default emitter;
