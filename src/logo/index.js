const optimizeSvg = require('./optimizeSvg');
const optimizeWebp = require('./optimizeWebp');

const svgList = ['logo-flat.svg', 'logo-high-contrast.svg', 'logo-text.svg'];

const webpList = ['logo-3d.png'];

optimizeSvg(svgList);
optimizeWebp(webpList);
