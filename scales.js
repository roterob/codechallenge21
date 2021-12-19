const fs = require('fs');

const notes = [["A"], ["A#", "Bb"],["B"],["C", "B#"],["C#","Db"],["D"],[ "D#","Eb" ],["E"],["F", "E#"],["F#","Gb"],["G"], ["G#","Ab"]];
const notesIndex = {
  "A": 0,
  "A#": 1,
  "Bb": 1,
  "B": 2,
  "C": 3,
  "C#": 4,
  "Db": 4,
  "D": 5,
  "D#": 6,
  "Eb": 6,
  "E": 7,
  "F": 8,
  "F#": 9,
  "Gb": 9,
  "G": 10,
  "G#": 11,
  "Ab": 11,
}

function readCases(path) {
  const lines = fs.readFileSync(path).toString().split("\n");
  const cases = [];
  let numOfCases = parseInt(lines[0], 10);
  let linePointer = 1;

  while(numOfCases > 0) {
    const root = lines[linePointer];
    linePointer++;

    const scale = lines[linePointer];
    linePointer++;

    cases.push([root, scale]);
    numOfCases--;
  }
  return cases;
}

function solveCase(index, scale, scaleNotes) {
  const posibilities = notes[index];
  let res = null;
  for(const note of posibilities) {
    const naturalNote = note[0];
    const closeScale = (!scale && scaleNotes.startsWith(note));
    if (!scaleNotes.includes(naturalNote) || closeScale) {
      res = scaleNotes + note;
      if (scale) {
        const jump = scale[0];
        const jumpSize = jump === "T" ? 2 : 1;
        const nextIndex = (index + jumpSize) % 12; 
        res = solveCase(nextIndex, scale.substring(1), res);
        if (res) {
          break;
        }
      }
    }
  }
  return res;
}

readCases("input.txt").forEach(([root, scale], i) => {
  console.log(`Case #${i + 1}: ${solveCase(notesIndex[root], scale, "")}`);
});
