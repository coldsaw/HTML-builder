const fs = require('fs');
const path = require('path');
const process = require('node:process');

const { stdin, stdout } = process;
const text = fs.createWriteStream(path.join(__dirname, 'text.txt'));

function exitApp() {
  console.log('Good luck!');
  process.exit();
}

process.on('SIGINT', () => exitApp());

stdout.write('Type your text to write it to file:\n\n');
stdin.on('data', (data) => {
  const strData = data.toString();
  if (strData.trim().toLowerCase() !== 'exit') {
    text.write(strData);
  } else {
    exitApp();
  }
});
