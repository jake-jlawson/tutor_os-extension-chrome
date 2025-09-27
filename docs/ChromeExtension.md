# Chrome Extension

## UX Decisions
- Custom menu option (”Start a new lesson with TutorOS”) when right clicking a google meet link.
- Google Meet / meeting overlay (”Lesson Transcription”):
    - Play/Pause Button.
    - Recording Status button (shows if the recording is active and successfully transcribing).
    - Lesson Title / id / info (date/time) to keep track of which lesson is being recorded.
- Lesson Startup:
    - Consent dialogue. explanation of feature and “Start lesson transcription."
- Widget menu / popover:
    - Lesson Control Area:
        - If no lesson is active it shows the “start a new lesson” ui.
        - If a lesson is active it shows the controls.
        - Lessons should allow the user to select which tab to record.
    - Lessons List:
        - List of all past lessons (only loads 10 at a time but loads more if clicked).
        - Clicking each lesson opens the lesson page which for now will just display the transcript in a way which is very easy to copy and paste / download.
        - Active lessons show “active” badge, transcription status and an option to end the lesson.

## Tech Stack
- **TypeScript (tsc-only)**: compile TS → ESM JS, no bundler. Keep modules small
- **Manifest V3** with a **service worker** background for orchestration and messaging.
- **UI without React**: use **lit + native Web Components + Shadow DOM** for the popup, options, overlay, and any in-page widgets. Plain CSS with CSS variables.
- **Permissions**: keep minimal (tabCapture, storage, tabs, offscreen; host_permissions for meeting domains and API host).
- **Networking**: native `fetch` with a tiny wrapper for auth headers and retry/backoff.

## Architecture
- When a lesson recording is started, UI (either popup or overlay) sends a message to service worker
- Service worker creates (or reuses) offscreen document to capture audio and microphone from the meeting.
- Offscreen streams chunks to backend and reports status back via a port. 
- Don't depend on SW for the hot loop - Network retries, chunk buffering, etc., should live in offscreen.

## Lesson Transcription Control Overlay
This will be a UI injected into google meet pages via content scripts.
- Content overlays will be injected based on "signed token in URL": "https://meet.google.com/abc-defg-hij#xt=<HMAC-of-lesson>" which the frontend will auto-add to each lesson link.

## Directory layout (proposed)
- `manifest.json` – declares contexts, permissions, action popup, service worker.
- `src/` — TypeScript sources
    - `background/` — (service worker) – files for event handlers, orchestration, messaging.
    - `ui/` - all files associated with UI elements (overlay, popups, etc.)
    - `audio_capture/` — offscreen page + audio capture and streaming pipeline
    - `lib/` — small utilities (dom, messaging, storage, fetch)
- `public/` — html/css/icons (copied as-is)
- `dist/` — compiled JS + copied assets (output)

## Design Documentation