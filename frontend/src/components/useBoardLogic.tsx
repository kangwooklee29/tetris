import { useState } from 'react';
import { COLS, ROWS, Point, InitialDropInterval, ClearLineDelay } from '../utils/constants';
import { randomTetromino, Tetromino } from '../utils/tetromino';

const useBoardLogic = () => {
  const [gameBoard, setGameBoard] = useState<string[][]>(
    Array.from({ length: ROWS }, () => Array(COLS).fill(""))
  );
  const [currentTetromino, setCurrentTetromino] = useState<Tetromino>(randomTetromino());
  const [tetrominoPosition, setTetrominoPosition] = useState<Point>([0, COLS / 2 - 1]);
  const [currentDropInterval, setCurrentDropInterval] = useState<number>(InitialDropInterval);
  const [currentBoardFreeze, setCurrentBoardFreeze] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [gameOverMessage, setGameOverMessage] = useState<string>("");
  const [totalClearedLines, setTotalClearedLines] = useState<number>(0);

  const isPositionInBoard = (position: Point, offset: Point): boolean => {
    const newX = position[0] + offset[0];
    const newY = position[1] + offset[1];
    if (newX < 0 || newY < 0 || newX >= ROWS || newY >= COLS) {
      return false;
    }
    return true;
  };

  const isTetrominoValid = (shape: Point[], offset: Point): boolean => {
    for (let position of shape) {
      if (!isPositionInBoard(position, offset) || gameBoard[position[0] + offset[0]][position[1] + offset[1]] !== "") {
        return false;
      }
    }
    return true;
  };

  const lockTetromino = () => {
    const newBoard = gameBoard.map(row => [...row]);
    currentTetromino.shape.forEach(([x, y]) => {
      const newX = x + tetrominoPosition[0];
      const newY = y + tetrominoPosition[1];
      newBoard[newX][newY] = currentTetromino.color;
    });
    setGameBoard(newBoard);

    clearLines(newBoard);
  };

  const clearLines = (newBoard: string[][]) => {
    const linesToClear = newBoard.filter(row => row.every(cell => cell !== "")).length;
  
    if (linesToClear === 0) {
      return;
    }

    setCurrentBoardFreeze(true);
    animateLineClear(newBoard);

    setTimeout(() => {
      const clearedBoard = newBoard.filter(row => !row.every(cell => cell !== ""));
      const clearedLines = ROWS - clearedBoard.length;
      const newEmptyRows = Array.from({ length: clearedLines }, () => Array(COLS).fill(""));
  
      setGameBoard([...newEmptyRows, ...clearedBoard]);
      setCurrentBoardFreeze(false);
      setTotalClearedLines(totalClearedLines + linesToClear);
    }, ClearLineDelay);
  };

  const animateLineClear = (newBoard: string[][]) => {
    const rowsToClear = newBoard.map(row => row.every(cell => cell !== "") ? Array(COLS).fill("gray") : row);
    setGameBoard(rowsToClear);
  };

  const processGameOver = () => {
    const newBoard = gameBoard.map(row =>
      row.map(cell => cell ? "gray" : "")
    );
    setGameBoard(newBoard);
    setIsGameOver(true);
    setGameOverMessage("Game Over");
  };

  const lockAndResetTetromino = () => {
    lockTetromino();
    setCurrentTetromino(randomTetromino());
    setTetrominoPosition([0, COLS / 2 - 1]);
    if (!isTetrominoValid(currentTetromino.shape, tetrominoPosition)) {
      processGameOver();
    }
  };

  const dropTetromino = (toFloor?: boolean) => {
    if (currentBoardFreeze || isGameOver) {
      return;
    }

    if (toFloor) {
      let newPos: Point = [tetrominoPosition[0], tetrominoPosition[1]];
      while (isTetrominoValid(currentTetromino.shape, [newPos[0] + 1, newPos[1]])) {
        newPos = [newPos[0] + 1, newPos[1]];
      }
      setTetrominoPosition(newPos);
      lockAndResetTetromino();
      return;
    }

    const newPos: Point = [tetrominoPosition[0] + 1, tetrominoPosition[1]];
    if (isTetrominoValid(currentTetromino.shape, newPos)) {
      setTetrominoPosition(newPos);
    } else {
      lockAndResetTetromino();
    }
  };

  const moveTetromino = (dir: number) => {
    const newPos: Point = [tetrominoPosition[0], tetrominoPosition[1] + dir];
    if (isTetrominoValid(currentTetromino.shape, newPos)) {
      setTetrominoPosition(newPos);
    }
  };

  const rotateTetromino = () => {
    const newShape = currentTetromino.shape.map(([x, y]) => [-y, x] as Point);
    if (isTetrominoValid(newShape, tetrominoPosition)) {
      setCurrentTetromino({ ...currentTetromino, shape: newShape });
    } else {
      const offsets: Point[] = [
        [0, -1], // 왼쪽으로 이동
        [0, 1],  // 오른쪽으로 이동
        [-1, 0], // 위로 이동
        [1, 0]   // 아래로 이동
      ];
      for (let offset of offsets) {
        const newPosition: Point = [tetrominoPosition[0] + offset[0], tetrominoPosition[1] + offset[1]];
        if (isTetrominoValid(newShape, newPosition)) {
          setTetrominoPosition(newPosition);
          setCurrentTetromino({ ...currentTetromino, shape: newShape });
          break;
        }
      }
    }
  };

  return { isPositionInBoard, gameBoard, currentTetromino, tetrominoPosition, setTetrominoPosition, setCurrentTetromino, setGameBoard, dropTetromino, moveTetromino, rotateTetromino, currentDropInterval, totalClearedLines, gameOverMessage };
};

export default useBoardLogic;
