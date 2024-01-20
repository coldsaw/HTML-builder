const fs = require('fs');
const path = require('path');

const source = path.join(__dirname, 'styles');
const destination = path.join(__dirname, 'project-dist');

const output = fs.createWriteStream(
  path.join(destination, 'bundle.css'),
  'utf-8',
);

(async () => {
  fs.readdir(source, { withFileTypes: true }, (err, files) => {
    if (err) throw err;
    for (const file of files) {
      if (
        !file.isDirectory() &&
        file.name.split('.')[file.name.split('.').length - 1] === 'css'
      ) {
        const stream = fs.createReadStream(path.join(file.path, file.name), {
          encoding: 'utf-8',
        });
        stream.on('data', (chunk) => output.write(chunk + '\n'));
      }
    }
  });
})();
