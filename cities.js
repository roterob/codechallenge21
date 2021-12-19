const fs = require('fs');

function readCases(path) {
  const lines = fs.readFileSync(path).toString().split("\n");
  const cases = [];
  let numOfCases = parseInt(lines[0], 10);
  let linePointer = 1;

  while(numOfCases > 0) {
    let numOfTickets = parseInt(lines[linePointer], 10);
    linePointer++;

    const tickets = [];
    while(numOfTickets > 0) {
      const ticket = lines[linePointer].split(",");
      tickets.push(ticket);

      numOfTickets--;
      linePointer++;
    }

    cases.push(tickets);
    numOfCases--;
  }
  return cases;
}

function getCriticalCitiesThatCannotBeRemoved(cities) {
  const critical = [];
  const accesibleFromCritical = [];
  Object.keys(cities).forEach(city => {
    const accesibleFrom = cities[city];
    if (accesibleFrom.length == 1) {
      critical.push(accesibleFrom[0]);
      accesibleFromCritical.push(city);
    }
  });

  accesibleFromCritical.forEach(cityToRemove => {
    delete cities[cityToRemove];
    Object.keys(cities).forEach(city => {
      cities[city] = cities[city].filter(c => c !== cityToRemove);
    });
  });

  if (critical.length > 0 && Object.keys(cities).length > 2) {
    return [...critical, ...getCriticalCitiesThatCannotBeRemoved(cities)];
  } else {
    return critical;
  }
}

function solveCase(tickets) {
  const cities = {};

  function addConnection(to, from) {
    const cityAccesibleFrom = cities[to] || [];
    cityAccesibleFrom.push(from);
    cities[to] = cityAccesibleFrom;
  }

  tickets.forEach(([from, to]) => {
    addConnection(to, from);
    addConnection(from, to);
  });

  const criticalCities = getCriticalCitiesThatCannotBeRemoved(cities);
  return criticalCities.length == 0 ? "-" : [...new Set(criticalCities)].sort().join(",");
}

readCases("input.txt").forEach((tickets, i) => {
  console.log(`Case #${i + 1}: ${solveCase(tickets)}`);
});


