const fs = require("fs");

function readFile(path) {
  const content = fs.readFileSync(path).toString().split("\n");
  let linePointer = 0;

  function lines(numOfLines) {
    const res = content.slice(linePointer, linePointer + numOfLines);
    linePointer += numOfLines;
    return res;
  }

  function line() {
    return lines(1)[0];
  }

  function int() {
    return parseInt(line(), 10);
  }

  return { line, lines, int };
}

function readCases(path) {
  const reader = readFile(path);
  let numOfCases = reader.int();
  const cases = [];
  while (numOfCases > 0) {
    const [numOfFunctions, functionsPerFile] = reader
      .line()
      .split(" ")
      .map((v) => parseInt(v, 10));
    cases.push({
      functionsPerFile,
      names: reader.lines(numOfFunctions),
    });
    numOfCases--;
  }
  return cases;
}

function solveCase(functionsPerFile, functionNames, score = 50) {
  if (score == 0) {
    return 0;
  }

  const groups = {};
  function addGroup(prefix, functionName) {
    const functionGroup = groups[prefix] || [];
    functionGroup.push(functionName);
    groups[prefix] = functionGroup;
  }

  functionNames.forEach((name) => {
    if (name.length >= score) {
      const prefix = name.substring(0, score);
      addGroup(prefix, name);
    }
  });

  let sum = 0;
  let restOfNames = functionNames;

  const groupOfFunctions = Object.values(groups);
  for (const functions of groupOfFunctions) {
    if (functions.length >= functionsPerFile) {
      for (let i = 0; i <= functions.length; ) {
        const names = functions.slice(i, i + functionsPerFile);
        if (names.length == functionsPerFile) {
          sum += score;
          restOfNames = restOfNames.filter((name) => !names.includes(name));
        }
        i = i + functionsPerFile;
      }
    }
  }

  return sum + solveCase(functionsPerFile, restOfNames, score - 1);
}

readCases("input.txt").forEach(({ functionsPerFile, names }, i) => {
  debugger;
  console.log(
    `Case #${i + 1}: ${solveCase(functionsPerFile, names)}, ${
      names.length / functionsPerFile
    }`
  );
});
