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
  const cases = [];
  let numOfCases = reader.int();

  const sprites = [];
  let numOfSprites = reader.int();

  while (numOfSprites > 0) {
    let [width, height] = reader
      .line()
      .split(" ")
      .map((dim) => parseInt(dim, 10));
    const bitmask = reader
      .lines(height)
      .map((row) => row.split("").slice(0, width));
    sprites.push({ width, height, bitmask });
    numOfSprites--;
  }

  while (numOfCases > 0) {
    const numOfLayers = reader.int();
    const layers = reader.lines(numOfLayers).map((l) => {
      const [spriteIndex, xOffset, yOffset] = l
        .split(" ")
        .map((v) => parseInt(v, 10));
      return {
        sprite: sprites[spriteIndex],
        xOffset,
        yOffset,
      };
    });
    cases.push(layers);
    numOfCases--;
  }

  return cases;
}

function getPos(l, [x, y]) {
  return l.sprite.bitmask[y - l.yOffset][x - l.xOffset];
}

function getIntersection(l1, l2) {
  if (l2.xOffset >= l1.xOffset && l2.xOffset <= l1.xOffset + l1.sprite.width) {
    if (
      l2.yOffset <= l1.yOffset + l1.sprite.height &&
      l2.yOffset + l2.sprite.height >= l1.yOffset
    ) {
      return [
        [l2.xOffset, Math.max(l1.yOffset, l2.yOffset)],
        [
          Math.min(l1.xOffset + l1.sprite.width, l2.xOffset + l2.sprite.width),
          Math.min(
            l2.yOffset + l2.sprite.height,
            l1.yOffset + l1.sprite.height
          ),
        ],
      ];
    }
  }
}

function detectCollision(l1, l2) {
  const intersection = getIntersection(l1, l2) || getIntersection(l2, l1);
  if (intersection) {
    const [from, to] = intersection;
    for (let i = from[0]; i < to[0]; i++) {
      for (let j = from[1]; j < to[1]; j++) {
        if (getPos(l1, [i, j]) & getPos(l2, [i, j])) {
          return 1;
        }
      }
    }
  }
  return 0;
}

function solveCase(layers) {
  let numCollisions = 0;
  for (let i = 0; i < layers.length - 1; i++) {
    const l1 = layers[i];
    for (let j = i + 1; j < layers.length; j++) {
      const l2 = layers[j];
      numCollisions += detectCollision(l1, l2);
    }
  }
  return numCollisions;
}

readCases("input.txt").forEach((layers, i) => {
  console.log(`Case #${i + 1}: ${solveCase(layers)}`);
});
