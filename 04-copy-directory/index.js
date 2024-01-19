const fs = require('node:fs');
const path = require('path');
const { mkdir, readdir, rm } = require('node:fs/promises');

function callback(err) {
  if (err) throw err;
}

const folder = path.join(__dirname, 'files');
const folderCopy = path.join(__dirname, 'files-copy');

(async function () {
  await mkdir(folderCopy, { recursive: true });
  const oldFiles = await readdir(folderCopy);
  for (const file of oldFiles) {
    await rm(path.join(__dirname, 'files-copy', file));
  }
  fs.readdir(folder, { withFileTypes: true }, (err, files) => {
    for (const file of files) {
      fs.copyFile(
        path.join(folder, file.name),
        path.join(folderCopy, file.name),
        callback,
      );
    }
  });
})();
