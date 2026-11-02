import type { Country } from './timezoneCountry';

export type SceneKey = 'sleep' | 'breakfast' | 'work' | 'lunch' | 'afternoon' | 'dinner' | 'relax';

/** Start hour (inclusive) of each scene, in local time; each runs until the next one starts. */
export const sceneStarts: { scene: SceneKey; start: number }[] = [
  { scene: 'sleep', start: 0 },
  { scene: 'breakfast', start: 7 },
  { scene: 'work', start: 9 },
  { scene: 'lunch', start: 12 },
  { scene: 'afternoon', start: 13 },
  { scene: 'dinner', start: 18 },
  { scene: 'relax', start: 20 },
  { scene: 'sleep', start: 23 },
];

export function getSceneKey(hours: number): SceneKey {
  let current = sceneStarts[0].scene;
  for (const { scene, start } of sceneStarts) {
    if (hours >= start) current = scene;
  }
  return current;
}

/** Width / height of the scene illustrations (all are square). */
export const SCENE_ASPECT = 1;

/** Public files live under Vite's base path (the GitHub Pages subpath in production). */
const base = import.meta.env.BASE_URL;

export type SceneAsset = {
  src: string;
  focus?: string; // CSS object-position, keeps the cat in frame when cropped, e.g. '30% 65%'
};

export const scenes: Record<Country, Partial<Record<SceneKey, SceneAsset>> & { default: SceneAsset }> = {
  TW: {
    default: { src: `${base}scenes/tw/default.webp`, focus: '25% 65%' },
    sleep: { src: `${base}scenes/tw/sleep.webp`, focus: '40% 60%' },
    breakfast: { src: `${base}scenes/tw/breakfast.webp`, focus: '70% 70%' },
    work: { src: `${base}scenes/tw/work.webp`, focus: '55% 60%' },
    lunch: { src: `${base}scenes/tw/lunch.webp`, focus: '45% 60%' },
    afternoon: { src: `${base}scenes/tw/afternoon.webp`, focus: '25% 65%' },
    dinner: { src: `${base}scenes/tw/dinner.webp`, focus: '30% 72%' },
    relax: { src: `${base}scenes/tw/relax.webp`, focus: '65% 65%' },
  },
  DE: {
    default: { src: `${base}scenes/de/default.webp`, focus: '60% 60%' },
    sleep: { src: `${base}scenes/de/sleep.webp`, focus: '60% 65%' },
    breakfast: { src: `${base}scenes/de/breakfast.webp`, focus: '45% 65%' },
    work: { src: `${base}scenes/de/work.webp`, focus: '50% 75%' },
    lunch: { src: `${base}scenes/de/lunch.webp`, focus: '60% 70%' },
    afternoon: { src: `${base}scenes/de/afternoon.webp`, focus: '60% 60%' },
    dinner: { src: `${base}scenes/de/dinner.webp`, focus: '50% 80%' },
    relax: { src: `${base}scenes/de/relax.webp`, focus: '50% 70%' },
  },
};

/** The scene's image, or the country's default when that scene has none yet. */
export function getSceneAsset(country: Country, scene: SceneKey): SceneAsset {
  return scenes[country][scene] ?? scenes[country].default;
}
