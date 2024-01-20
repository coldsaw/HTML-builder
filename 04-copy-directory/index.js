const fs = require('node:fs');
const path = require('path');
const { mkdir, readdir, rm } = require('node:fs/promises');

function callback(err) {
  if (err) throw err;
}

const Folder = path.join(__dirname, 'files');
const FolderCopy = path.join(__dirname, 'files-copy');

async function copyFolder(folder, folderCopy) {
  await mkdir(folderCopy, { recursive: true });
  const oldFiles = await readdir(folderCopy);
  for (const file of oldFiles) {
    await rm(path.join(__dirname, 'files-copy', file));
  }
  fs.readdir(folder, { withFileTypes: true }, (err, files) => {
    for (const file of files) {
      if (file.isFile()) {
        fs.copyFile(
          path.join(folder, file.name),
          path.join(folderCopy, file.name),
          callback,
        );
      }
      if (file.isDirectory()) {
        mkdir(path.join(folderCopy, file.name));
        copyFolder(
          path.join(folder, file.name),
          path.join(folderCopy, file.name),
        );
      }
    }
  });
}

copyFolder(Folder, FolderCopy);
