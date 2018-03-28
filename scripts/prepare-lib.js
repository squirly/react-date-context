#!/usr/bin/env node

const path = require('path');
const fs = require('fs');

const rootPath = path.resolve(__dirname, '..');
const libPath = path.join(rootPath, 'lib');

const package = require(path.join(rootPath, 'package.json'));

delete package.scripts;
delete package.optionalDependencies;
delete package.devDependencies;
delete package.jest;

package.main = './index.js';

fs.writeFile(
  path.join(libPath, 'package.json'),
  JSON.stringify(package),
  err => {
    if (err) {
      throw err;
    }
    console.log(`Wrote package.json`);
  },
);

copy('README.md');
copy('LICENSE');

function copy(name) {
  fs.copyFile(path.join(rootPath, name), path.join(libPath, name), err => {
    if (err) {
      throw err;
    }
    console.log(`Copied ${name}`);
  });
}
