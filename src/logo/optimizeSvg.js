const { optimize } = require('svgo');
const fs = require('node:fs');
const path = require('node:path');

const config = {
  cleanupAttrs: true,
  cleanupEnableBackground: true,
  cleanupIDs: true,
  cleanupNumericValues: true,
  collapseGroups: true,
  convertColors: true,
  convertPathData: true,
  convertShapeToPath: true,
  convertStyleToAttrs: true,
  convertTransform: true,
  mergePaths: true,
  moveElemsAttrsToGroup: true,
  moveGroupAttrsToElems: true,
  multipass: true,
  removeComments: true,
  removeDesc: true,
  removeDimensions: true,
  removeDoctype: true,
  removeEditorsNSData: true,
  removeEmptyAttrs: true,
  removeEmptyContainers: true,
  removeEmptyText: true,
  removeHiddenElems: true,
  removeMetadata: true,
  removeNonInheritableGroupAttrs: true,
  removeRasterImages: false,
  removeTitle: true,
  removeUnknownsAndDefaults: true,
  removeUnusedNS: true,
  removeUselessDefs: true,
  removeUselessStrokeAndFill: false,
  removeViewBox: false,
  removeXMLProcInst: true,
  sortAttrs: true,
};

const optimizeSvg = (icons) => {
  for (const icon of icons) {
    const iconSvg = fs.readFileSync(path.resolve(__dirname, '../assets', icon));
    const result = optimize(iconSvg, config);
    fs.writeFileSync(path.resolve(__dirname, '../../packages/logo/assets', icon), result.data);
    console.log(`✅ ${icon}`);
  }
};

module.exports = optimizeSvg;
