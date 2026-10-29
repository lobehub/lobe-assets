import * as fontkit from 'fontkit';
import fs from 'node:fs';
import path from 'node:path';
import subsetFont from 'subset-font';

import slices from './cjkSlices.json' with { type: 'json' };

const SOURCE = path.resolve(import.meta.dirname, '../../packages/webfont-harmony-sans-sc/fonts');
const PACKAGE = path.resolve(import.meta.dirname, '../../packages/webfont-harmony-sans-sc-mini');
const FAMILY = 'HarmonyOS Sans SC';
const REMAINDER_SLICE_SIZE = 250;

const WEIGHTS = [
  { file: 'Thin', full: true, weight: 100 },
  { file: 'Light', weight: 300 },
  { file: 'Regular', weight: 'normal' },
  { file: 'Medium', weight: 500 },
  { file: 'Bold', weight: 'bold' },
  { file: 'Black', full: true, weight: 900 },
];

const parseRange = (range) => {
  const [start, end = start] = range.split('-').map((hex) => Number.parseInt(hex, 16));
  return [start, end];
};

const sliceCodePoints = (codePoints) => {
  const remaining = new Set(codePoints);
  const result = slices.map((ranges) => {
    const slice = [];
    for (const [start, end] of ranges.map(parseRange)) {
      for (let cp = start; cp <= end; cp++) {
        if (remaining.delete(cp)) slice.push(cp);
      }
    }
    return slice;
  });

  const rest = [...remaining].sort((a, b) => a - b);
  for (let i = 0; i < rest.length; i += REMAINDER_SLICE_SIZE) {
    result.push(rest.slice(i, i + REMAINDER_SLICE_SIZE));
  }

  return result.filter((slice) => slice.length > 0);
};

const toUnicodeRange = (codePoints) => {
  const sorted = [...codePoints].sort((a, b) => a - b);
  const ranges = [];
  for (const cp of sorted) {
    const last = ranges.at(-1);
    if (last && cp === last[1] + 1) last[1] = cp;
    else ranges.push([cp, cp]);
  }
  return ranges
    .map(([start, end]) =>
      start === end ? `U+${start.toString(16)}` : `U+${start.toString(16)}-${end.toString(16)}`,
    )
    .join(', ');
};

const fontFace = ({ font, fileName, unicodeRange, weight }) => `@font-face {
  font-family: '${FAMILY}';
  src: url('../fonts/${fileName}') format('woff2');
  font-weight: ${weight};
  font-style: normal;
  font-display: swap;
  unicode-range: ${unicodeRange};
}
`;

const fontsDir = path.join(PACKAGE, 'fonts');
fs.rmSync(fontsDir, { force: true, recursive: true });
fs.mkdirSync(fontsDir, { recursive: true });

const faces = [];

for (const { file, full, weight } of WEIGHTS) {
  const source = fs.readFileSync(path.join(SOURCE, `HarmonyOS_Sans_SC_${file}.woff2`));
  const font = fontkit.create(source);
  const sliced = sliceCodePoints(font.characterSet);

  console.log(`📦 ${file}: ${font.characterSet.length} chars → ${sliced.length} slices`);

  for (const [index, codePoints] of sliced.entries()) {
    const fileName = `HarmonyOS_Sans_SC_${file}_${index + 1}.woff2`;
    const text = String.fromCodePoint(...codePoints);
    const buffer = await subsetFont(source, text, { targetFormat: 'woff2' });
    fs.writeFileSync(path.join(fontsDir, fileName), buffer);

    faces.push({
      css: fontFace({ fileName, font, unicodeRange: toUnicodeRange(codePoints), weight }),
      full,
    });
  }
}

const header = '@charset "UTF-8";\n\n';
fs.writeFileSync(
  path.join(PACKAGE, 'css/index.css'),
  header +
    faces
      .filter(({ full }) => !full)
      .map(({ css }) => css)
      .join('\n'),
);
fs.writeFileSync(
  path.join(PACKAGE, 'css/index-full.css'),
  header + faces.map(({ css }) => css).join('\n'),
);
