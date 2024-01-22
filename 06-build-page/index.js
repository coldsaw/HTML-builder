const fs = require('fs');
const path = require('path');
const { mkdir, readFile, rm, writeFile } = require('node:fs/promises');

function callback(err) {
  if (err) throw err;
}

const projectDist = path.join(__dirname, 'project-dist');
fs.mkdir(projectDist, { recursive: true }, callback);

const components = path.join(__dirname, 'components');

async function readTemplateData(templatePath) {
  return await readFile(templatePath, { encoding: 'utf-8' });
}

(async function replaceTemplates() {
  const templates = [];
  const files = await fs.promises.readdir(components, { withFileTypes: true });

  for (const file of files) {
    if (
      file.isFile() &&
      file.name.slice(file.name.lastIndexOf('.') + 1) === 'html'
    ) {
      templates.push(file);
    }
  }

  let templateHtml = await fs.promises.readFile(
    path.join(__dirname, 'template.html'),
    { encoding: 'utf-8' },
  );

  for (const template of templates) {
    const templateData = await readTemplateData(
      path.join(components, template.name),
    );
    const placeholder = `{{${template.name.slice(
      0,
      template.name.lastIndexOf('.'),
    )}}}`;
    templateHtml = templateHtml.replace(placeholder, templateData);
  }

  await writeFile(path.join(projectDist, 'index.html'), templateHtml);
})();

async function copyFolder(folder, folderCopy) {
  await rm(folderCopy, { force: true, recursive: true });
  await mkdir(folderCopy, { recursive: true });
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
        mkdir(path.join(folderCopy, file.name), { recursive: true });
        copyFolder(
          path.join(folder, file.name),
          path.join(folderCopy, file.name),
        );
      }
    }
  });
}

const css = fs.createWriteStream(path.join(projectDist, 'style.css'), 'utf-8');

function mergeStyles() {
  fs.readdir(
    path.join(__dirname, 'styles'),
    { withFileTypes: true },
    (err, files) => {
      if (err) throw err;
      for (const file of files) {
        if (
          !file.isDirectory() &&
          file.name.split('.')[file.name.split('.').length - 1] === 'css'
        ) {
          const stream = fs.createReadStream(path.join(file.path, file.name), {
            encoding: 'utf-8',
          });
          stream.on('data', (chunk) => css.write(chunk + '\n'));
        }
      }
    },
  );
}

mergeStyles();

copyFolder(path.join(__dirname, 'assets'), path.join(projectDist, 'assets'));
