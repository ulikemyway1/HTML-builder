const fsP = require('fs/promises');
const path = require('path');
const fs = require('fs');

fsP
  .readdir(path.resolve(__dirname, 'secret-folder'), { withFileTypes: true })
  .then((obj) =>
    obj.forEach((item) => {
      if (item.isFile()) {
        const fileInfo = [];
        fileInfo.push(item.name.split('.')[0]);
        fileInfo.push(path.extname(item.name).slice(1));
        fs.stat(path.resolve(item.path, item.name), (__, stats) => {
          fileInfo.push(`${(stats.size / 1024).toPrecision(5)}kb`);
          console.log(fileInfo.join(' - '));
        });
      }
    }),
  );
