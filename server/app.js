const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { z } = require('zod');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '256kb' }));

const Entry = z.object({
  id: z.string(),
  category: z.string(),
  prompt: z.string(),
  response: z.string(),
  yearOrEra: z.string().optional(),
  tags: z.array(z.string()),
  notes: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string()
});

const Capsule = z.object({
  id: z.string(),
  title: z.string(),
  authorName: z.string(),
  birthYear: z.string().optional(),
  createdFor: z.string(),
  description: z.string().optional(),
  entries: z.array(Entry)
});

const Body = z.object({ capsule: Capsule });

const model = () => {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  return new GoogleGenerativeAI(key).getGenerativeModel({ model: 'gemini-2.5-flash' });
};

const context = (c) => c.entries.map(e => `MEMORY ID: ${e.id}\nCATEGORY: ${e.category}\nPROMPT: ${e.prompt}\nRESPONSE: ${e.response}\nERA: ${e.yearOrEra || 'not provided'}\nTAGS: ${e.tags.join(', ')}`).join('\n\n');

const jsonReply = (res, data, status = 200) => res.status(status).json(data);

app.get('/api/health', (_req, res) => jsonReply(res, { ok: true, service: 'soth-link-ai' }));

app.post('/api/chat', async (req, res) => {
  try {
    const p = Body.extend({
      message: z.string().min(1).max(3000),
      history: z.array(z.object({ role: z.string(), content: z.string() })).max(20).default([])
    }).parse(req.body);

    const prompt = `You are Soth Link AI, a careful digital legacy archivist. Answer the user's question using ONLY the supplied capsule memories. Never invent facts, dates, motives, relationships, quotes, or historical context. If the answer is absent, say clearly that the record does not contain that information. Return ONLY JSON with keys text and citedIds, where citedIds contains only exact MEMORY IDs that support the answer.\nCAPSULE: ${p.capsule.title} — ${p.capsule.authorName}\nRECORD:\n${context(p.capsule)}\nQUESTION: ${p.message}`;

    const m = model();
    if (!m) return jsonReply(res, { text: 'The AI service is not configured. I can still help you read and organize the memories saved in this capsule.', citedIds: [] });

    const r = await m.generateContent(prompt);
    const raw = r.response.text().replace(/```json|```/g, '').trim();
    let data;
    try { data = JSON.parse(raw); } catch { data = { text: raw, citedIds: [] }; }
    return jsonReply(res, data);
  } catch (e) {
    return jsonReply(res, { error: e instanceof z.ZodError ? 'Please provide a valid capsule and question.' : 'The legacy chat could not respond right now.' }, 400);
  }
});

app.post('/api/generate-interview-question', async (req, res) => {
  try {
    const p = Body.extend({ category: z.string() }).parse(req.body);
    const m = model();
    if (!m) return jsonReply(res, { question: `What is one memory in ${p.category.toLowerCase()} that you would want a future reader to understand?` });
    
    const r = await m.generateContent(`Generate ONE warm, open-ended interview question for a digital legacy archive. It must be grounded only in the existing record below and the category. Do not assume missing facts. Do not mention AI. Return plain text only. CATEGORY: ${p.category}\nRECORD:\n${context(p.capsule)}`);
    return jsonReply(res, { question: r.response.text().trim() });
  } catch {
    return jsonReply(res, { error: 'Could not generate a question.' }, 400);
  }
});

app.post('/api/suggest-prompts', async (req, res) => {
  try {
    const p = Body.extend({ category: z.string() }).parse(req.body);
    const m = model();
    if (!m) return jsonReply(res, { prompts: [] });
    
    const r = await m.generateContent(`Return a JSON array of 3 thoughtful memory prompts for category ${p.category}. Use only themes visible in the record; never invent facts. RECORD:\n${context(p.capsule)}`);
    const raw = r.response.text().replace(/```json|```/g, '').trim();
    return jsonReply(res, { prompts: JSON.parse(raw) });
  } catch {
    return jsonReply(res, { error: 'Could not suggest prompts.' }, 400);
  }
});

app.post('/api/summarize-capsule', async (req, res) => {
  try {
    const p = Body.extend({ tone: z.string().default('Heartfelt') }).parse(req.body);
    const m = model();
    if (!m) return jsonReply(res, { letter: `Dear future reader,\n\nThis letter could not be generated because the AI service is not configured yet. The memories in this capsule remain available for you to read.` });
    
    const r = await m.generateContent(`Write a beautiful, concise first-person legacy letter from ${p.capsule.authorName} to ${p.capsule.createdFor}. Tone: ${p.tone}. Use ONLY the recorded memories below. Never invent personal facts. Do not claim the person literally wrote it; it is an AI-generated keepsake based on the archive. Markdown is allowed. RECORD:\n${context(p.capsule)}`);
    return jsonReply(res, { letter: r.response.text().trim() });
  } catch {
    return jsonReply(res, { error: 'Could not generate the legacy letter.' }, 400);
  }
});

app.post('/api/agents/analyze-all', async (req, res) => {
  try {
    const p = Body.parse(req.body);
    const m = model();
    if (!m) return jsonReply(res, { insights: [{ type: 'Wisdom themes', title: 'A record worth growing', content: 'Add a few more memories to reveal recurring values and themes.' }] });
    
    const r = await m.generateContent(`Analyze this digital legacy archive. Return ONLY JSON: {"insights":[{"type":"string","title":"string","content":"string"}]} with 5 concise cards covering wisdom themes, turning points, emotional patterns, relationship/cultural values, and timeline/topic summary. Use ONLY recorded entries; do not invent facts. RECORD:\n${context(p.capsule)}`);
    const raw = r.response.text().replace(/```json|```/g, '').trim();
    return jsonReply(res, JSON.parse(raw));
  } catch {
    return jsonReply(res, { error: 'Could not analyze this capsule right now.' }, 400);
  }
});

for (const [path, type, title] of [
  ['/api/agents/wisdom', 'wisdom', 'Wisdom'],
  ['/api/agents/story', 'story', 'Story'],
  ['/api/agents/impact', 'impact', 'Impact'],
  ['/api/agents/timeline', 'timeline', 'Timeline'],
  ['/api/agents/topic', 'topic', 'Topic'],
  ['/api/agents/letter', 'letter', 'Letter']
]) {
  app.post(path, async (req, res) => {
    req.body = req.body || {};
    return jsonReply(res, { type, title, content: 'Use /api/agents/analyze-all for the combined grounded analysis.' });
  });
}

app.use((err, _req, res, _next) => {
  console.error('request error', err instanceof Error ? err.message : 'unknown');
  jsonReply(res, { error: 'Unexpected server error.' }, 500);
});

console.log("Server app loaded successfully");
module.exports = app;
