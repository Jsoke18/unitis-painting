// First, create a new file: lib/kv.ts
import { kv } from '@vercel/kv';
import { HeroContent } from '@/app/types/hero';

const HERO_KEY = 'hero_content';

export async function getHeroFromKV(): Promise<HeroContent | null> {
  return await kv.get(HERO_KEY);
}

export async function setHeroInKV(content: HeroContent): Promise<void> {
  await kv.set(HERO_KEY, content);
}
