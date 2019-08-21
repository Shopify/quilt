const {resolve} = require('path');
const glob = require('glob');

const packages = glob.sync(resolve(__dirname, 'packages/*'));
packages.forEach(path => {
  console.log(`{"path": "./${path}"}`);
});
