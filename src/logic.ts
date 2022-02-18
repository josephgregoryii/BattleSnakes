import { InfoResponse, GameState, MoveResponse, Game, Coord } from "./types";

export function info(): InfoResponse {
  console.log("INFO");
  const response: InfoResponse = {
    apiversion: "1",
    author: "",
    color: "#33cccc",
    head: "fang",
    tail: "curled",
  };
  return response;
}

export function start(gameState: GameState): void {
  console.log(`${gameState.game.id} START`);
}

export function end(gameState: GameState): void {
  console.log(`${gameState.game.id} END\n`);
}

function checkWalls(
  x: number,
  y: number,
  n: number,
  m: number,
  possibleMoves: { [key: string]: boolean }
) {
  const directions: Array<[number, number]> = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1],
  ];
  directions.forEach(function checkNextDirection(direction) {
    const [i, j]: [number, number] = direction;
    const nextX: number = x + i;
    const nextY: number = y + j;

    if (nextX < 0) possibleMoves.left = false;
    else if (nextX > n) possibleMoves.right = false;
    else if (nextY < 0) possibleMoves.down = false;
    else if (nextY > m) possibleMoves.up = false;
  });
}

function checkBody(
  x: number,
  y: number,
  body: Coord[],
  possibleMoves: { [key: string]: boolean }
) {
  // iterate through the coord of the body
  body.forEach((coord) => {
    const { x: cx, y: cy } = coord;

    // check if next square is the snake's body
    if (x - 1 === cx) possibleMoves.left = false;
    if (x + 1 === cx) possibleMoves.right = false;
    if (y - 1 === cy) possibleMoves.bottom = false;
    if (y + 1 === cy) possibleMoves.up = false;
  });
}

export function move(gameState: GameState): MoveResponse {
  let possibleMoves: { [key: string]: boolean } = {
    up: true,
    down: true,
    left: true,
    right: true,
  };

  // Step 0: Don't let your Battlesnake move back on it's own neck
  const myHead = gameState.you.head;
  const myNeck = gameState.you.body[1];

  if (myNeck.x < myHead.x) {
    possibleMoves.left = false;
  } else if (myNeck.x > myHead.x) {
    possibleMoves.right = false;
  } else if (myNeck.y < myHead.y) {
    possibleMoves.down = false;
  } else if (myNeck.y > myHead.y) {
    possibleMoves.up = false;
  }

  // Step 1 - Don't hit walls.
  // Use information in gameState to prevent your Battlesnake from moving beyond the boundaries of the board.
  const boardWidth = gameState.board.width;
  const boardHeight = gameState.board.height;
  checkWalls(myHead.x, myHead.y, boardWidth, boardHeight, possibleMoves);
  console.log(gameState.board);

  // Step 2 - Don't hit yourself.
  // Use information in gameState to prevent your Battlesnake from colliding with itself.
  const myBody = gameState.you.body;
  checkBody(myHead.x, myHead.y, myBody, possibleMoves);

  // TODO: Step 3 - Don't collide with others.
  // Use information in gameState to prevent your Battlesnake from colliding with others.

  // TODO: Step 4 - Find food.
  // Use information in gameState to seek out and find food.

  // Finally, choose a move from the available safe moves.
  // TODO: Step 5 - Select a move to make based on strategy, rather than random.
  const safeMoves = Object.keys(possibleMoves).filter(
    (key) => possibleMoves[key]
  );
  const response: MoveResponse = {
    move: safeMoves[Math.floor(Math.random() * safeMoves.length)],
  };

  console.log(`${gameState.game.id} MOVE ${gameState.turn}: ${response.move}`);
  return response;
}
