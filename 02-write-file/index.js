const path = require('path');
const fs = require('fs');
const input = process.stdin;
const textFile = fs.createWriteStream(path.resolve(__dirname, 'text.txt'), 'utf-8',);

input.on('data', (data) => {
  const stringData = data.toString();
  if (stringData.includes('exit') && stringData.length === 6) {
    process.exit();
  } else {
    textFile.write(data);
  }
});

textFile.on('open', () => console.log("Let's start! Type something!"));

process.on('SIGINT', () => process.exit());

process.on('exit', () => console.log("Okay... Let's finish!"));
