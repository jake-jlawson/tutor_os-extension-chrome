🛠 TutorOS — MVP Description

The MVP focuses narrowly on recording, transcribing, and storing lessons, so that tutors no longer need to write reports manually.

Flow for MVP:

A tutor goes to app.opentutor.io and fills in a simple form with the student’s name and a meeting link.

Submitting the form generates a unique lesson ID and an “associate link” that opens both the meeting and a lesson manager page.

The TutorOS browser extension attaches to the meeting tab, captures the audio (both tutor mic + meeting audio), and streams or uploads it to the backend.

The backend transcribes the lesson audio using an ASR engine (e.g., Whisper).

The transcript is saved and hosted at a simple URL (/lessons/{id}) where the tutor can review it and use it directly in reports.

The extension keeps a log of transcripts so tutors can revisit them later.

That’s all the MVP needs to do: click → record → automatic transcript available.

This base unlocks immediate value for the tutor (never writing reports from scratch again) while being structured in a way that makes it easy to add analytics, auto-report generation, and other TutorOS modules later.