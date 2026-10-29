import fs from 'node:fs';
import path from 'node:path';
import prettier from 'prettier';

const CSS_URL = 'https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400&display=swap';
const OUTPUT = path.resolve(import.meta.dirname, 'cjkSlices.json');

// Google Fonts only returns unicode-range slices to a browser it knows supports woff2
const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36';

const response = await fetch(CSS_URL, { headers: { 'User-Agent': USER_AGENT } });
const css = await response.text();

const faces = [...css.matchAll(/@font-face {([^}]*)}/g)].map(([, body]) => ({
  order: Number(body.match(/\.(\d+)\.woff2\)/)?.[1] ?? -1),
  ranges: body.match(/unicode-range: ([^;]+);/)[1].split(', '),
}));

// numbered slices are ordered by character frequency, the highest number holds the most common
const slices = faces
  .sort((a, b) => b.order - a.order)
  .map(({ ranges }) => ranges.map((range) => range.replace('U+', '')));

const options = await prettier.resolveConfig(OUTPUT);
fs.writeFileSync(OUTPUT, await prettier.format(JSON.stringify(slices), { ...options, parser: 'json' }));
console.log(`✂️ ${slices.length} slices → ${path.relative(process.cwd(), OUTPUT)}`);
