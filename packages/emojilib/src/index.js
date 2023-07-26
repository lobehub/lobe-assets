const emojilib = require('unicode-emoji-json');
const fs = require('node:fs');
const { resolve } = require('node:path');

const newEmojilib = {};
for (const [emoji, item] of Object.entries(emojilib)) {
  newEmojilib[emoji] = item.slug.replaceAll('_', '-');
}

fs.writeFileSync(resolve(__dirname, '..', 'index.json'), JSON.stringify(newEmojilib, null, 2));
