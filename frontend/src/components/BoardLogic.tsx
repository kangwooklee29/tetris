import { useState } from 'react';
import { COLS, ROWS, Point } from '../utils/constants';
import { randomTetromino, Tetromino } from '../utils/tetromino';

const useBoardLogic = () => {
  const [board, setBoard] = useState<number[][]>(
    Array.from({ length: ROWS }, () => Array(COLS).fill(0))
  );
  const [current, setCurrent] = useState<Tetromino>(randomTetromino());
  const [pos, setPos] = useState<Point>([0, COLS / 2 - 1]);

  const isValidPosition = (shape: Point[], offset: Point): boolean => {
    for (let [x, y] of shape) {
      const newX = x + offset[0];
      const newY = y + offset[1];
      if (newX < 0 || newY < 0 || newX >= ROWS || newY >= COLS || board[newX][newY] !== 0) {
        return false;
      }
    }
    return true;
  };

  const lockShape = () => {
    const newBoard = board.map(row => [...row]);
    current.shape.forEach(([x, y]) => {
      const newX = x + pos[0];
      const newY = y + pos[1];
      newBoard[newX][newY] = 1;
    });
    setBoard(newBoard);
  };

  const drop = () => {
    const newPos: Point = [pos[0] + 1, pos[1]];
    if (isValidPosition(current.shape, newPos)) {
      setPos(newPos);
    } else {
      lockShape();
      setCurrent(randomTetromino());
      setPos([0, COLS / 2 - 1]);
    }
  };

  const move = (dir: number) => {
    const newPos: Point = [pos[0], pos[1] + dir];
    if (isValidPosition(current.shape, newPos)) {
      setPos(newPos);
    }
  };

  const rotate = () => {
    const newShape = current.shape.map(([x, y]) => [-y, x] as Point);
    if (isValidPosition(newShape, pos)) {
      setCurrent({ ...current, shape: newShape });
    }
  };

  return { board, current, pos, setPos, setCurrent, setBoard, drop, move, rotate };
};

export default useBoardLogic;
