import React from 'react';
import './BoardRenderer.css';
import { BLOCK_SIZE, Point } from '../utils/constants';
import { Tetromino } from '../utils/tetromino';

interface BoardRendererProps {
  gameBoard: string[][];
  currentTetromino: Tetromino;
  tetrominoPosition: Point;
  isPositionInBoard: (position: Point, offset: Point) => boolean;
  clearedLines: number;
  gameOverMessage: string;
}

const BoardRenderer: React.FC<BoardRendererProps> = ({ gameBoard, currentTetromino, tetrominoPosition, isPositionInBoard, clearedLines, gameOverMessage }) => {
  const renderGameBoard = () => {
    const temporaryBoard = gameBoard.map(row => [...row]);
    currentTetromino.shape.forEach(([x, y]) => {
      if (isPositionInBoard([x, y], tetrominoPosition)) {
        temporaryBoard[x + tetrominoPosition[0]][y + tetrominoPosition[1]] = currentTetromino.color;
      }
    });

    return temporaryBoard.map((row, rowIndex) => (
      <div key={rowIndex} className="board-row">
        {row.map((cell, cellIndex) => (
          <div
            key={cellIndex}
            className={`board-cell ${cell ? 'active' : ''}`}
            style={{
              '--tetromino-color': cell ? cell : '',
              width: BLOCK_SIZE,
              height: BLOCK_SIZE,
            } as React.CSSProperties}
          />
        ))}
      </div>
    ));
  };

  return (
    <div>
      {renderGameBoard()}
      <div className="game-info">
        <p>Cleared Lines: {clearedLines}</p>
        {gameOverMessage && <p className="game-over">{gameOverMessage}</p>}
      </div>
    </div>
  );
};

export default BoardRenderer;
