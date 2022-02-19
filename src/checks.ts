import type {
  Battlesnake,
  Board,
  CheckBody,
  CheckSnakes,
  CheckWalls,
  CheckWallsRelative,
  Coord,
  PossibleMoves,
} from "./types";

export function checkWalls(args: CheckWalls): void {
  const { myHead, board, possibleMoves } = args;

  // coordinate of snake head
  const { x, y }: Coord = myHead;

  // directions const to be used as next possible
  // up, down, left, right coordinates
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

    // perform bfs condition
    checkWallsRelative({ x: nextX, y: nextY, possibleMoves, board });
  });
}

function checkWallsRelative(args: CheckWallsRelative): void {
  const { x, y, possibleMoves, board }: CheckWallsRelative = args;

  // size of game board
  const { width: n, height: m }: Board = board;

  if (x < 0 && possibleMoves.left) possibleMoves.left = false;
  if (x >= n && possibleMoves.right) possibleMoves.right = false;
  if (y < 0 && possibleMoves.down) possibleMoves.down = false;
  if (y >= m && possibleMoves.up) possibleMoves.up = false;
}

export function checkBody(args: CheckBody): void {
  const { myHead, body, possibleMoves } = args;
  const { x, y } = myHead;

  // iterate through the coord of the body
  body.forEach(function checkNextBody(coord) {
    const { x: cx, y: cy } = coord;

    // perform bfs condition
    checkBodyRelative(x, y, cx, cy, possibleMoves);
  });
}

function checkBodyRelative(
  x: number,
  y: number,
  cx: number,
  cy: number,
  possibleMoves: PossibleMoves
): void {
  // check body relative to the head's x coordinate
  if (x - 1 === cx && y === cy) possibleMoves.left = false;
  if (x + 1 === cx && y === cy) possibleMoves.right = false;

  // check body relative to the head's y coordinate
  if (y - 1 === cy && x === cx) possibleMoves.down = false;
  if (y + 1 === cy && x === cx) possibleMoves.up = false;
}

export function checkSnakes(args: CheckSnakes) {
  const { snakes, myHead, possibleMoves } = args;
  const { x, y } = myHead;

  const snakeCoordSet = new Set<Coord[]>();
  snakes.forEach((snake) => {
    snakeCoordSet.add(snake.body.map((body) => body));
  });
  console.log(snakeCoordSet);

  const nextRight: Coord = { x: x + 1, y };
  const nextLeft: Coord = { x: x - 1, y };
  const nextUp: Coord = { x, y: y + 1 };
  const nextDown: Coord = { x, y: y - 1 };

  // if (set.has(nextRight)) possibleMoves.right = false;
  // if (snake.body.includes(nextLeft)) possibleMoves.left = false;
  // if (snake.body.includes(nextUp)) possibleMoves.up = false;
  // if (snake.body.includes(nextDown)) possibleMoves.down = false;
}
