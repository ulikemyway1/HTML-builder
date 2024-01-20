const fsP = require('fs/promises');
const path = require('path');

const dist = path.resolve(__dirname, 'project-dist', 'bundle.css');
const src = path.resolve(__dirname, 'styles');

async function merge() {
  await fsP.rm(dist, { force: true }).then(
    fsP.readdir(src, { withFileTypes: true }).then((arr) => {
      doInOrder(arr);
    }),
  );
}

async function doInOrder(arr) {
  for (let i = 0; i < arr.length; i += 1) {
    if (arr[i].isFile() && path.extname(arr[i].name) === '.css') {
      await fsP
        .readFile(path.resolve(arr[i].path, arr[i].name), 'utf-8')
        .then((data) => fsP.appendFile(dist, data + '\n'));
    }
  }
}

merge();
