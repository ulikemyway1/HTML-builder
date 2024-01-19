const fsP = require('fs/promises');
const path = require('path');

fsP.mkdir(path.resolve(__dirname, 'files-copy'), { recursive: true }).then(
  fsP
    .readdir(path.resolve(__dirname, 'files'), { withFileTypes: true })
    .then((obj) => {
      obj.forEach((item) =>
        fsP.copyFile(
          path.resolve(item.path, item.name),
          path.resolve(__dirname, 'files-copy', item.name),
        ),
      );
    }),
);
