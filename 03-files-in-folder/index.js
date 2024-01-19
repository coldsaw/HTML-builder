const path = require('path');
const fs = require('fs');

const secretPath = path.join(__dirname, '/secret-folder');

(async function () {
  await fs.readdir(
    secretPath,
    { encoding: 'utf-8', withFileTypes: true },
    (err, files) => {
      if (err) console.log(err);
      files.forEach((file) => {
        fs.stat(path.join(secretPath, file.name), (err, stats) => {
          const fileArr = file.name.split('.');
          if (!stats.isDirectory()) {
            console.log(`${fileArr[0]} - ${fileArr[1]} - ${stats.size}kb`);
          }
        });
      });
    },
  );
})();
