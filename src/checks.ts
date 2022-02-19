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
  const { snakes, myHead, possibleMoves, boardReference: board } = args;
  const { x, y } = myHead;

  const snakeCoordSet = new Set<[number, number]>();

  snakes.forEach((snake) =>
    snake.body.forEach((body) => {
      const { x: i, y: j } = body;

      // set position of other snake
      board[i][j] = 1;
    })
  );

  if (x + 1 < board.length && board[x + 1][y] && !snakeCoordSet.has([x + 1, y])) {
    possibleMoves.right = false;
    snakeCoordSet.add([x + 1, y]);
  }
  if ( x - 1 >= 0 && board[x - 1][y] && !snakeCoordSet.has([x - 1, y])) {
    possibleMoves.left = false;
    snakeCoordSet.add([x - 1, y]);
  }
  if (y + 1 < board[0].length && board[x][y + 1] && !snakeCoordSet.has([x, y + 1])) {
    possibleMoves.up = false;
    snakeCoordSet.add([x, y + 1]);
  }
  if (y - 1 >= 0 && board[x][y - 1] && !snakeCoordSet.has([x, y - 1]))
    possibleMoves.down = false;
  snakeCoordSet.add([x, y - 1]);
}
