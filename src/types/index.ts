export type MemoryCategory = 'Childhood'|'Family'|'Love'|'Work'|'Turning Points'|'Traditions'|'Wisdom'|'Hopes'|'Historical Context';
export type MemoryEntry={id:string;category:MemoryCategory;prompt:string;response:string;yearOrEra?:string;tags:string[];notes?:string;createdAt:string;updatedAt:string};
export type Capsule={id:string;title:string;authorName:string;birthYear?:string;createdFor:string;description?:string;profileImage?:string;entries:MemoryEntry[];createdAt:string;updatedAt:string};
export type Insight={id:string;type:string;title:string;content:string;createdAt:string};
export type ChatResponse={text:string;citedIds:string[]};
