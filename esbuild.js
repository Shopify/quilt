const {resolve} = require('path');
const {buildSync} = require('esbuild');
const {sync} = require('glob');

const packageSource = resolve(__dirname, 'packages', 'address', 'src');

const outputDir = resolve(__dirname, 'packages', 'address', 'build');

const files = sync(resolve(packageSource, '**', '*.ts')).filter(
  file => !file.includes('.test.'),
);

console.log('files', files);

files.forEach(file => {
  const result = buildSync({
    entryPoints: [file],
    outdir: resolve(outputDir, 'cjs'),
    format: 'cjs',
    // write: false,
  });

  console.log(result);
});
