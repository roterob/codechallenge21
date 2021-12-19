const Telnet = require("telnet-client");

const OPPOSITE = {
  "north": "south",
  "south": "north",
  "west": "east",
  "east": "west",
};

// Previous executions
const no_exit = ["(10, 0)","(10, 1)","(10, 3)","(10, 5)","(11, 1)","(11, 3)","(11, 5)","(12, 1)","(12, 3)","(12, 5)","(13, 1)","(13, 2)","(13, 3)","(13, 4)","(13, 5)","(13, 6)","(13, 8)","(13, 9)","(14, 1)","(14, 5)","(14, 8)","(15, 0)","(15, 1)","(15, 5)","(15, 8)","(16, 0)","(16, 6)","(16, 7)","(16, 8)","(17, 0)","(17, 4)","(17, 5)","(17, 6)","(18, 0)","(18, 4)","(19, 0)","(19, 4)","(2, 0)","(3, 0)","(3, 2)","(4, 0)","(5, 0)","(5, 2)","(6, 0)","(6, 1)","(6, 2)","(7, 2)","(7, 5)","(8, 3)","(8, 5)","(8, 7)","(9, 1)","(9, 2)","(9, 3)","(9, 5)","(9, 7)"];

function Dungeon() {
  const connection = new Telnet();
  const params = {
    host: "codechallenge-daemons.0x14.net",
    port: 4321,
    shellPrompt: "",
    timeout: 5000,
    sendTimeout: 600,
    execTimeout: 500
  };

  async function send(command) {
    const output = await connection.send(command);
    return output;
  }

  function getNewPosition(output) {
    return output.includes(":") ? output.split(":")[1].trim() : "";
  }

  async function isExit() {
    const output = await send("is exit?");
    return !output.startsWith("No.");
  }

  async function whereAmI() {
    const output = await send("where am I");
    return output.trim();
  }

  async function goTo(position) {
    if (/(\d+),\s+(\d+)/.test(position)) {
      await send(`go to ${RegExp.$1},${RegExp.$2}`);
    }
  }

  async function look(direction) {
    const output = await send("look");
    const res = output.trim()
      .split(":")[1]
      .split(" ")
      .reverse()
      .filter((movement) => movement && movement != OPPOSITE[direction]);
    return res;
  }

  async function move(direction) {
    const output = await send(direction);
    const movements = await look(direction);
    const exit = await isExit();
    const newPosition = getNewPosition(output);

    return [newPosition, movements, exit];
  }

  async function start() {
    await connection.connect(params);
    const movements = await look("");
    const currentPosition = await whereAmI();
    return [currentPosition, movements];
  }

  return {
    start,
    move,
    goTo,
    whereAmI
  }
}

const visitedPositions = [];
async function searchExit(dungeon, currentPosition, movements) {
  visitedPositions.push(currentPosition);

  for (const movement of movements) {
    const [newPosition, newMovements, isExit] = await dungeon.move(movement);
    console.log(currentPosition, movement, newPosition, movements);
    if (isExit) {
      return [currentPosition, newPosition];
    }

    if (visitedPositions.includes(newPosition) || no_exit.includes(newPosition)) {
      await dungeon.goTo(currentPosition);
      continue;
    }

    const pathToExit = await searchExit(dungeon, newPosition, newMovements);
    if (pathToExit) {
      return [currentPosition, ...pathToExit];
    } else {
      console.log("no exit", newPosition);
      await dungeon.goTo(currentPosition);
    }

  }

  return null;
}

async function play() {
  const dungeon = Dungeon();
  const [position, movements] = await dungeon.start();
  const path = await searchExit(dungeon, position, movements);
  console.log(path);
}

play();
