import React from 'react';
import { BLOCK_SIZE, Point } from '../utils/constants';
import { Tetromino } from '../utils/tetromino';

interface BoardRendererProps {
  board: number[][];
  current: Tetromino;
  pos: Point;
}

const BoardRenderer: React.FC<BoardRendererProps> = ({ board, current, pos }) => {
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

export default BoardRenderer;
