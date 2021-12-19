const fs = require('fs');

const DATE_REG = /(\d{2})-(\d{2})-(\d{4})/;
const LANGS = { CA: "CA", CZ: "CS", DE: "DE", DK: "DA", EN: "EN", ES: "ES", FI: "FI", FR: "FR", IS: "IS", GR: "EL", HU: "HU", IT: "IT", NL: "NL", VI: "VI", PL: "PL", RO: "RO", RU: "RU", SE: "SV", SI: "SL", SK: "SK" };
const FIXES = { marți: "marţi" };


function readCases(path) {
  const lines = fs.readFileSync(path).toString().split("\n");
  const cases = [];
  let numOfCases = parseInt(lines[0], 10);
  let linePointer = 1;

  while(numOfCases > 0) {
    cases.push(lines[linePointer].split(":"));
    linePointer++;
    numOfCases--;
  }
  return cases;
}

function solveCase(dateStr, lang) {
  const isoLang = LANGS[lang];
  if (!isoLang) {
    return "INVALID_LANGUAGE";
  }

  let fixedDate = dateStr;
  if (DATE_REG.test(dateStr)) {
    fixedDate = `${RegExp.$3}-${RegExp.$2}-${RegExp.$1}`;
  }

  let date = null;
  try {
    date = new Date(fixedDate); 
  } catch {}
  if (!date || isNaN(date.getTime()) || !fixedDate.endsWith(date.getDate().toString())) {
    return "INVALID_DATE";
  }

  const res = date.toLocaleDateString(isoLang, { weekday: 'long'}).toLocaleLowerCase();
  return FIXES[res] || res;
}

readCases("input.txt").forEach(([date, lang], i) => {
  console.log(`Case #${i + 1}: ${solveCase(date, lang)}`);
});

