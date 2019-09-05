const {resolve, basename} = require('path');
const {renameSync} = require('fs');
const glob = require('glob');

const packages = glob.sync(resolve(__dirname, 'packages/*'));
packages.forEach(path => {
  console.log(`{"path": "./${basename(path)}"},`);
});

const tsconfigBuild = glob.sync(
  resolve(__dirname, 'packages/*/tsconfig.build.json'),
);
// console.log('tsconfigBuild: ', tsconfigBuild);
// tsconfigBuild.forEach(file => {
//   console.log('\n\nRenaming file: ', file);
//   renameSync(file, file.replace('tsconfig.build.json', 'tsconfig.json'));
// });
