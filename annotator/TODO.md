### media assignment

- [x] Magic wand assign media automatically
- [x] Select and assign images
- [ ] Select and assign sections of video

### action cell UI

- [ ] See thumbnail of media in action cell
- [ ] Make action cell collapsable if over certain height

### transcript UI / editing

- [ ] Render pauses and gaps between words
- [ ] Magic want to remove all gaps
- [ ] Fill words list with GAP items
- [ ] Calculate action duration based on words + GAP items
- [ ] Recalculate action duration when editing words

### playback

- [x] Playback element controller

  - [x] Design simple abstraction for action element (BaseElementController).
  - [x] Redesign ElementController to utilize abstracted elements and manage synced playback.

- [x] Create proxies for all video content
- [x] /playback/extract server to edit proxies
- [ ] Move proxy generation to server
- [ ] Move webcam video conversion to server

### timeline editing

- [ ] Fix bug where media sticks around in stack (and maybe elsewhere) after deleting
- [ ] Create reactive updater to glue actions together when things are deleted, reduced, expanded, inserted, etc.
