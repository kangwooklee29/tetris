import React, { useState, useEffect, useCallback } from 'react';
import { COLS, ROWS, BLOCK_SIZE, Point } from '../utils/constants';
import { randomTetromino, Tetromino } from '../utils/tetromino';

const Board: React.FC = () => {
  const [board, setBoard] = useState<number[][]>(
    Array.from({ length: ROWS }, () => Array(COLS).fill(0))
  );
  const [current, setCurrent] = useState<Tetromino>(randomTetromino());
  const [pos, setPos] = useState<Point>([0, COLS / 2 - 1]);

  const handleInput = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        move(-1);
      } else if (e.key === 'ArrowRight') {
        move(1);
      } else if (e.key === 'ArrowDown') {
        drop();
      } else if (e.key === 'ArrowUp') {
        rotate();
      }
    },
    [pos, current]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleInput);
    return () => document.removeEventListener('keydown', handleInput);
  }, [handleInput]);

  useEffect(() => {
    const interval = setInterval(drop, 1000);
    return () => clearInterval(interval);
  }, [pos]);

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

  const rotate = () => {
    const newShape = current.shape.map(([x, y]) => [-y, x] as Point);
    if (isValidPosition(newShape, pos)) {
      setCurrent({...current, shape: newShape });
    }
  };

  const move = (dir: number) => {
    const newPos: Point = [pos[0], pos[1] + dir];
    if (isValidPosition(current.shape, newPos)) {
      setPos(newPos);
    }
  };

  const drop = () => {
    const newPos: Point = [pos[0] + 1, pos[1]];
    if (isValidPosition(current.shape, newPos)) {
      setPos(newPos);
    } else {
      // Lock the shape and generate a new one
      lockShape();
      setCurrent(randomTetromino());
      setPos([0, COLS / 2 - 1]);
    }
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

  const renderBoard = () => {
    const tempBoard = board.map(row => [...row]);
    current.shape.forEach(([x, y]) => {
      const boardX = x + pos[0];
      const boardY = y + pos[1];
      if (boardX >= 0) {
        tempBoard[boardX][boardY] = 1;
      }
    });

    return tempBoard.map((row, rowIndex) => (
      <div key={rowIndex} style={{ display: 'flex' }}>
        {row.map((cell, cellIndex) => (
          <div
            key={cellIndex}
            style={{
              width: BLOCK_SIZE,
              height: BLOCK_SIZE,
              border: '1px solid #ddd',
              background: cell ? current.color : 'white',
            }}
          />
        ))}
      </div>
    ));
  };

  return <div>{renderBoard()}</div>;
};

export default Board;
