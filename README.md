# Soth Link AI

> **Every life holds a story worth keeping.**

Soth Link AI is a local-first digital legacy preservation product for families, historians, researchers, and anyone who wants to preserve the stories, memories, values, traditions, and historical context of a person or community.

## Problem
Important personal history is often scattered across conversations, notebooks, photographs, and memory. Existing productivity tools are optimized for tasks and documents, not for preserving meaning across generations.

## Solution
Soth Link AI creates calm, structured time capsules. Users record memories in their own words, then use grounded Gemini features for gentle interview questions, memory-grounded chat, reflective insights, and keepsake letters.

## Features
- Local-first time capsule dashboard
- Guided memory capture with optional era and tags
- One-question-at-a-time AI interview
- Memory-grounded legacy chat with cited memory IDs
- AI reflection cards for themes and turning points
- First-person legacy letter generator with tone controls
- Markdown export and browser print view
- Responsive, keyboard-accessible, heirloom-inspired UI
- Express API with validation, payload limits, and server-only Gemini key

## Stack
React + TypeScript + Vite + Tailwind CSS, Node.js + Express, Google Gemini API, browser localStorage, Vercel-compatible API function.

## Local setup

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

Open `.env.local` and replace the placeholder with a newly created Gemini API key. The key is used by the local Express API only; do not commit `.env.local` or put the key in any frontend file.

The Vite client runs on `http://localhost:5173`. The Express API runs on `http://localhost:3001`.

For local Vite development, add this optional proxy to `vite.config.ts` if you want `/api/*` to reach Express on port 3001, or run the production build through Vercel. A simple development proxy can be configured as:

```ts
server: { port: 5173, proxy: { '/api': 'http://localhost:3001' } }
```

## Environment

`.env.example` contains:

```text
GEMINI_API_KEY="paste_your_gemini_api_key_here"
```

Never use `VITE_GEMINI_API_KEY` and never commit `.env.local`.

## Vercel deployment
1. Push this repository to GitHub.
2. Import the repository into Vercel.
3. Add `GEMINI_API_KEY` under Project Settings → Environment Variables.
4. Deploy.
5. Never commit `.env.local`.

`vercel.json` uses `npm run build` and `dist` as the output directory. `api/[...path].ts` exposes the Express app to Vercel.

## Data model
Capsules and memories are stored in the browser's localStorage in this version. There is no cloud database or account system. Do not claim cloud backup or multi-device sync for this build.

## Project structure

```text
soth-link-ai/
  src/
    components/
    pages/
    hooks/
    lib/
    services/
    types/
    data/
  api/[...path].ts
  server/app.ts
  public/
  README.md
  DEVPOST_SUBMISSION.md
  DEMO_SCRIPT.md
  LICENSE
  .env.example
  vercel.json
  package.json
```

## Links
- Live demo: `https://YOUR-VERCEL-URL.vercel.app`
- GitHub: `https://github.com/YOUR-USERNAME/soth-link-ai`
- Demo video: `https://YOUR-VIDEO-URL`

## License
MIT — see `LICENSE`.
# Soth-Link-AI
