const fs = require('fs');

function readCases(path) {
  const lines = fs.readFileSync(path).toString().split("\n");
  const cases = [];
  let numOfCases = parseInt(lines[0], 10);
  let linePointer = 1;

  while(numOfCases > 0) {
    let [numOfPokemons, rows, cols] = lines[linePointer].split(" ").map(n => parseInt(n, 10));

    const pokemons = [];
    linePointer++;
    while(numOfPokemons > 0) {
      const pokemonName = lines[linePointer].trim();
      pokemons.push([pokemonName, pokemonName.split("").reverse().join("")]);
      numOfPokemons--;
      linePointer++;
    }

    const map = [];
    while(rows>0) {
      map.push(lines[linePointer].replace(/\s+/g, ""));
      rows--;
      linePointer++;
    }
    
    cases.push([pokemons, map.join("")]);
    numOfCases--;
  }
  return cases;
}

function solveCase([pokemons, map]) {
  let currentMap = map;
  let finalMap = "";
  while(currentMap != finalMap) {
    finalMap = currentMap;
    pokemons.forEach(([name, reversedName]) => {
      currentMap = currentMap.replace(name, "").replace(reversedName, "");
    });
  }
  return finalMap;
}

readCases("pokemonSubmitInput.txt").forEach((c, i) => {
  console.log(`Case #${i + 1}: ${solveCase(c)}`);
});
