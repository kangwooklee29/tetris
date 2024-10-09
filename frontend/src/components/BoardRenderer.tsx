import React from 'react';
import { BLOCK_SIZE, Point } from '../utils/constants';
import { Tetromino } from '../utils/tetromino';

interface BoardRendererProps {
  gameBoard: number[][];
  currentTetromino: Tetromino;
  tetrominoPosition: Point;
}

const BoardRenderer: React.FC<BoardRendererProps> = ({ gameBoard, currentTetromino, tetrominoPosition }) => {
  const renderGameBoard = () => {
    const temporaryBoard = gameBoard.map(row => [...row]);
    currentTetromino.shape.forEach(([x, y]) => {
      const boardRow = x + tetrominoPosition[0];
      const boardColumn = y + tetrominoPosition[1];
      if (boardRow >= 0) {
        temporaryBoard[boardRow][boardColumn] = 1;
      }
    });

    return temporaryBoard.map((row, rowIndex) => (
      <div key={rowIndex} style={{ display: 'flex' }}>
        {row.map((cell, cellIndex) => (
          <div
            key={cellIndex}
            style={{
              width: BLOCK_SIZE,
              height: BLOCK_SIZE,
              border: '1px solid #ddd',
              background: cell ? currentTetromino.color : 'white',
            }}
          />
        ))}
      </div>
    ));
  };

  return <div>{renderGameBoard()}</div>;
};

export default BoardRenderer;
