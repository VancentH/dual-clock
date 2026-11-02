// Converts assets-src/{tw|de}-{scene}.{png,jpg,jpeg} into public/scenes/{tw|de}/{scene}.webp
// with the longest edge resized to 1600px.
import { mkdir, readdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const SRC_DIR = 'assets-src';
const OUT_DIR = 'public/scenes';
const MAX_EDGE = 1600;
const NAME_PATTERN = /^(tw|de)-([a-z]+)\.(png|jpe?g)$/i;

const files = await readdir(SRC_DIR);
let count = 0;

for (const file of files) {
  const match = file.match(NAME_PATTERN);
  if (!match) {
    console.warn(`skip: ${file} (expected {tw|de}-{scene}.png/jpg)`);
    continue;
  }
  const [, country, scene] = match;
  const outDir = path.join(OUT_DIR, country.toLowerCase());
  const outFile = path.join(outDir, `${scene.toLowerCase()}.webp`);
  await mkdir(outDir, { recursive: true });
  await sharp(path.join(SRC_DIR, file))
    .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(outFile);
  console.log(`${file} → ${outFile}`);
  count++;
}

console.log(`done: ${count} image(s)`);
