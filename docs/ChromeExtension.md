# Chrome Extension

## UX Decisions
- Custom menu option (”Start a new lesson with TutorOS”) when right clicking a google meet link.
- Google Meet / meeting overlay (”Lesson Transcription”):
    - Play/Pause Button.
    - Recording Status button (shows if the recording is active and successfully transcribing).
    - Lesson Title / id / info (date/time) to keep track of which lesson is being recorded.
- Lesson Startup:
    - Consent dialogue. explanation of feature and “Start lesson transcription.
- Widget menu:
    - Lesson Control Area:
        - If no lesson is active it shows the “start a new lesson” ui.
        - If a lesson is active it shows the controls.
        - Lessons should allow the user to select which tab to record.
    - Lessons List:
        - List of all past lessons (only loads 10 at a time but loads more if clicked).
        - Clicking each lesson opens the lesson page which for now will just display the transcript in a way which is very easy to copy and paste / download.
        - Active lessons show “active” badge, transcription status and an option to end the lesson.

## Tech Stack

### Goals
- **Lightweight**: no heavy frameworks or bundlers; fast load, minimal surface area.
- **Good DX**: TypeScript, modular files, simple watch/build, clear structure.
- **Chrome MV3 compliant**: no remote code, no eval, packaged ESM only.

### Core architecture choices
- **Manifest V3** with a **service worker** background for orchestration and messaging.
- **TypeScript (tsc-only)**: compile TS → ESM JS, no bundler. Keep modules small.
- **ES Modules** everywhere: `type: module` files loaded directly by MV3.
- **UI without React**: use **native Web Components + Shadow DOM** for the popup, options, overlay, and any in-page widgets. Plain CSS with CSS variables.
    - Small helper utilities (own code) for templating and state rather than external libs.
- **Audio capture/mixing**: use an **offscreen document** to mix tab audio + mic via WebAudio + MediaRecorder (Opus/webm), coordinated by the service worker.
- **Content scripts**: inject a lightweight overlay into meeting pages (Google Meet/Zoom/Teams) using a single custom element mounted in Shadow DOM.
- **State & storage**: ephemeral session state in the service worker; persistent prefs and lesson refs in `chrome.storage.local/sync`.
- **Networking**: native `fetch` with a tiny wrapper for auth headers and retry/backoff.
- **Permissions**: keep minimal (tabCapture, storage, tabs, offscreen; host_permissions for meeting domains and API host).

### Dev tooling (minimal)
- **npm scripts** running `tsc --noEmit false --watch` for development and `tsc --pretty false` for build.
- **ESLint + Prettier** (optional but recommended) with TS support.
- **Manual reload** during dev (Chrome extensions page → Reload). Optional future: add a tiny dev reloader script or use an external reloader extension.

### Directory layout (proposed)
- `manifest.json` — MV3 manifest
- `src/` — TypeScript sources
    - `background/` — service worker entry and message routing
    - `offscreen/` — offscreen page + audio pipeline
    - `content/` — meeting overlay component and page integration
    - `popup/` — popup UI web component
    - `options/` — options page web component
    - `lib/` — small utilities (dom, messaging, storage, fetch)
- `public/` — html/css/icons (copied as-is)
- `dist/` — compiled JS + copied assets (output)

### Why not React/bundlers now
- MV3 CSP disallows remote code and complicates typical React tooling; bundlers add setup and reload friction.
- Web Components + TS provide custom elements, encapsulation, and composition with near-zero overhead.
- We can revisit React/Preact later if complexity grows; for MVP, lean code wins.

### Summary of benefits
- Fast, debuggable, and easy to reason about.
- Zero-dependency runtime UI (browser-native), fewer supply-chain risks.
- Straight path to audio capture/transcription MVP without wrestling with build tooling.

## Design Documentation