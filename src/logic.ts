import { InfoResponse, GameState, MoveResponse, Game, Coord, Board } from "./types";

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
  myHead: Coord,
  board: Board,
  possibleMoves: { [key: string]: boolean }
) {

  // coordinate of snake head
  const { x, y } = myHead

  // size of game board
  const { 
    width: n, 
    height: m 
  } = board

  // directions const to be used as next possible
  // up, down, left, right coordinates
  const directions: Array<[number, number]> = [
    [1,  0],
    [0,  1],
    [-1, 0],
    [0, -1],
  ];
  directions.forEach(function checkNextDirection(direction) {
    const [i, j]: [number, number]  = direction;
    const nextX: number             = x + i;
    const nextY: number             = y + j;

    if (nextX < 0 && possibleMoves.left)    possibleMoves.left  = false;
    if (nextX >= n && possibleMoves.right)  possibleMoves.right = false;
    if (nextY < 0 && possibleMoves.down)    possibleMoves.down  = false;
    if (nextY >= m && possibleMoves.up)     possibleMoves.up    = false;
  });
}

// function condition(x: number, y: number, cx: number, cy: number) {
//   const directions: Array<[number, number]> = [
//     [1,  0],
//     [0,  1],
//     [-1, 0],
//     [0, -1],
//   ];
// }

function checkBody(
  myHead: Coord,
  body: Coord[],
  possibleMoves: { [key: string]: boolean }
) {

  const { x, y } = myHead;
  // iterate through the coord of the body
  body.forEach(function checkNextBody(coord) {
    const { x: cx, y: cy } = coord;

    // check body relative to the head's x coordinate
    if (x - 1 === cx && y === cy) possibleMoves.left  = false;
    if (x + 1 === cx && y === cy) possibleMoves.right = false;
    
    // check body relative to the head's y coordinate
    if (y - 1 === cy && x === cx) possibleMoves.down = false;
    if (y + 1 === cy && x === cx) possibleMoves.up   = false;
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
  checkWalls(myHead,  gameState.board, possibleMoves);

  // Step 2 - Don't hit yourself.
  // Use information in gameState to prevent your Battlesnake from colliding with itself.
  const [head, ...myBody] = gameState.you.body;
  checkBody(myHead, myBody, possibleMoves);

  // TODO: Step 3 - Don't collide with others.
  // Use information in gameState to prevent your Battlesnake from colliding with others.

  // TODO: Step 4 - Find food.
  // Use information in gameState to seek out and find food.

  // Finally, choose a move from the available safe moves.
  // TODO: Step 5 - Select a move to make based on strategy, rather than random.

  console.log('possibleMoves', possibleMoves)
  const safeMoves = Object.keys(possibleMoves).filter(
    (key) => possibleMoves[key]
  );
  console.log('body', myBody)
  console.log('head', myHead);
  console.log('SAFE', safeMoves);
  const response: MoveResponse = {
    move: safeMoves[Math.floor(Math.random() * safeMoves.length)],
  };

  console.log(`${gameState.game.id} MOVE ${gameState.turn}: ${response.move}`);
  return response;
}
