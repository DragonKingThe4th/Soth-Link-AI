import type {Capsule,ChatResponse,MemoryEntry} from '../types';
const call=async<T>(path:string,body:unknown):Promise<T>=>{const r=await fetch(path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}); const data=await r.json(); if(!r.ok)throw new Error(data.error||'Something went wrong.'); return data;};
export const chat=(capsule:Capsule,message:string,history:{role:string;content:string}[])=>call<ChatResponse>('/api/chat',{capsule,message,history});
export const interview=(capsule:Capsule,category:string)=>call<{question:string}>('/api/generate-interview-question',{capsule,category});
export const letter=(capsule:Capsule,tone:string)=>call<{letter:string}>('/api/summarize-capsule',{capsule,tone});
export const insights=(capsule:Capsule)=>call<{insights:{type:string;title:string;content:string}[]}>('/api/agents/analyze-all',{capsule});
export const suggest=(capsule:Capsule,category:string)=>call<{prompts:string[]}>('/api/suggest-prompts',{capsule,category});
export const formatMemories=(entries:MemoryEntry[])=>entries.map(e=>`[${e.id}] ${e.category} — ${e.prompt}\n${e.response}${e.yearOrEra?`\nEra: ${e.yearOrEra}`:''}${e.tags.length?`\nTags: ${e.tags.join(', ')}`:''}`).join('\n\n');
