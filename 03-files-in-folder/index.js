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
          if (file.isFile()) {
            const parsed = path.parse(path.join(file.path, file.name));
            console.log(
              `${parsed.name} - ${parsed.ext.slice(1)} - ${(
                stats.size / 1024
              ).toFixed(3)}KiB`,
            );
          }
        });
      });
    },
  );
})();
