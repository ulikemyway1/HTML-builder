const fs = require('fs');
const path = require('path');
const readableStream = fs.createReadStream(path.resolve(__dirname, 'text.txt'), 'utf-8',);
let text = '';

readableStream.on('data', (chunk) => text += chunk);

readableStream.on('end', () => console.log(text));

readableStream.on('error', (error) => console.log("Sorry, can't find text.txt file in 01-read-file folder ====>", error.message));
