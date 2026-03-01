import { put } from '@vercel/blob';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const images = [
  { file: 'kurozu-subuta.png', key: 'kurozu-subuta' },
  { file: 'ebi-chili.png', key: 'ebi-chili' },
  { file: 'tantanmen.png', key: 'tantanmen' },
  { file: 'mapo-tofu.png', key: 'mapo-tofu' },
  { file: 'peking-duck.png', key: 'peking-duck' },
];

for (const { file, key } of images) {
  const filePath = join(__dirname, '../public/images', file);
  const data = readFileSync(filePath);
  const blob = await put(key + '.png', data, { access: 'public', contentType: 'image/png' });
  console.log(`${key}: ${blob.url}`);
}
