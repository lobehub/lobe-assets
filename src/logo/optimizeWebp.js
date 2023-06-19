const sharp = require('sharp');
const fs = require('node:fs');
const path = require('node:path');

const optimizeWebp = (icons, size = 480) => {
  for (const icon of icons) {
    const image = sharp(fs.readFileSync(path.resolve(__dirname, '../assets', icon)));
    const newIconName = icon.replace(/\.(png|jpg|webp)$/, `.webp`);
    image
      .resize(size, size)
      .webp()
      .toFile(path.resolve(__dirname, '../../packages/logo/assets', newIconName));
    console.log(`✅ ${icon}`);
  }
};

module.exports = optimizeWebp;
