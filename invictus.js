const fs = require('fs');

function readCases(path) {
  return [fs.readFileSync(path).toString()];
}

function solveCase(text) {
  for(let i=0;i<text.length;i++) {
    console.log(text[i], text.charCodeAt(i));
  }
}

readCases("input.txt").forEach((text, i) => {
  console.log(`Case #${i + 1}: ${solveCase(text)}`);
});
