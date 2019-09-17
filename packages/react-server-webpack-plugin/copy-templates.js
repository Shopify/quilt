/* eslint-disable no-console, consistent-return */

const fs = require('fs-extra');
const glob = require('glob');

function copyFiles() {
  glob(
    './src/templates/*',
    {dot: true, ignore: ['dist/**/*', 'node_modules/**/*']},
    (globErr, files) => {
      if (globErr) return console.error(globErr);

      files.forEach(file => {
        const dest = file.replace('src', 'dist');
        fs.copy(file, dest, copyErr => {
          if (copyErr) {
            console.error(file, dest, copyErr);
          }
        });
      });
    },
  );

  console.log(`successfully copied template files`);
}

copyFiles();
