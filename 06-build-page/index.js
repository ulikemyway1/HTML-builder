const fsP = require('fs/promises');
const path = require('path');

const inputDirectory = path.resolve(__dirname, 'project-dist', 'assets');
const outputDirectory = path.resolve(__dirname, 'assets');

function copy(src, dist) {
  fsP.mkdir(dist, { recursive: true }).then(
    fsP.readdir(src, { withFileTypes: true }).then((obj) => {
      obj.forEach((item) => {
        if (item.isDirectory()) {
          const newSrc = path.resolve(item.path, item.name);
          const newDist = newSrc.replace('assets', 'project-dist\\assets');
          copy(newSrc, newDist);
        } else {
          fsP.copyFile(
            path.resolve(item.path, item.name),
            path.resolve(dist, item.name),
          );
        }
      });
    }),
  );
}

async function copyAssets() {
  await fsP.mkdir(path.resolve(__dirname, 'project-dist', 'assets'), {
    recursive: true,
  });
  await fsP.rm(inputDirectory, { recursive: true, force: true });
  copy(outputDirectory, inputDirectory);
}

copyAssets();

const styleDist = path.resolve(__dirname, 'project-dist', 'style.css');
const styleSrc = path.resolve(__dirname, 'styles');

async function merge() {
  await fsP.rm(styleDist, { force: true }).then(
    fsP.readdir(styleSrc, { withFileTypes: true }).then((arr) => {
      doInOrder(arr);
    }),
  );
}

async function doInOrder(arr) {
  for (let i = 0; i < arr.length; i += 1) {
    if (arr[i].isFile() && path.extname(arr[i].name) === '.css') {
      await fsP
        .readFile(path.resolve(arr[i].path, arr[i].name), 'utf-8')
        .then((data) => fsP.appendFile(styleDist, data))
        .then(fsP.appendFile(styleDist, '\n'));
    }
  }
}

merge();

async function createIndex() {
  let indexFile = await fsP.readFile(
    path.resolve(__dirname, 'template.html'),
    'utf-8',
  );
  const templates = await fsP.readdir(path.resolve(__dirname, 'components'), {
    withFileTypes: true,
  });
  for (let i = 0; i < templates.length; i += 1) {
    if (path.extname(templates[i].name) === '.html' && templates[i].isFile()) {
      if (indexFile.includes(`{{${templates[i].name.split('.')[0]}}}`)) {
        await fsP
          .readFile(path.resolve(templates[i].path, templates[i].name), 'utf-8')
          .then((data) => {
            indexFile = indexFile.replace(
              `{{${templates[i].name.split('.')[0]}}}`,
              data,
            );
          });
      }
    }
  }
  return indexFile;
}

async function moveToDist() {
  const indexHTML = await createIndex();
  fsP.writeFile(
    path.resolve(__dirname, 'project-dist', 'index.html'),
    indexHTML,
  );
}

moveToDist();
