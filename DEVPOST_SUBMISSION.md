# Soth Link AI — Devpost Submission

## Project name
**Soth Link AI**

## Tagline
**Every life holds a story worth keeping.**

## Problem
Personal and collective history can disappear when the people who carry it are no longer available to tell it. Notes, conversations, traditions, advice, and context often lack a structure that makes them useful to future family members and researchers.

## Solution
Soth Link AI turns memory preservation into a calm digital ritual. A user creates a time capsule, records memories in their own words, and can then ask grounded AI questions about the archive, discover recurring themes, and generate a keepsake letter.

## Key features
- Time capsule dashboard
- Guided memory capture
- Guided AI interview
- Memory-grounded legacy chat with cited entries
- AI insights across wisdom, turning points, relationships, values, and timeline/topic patterns
- Legacy letter generator
- Markdown export and print-friendly reading
- Local-first browser persistence

## How Gemini AI is used
Gemini runs exclusively on the Express backend. The frontend sends the capsule context and a user request to relative `/api/*` routes. Prompts explicitly instruct the model to use only recorded memories, avoid invented personal or historical facts, and identify when the record is insufficient. Chat responses return cited memory IDs so the UI can point readers back to source entries.

## Technical implementation
React, TypeScript, Vite, Tailwind CSS, Express, Zod validation, Google Gemini API, localStorage, and Vercel-compatible routing. The Gemini API key is read from `GEMINI_API_KEY` on the server and is never exposed through client-side environment variables.

## Impact
Soth Link AI is designed around preservation rather than productivity. Its goal is to make it easier for ordinary people to leave behind context, not just data: the small rituals, values, turning points, and lessons that make a life understandable to someone who comes later.

## Challenges
- Keeping AI grounded in incomplete personal records
- Designing an emotionally warm interface without becoming decorative or distracting
- Making the first version useful without requiring a cloud account or database
- Returning graceful fallbacks when AI is unavailable

## Future roadmap
- Encrypted cloud sync with explicit consent
- Family roles and controlled sharing
- Audio/video memory capture with transcription
- Source provenance and archive citations for researchers
- Import tools for letters, photographs, and existing family archives
- Versioned exports and archival formats
- Consent, retention, and deletion controls for collaborative family archives

## URLs
- Live demo: `https://YOUR-VERCEL-URL.vercel.app`
- GitHub: `https://github.com/YOUR-USERNAME/soth-link-ai`
- Video: `https://YOUR-VIDEO-URL`
