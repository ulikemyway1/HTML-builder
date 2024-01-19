const fsP = require('fs/promises');
const path = require('path');

const inputDirectory = path.resolve(__dirname, 'files-copy');
const outputDirectory = path.resolve(__dirname, 'files');

function copy(src, dist) {
  fsP.mkdir(dist, { recursive: true }).then(
    fsP.readdir(src, { withFileTypes: true }).then((obj) => {
      obj.forEach((item) => {
        if (item.isDirectory()) {
          const newSrc = path.resolve(item.path, item.name);
          const newDist = newSrc.replace('files', 'files-copy');
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

async function run() {
  await fsP.rm(inputDirectory, { recursive: true, force: true });
  copy(outputDirectory, inputDirectory);
}

run();
