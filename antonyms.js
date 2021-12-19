const fs = require('fs');

const DICT_REGEX=/'(\w+)':\s*(\d+)(\/(\d+))?/g;
const TUPLE_REGEX=/'(\w+)',\s*(\d+)(\/(\d+))?/g;
const ASSIGN_REGEX=/(\w+)=(\d+)(\/(\d+))?/g;

function readCases(path) {
  const lines = fs.readFileSync(path).toString().split("\n");
  const cases = [];
  let numOfCases = parseInt(lines[0], 10);
  let linePointer = 1;

  while(numOfCases > 0) {
    const [pairs, weights] = lines[linePointer].split("|");
    const [word1, word2] = pairs.split("-");
    const weightsMap = {};
    [DICT_REGEX, TUPLE_REGEX, ASSIGN_REGEX].some(regex => {
      const matches = [...weights.matchAll(regex)];
      matches.forEach(m => {
        letter = m[1];
        num = parseInt(m[2] || "1", 0);
        den = parseInt(m[4] || "1", 0);

        weightsMap[letter] = num / den;
      });
      return matches.length>0;
    });

    cases.push([word1, word2, weightsMap]);
    linePointer++;
    numOfCases--;
  }
  return cases;
}

function solveCase([word1, word2, weights]) {
  const sum1 = word1.split("").reduce((acc, cur) => acc + weights[cur] , 0);
  const sum2 = word2.split("").reduce((acc, cur) => acc + weights[cur] , 0);
  if (sum1 > sum2) {
    return word1;
  } else if (sum1 < sum2) {
    return word2;
  } else {
    return "-";
  }
}

readCases("antonymsInput.txt").forEach((c, i) => {
  console.log(`Case #${i + 1}: ${solveCase(c)}`);
});
