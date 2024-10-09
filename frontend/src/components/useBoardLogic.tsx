import { useState } from 'react';
import { COLS, ROWS, Point } from '../utils/constants';
import { randomTetromino, Tetromino } from '../utils/tetromino';

const useBoardLogic = () => {
  const [gameBoard, setGameBoard] = useState<number[][]>(
    Array.from({ length: ROWS }, () => Array(COLS).fill(0))
  );
  const [currentTetromino, setCurrentTetromino] = useState<Tetromino>(randomTetromino());
  const [tetrominoPosition, setTetrominoPosition] = useState<Point>([0, COLS / 2 - 1]);

  const isPositionValid = (shape: Point[], offset: Point): boolean => {
    for (let [x, y] of shape) {
      const newX = x + offset[0];
      const newY = y + offset[1];
      if (newX < 0 || newY < 0 || newX >= ROWS || newY >= COLS || gameBoard[newX][newY] !== 0) {
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
      newBoard[newX][newY] = 1;
    });
    setGameBoard(newBoard);
  };

  const dropTetromino = () => {
    const newPos: Point = [tetrominoPosition[0] + 1, tetrominoPosition[1]];
    if (isPositionValid(currentTetromino.shape, newPos)) {
      setTetrominoPosition(newPos);
    } else {
      lockTetromino();
      setCurrentTetromino(randomTetromino());
      setTetrominoPosition([0, COLS / 2 - 1]);
    }
  };

  const moveTetromino = (dir: number) => {
    const newPos: Point = [tetrominoPosition[0], tetrominoPosition[1] + dir];
    if (isPositionValid(currentTetromino.shape, newPos)) {
      setTetrominoPosition(newPos);
    }
  };

  const rotateTetromino = () => {
    const newShape = currentTetromino.shape.map(([x, y]) => [-y, x] as Point);
    if (isPositionValid(newShape, tetrominoPosition)) {
      setCurrentTetromino({ ...currentTetromino, shape: newShape });
    }
  };

  return { gameBoard, currentTetromino, tetrominoPosition, setTetrominoPosition, setCurrentTetromino, setGameBoard, dropTetromino, moveTetromino, rotateTetromino };
};

export default useBoardLogic;
