const Fontmin = require('fontmin');
const path = require('node:path');

const optimizeFont = async (fonts) => {
  for (const font of fonts) {
    const fontmin = new Fontmin()
      .src(path.resolve(__dirname, '../assets', font, '*.ttf'))
      .dest(`webfonts/fonts/${font}`);

    console.log(`📦 ${font}`);

    await fontmin.run((error) => {
      if (error) throw error;
    });
  }
};

module.exports = optimizeFont;
