import React from 'react';
import './BoardRenderer.css';
import { BLOCK_SIZE, Point } from '../utils/constants';
import { Tetromino } from '../utils/tetromino';

interface BoardRendererProps {
  gameBoard: string[][];
  currentTetromino: Tetromino;
  nextTetrominos: Tetromino[];
  tetrominoPosition: Point;
  isPositionInBoard: (position: Point, offset: Point) => boolean;
  totalClearedLines: number;
  gameOverMessage: string;
}

const BoardRenderer: React.FC<BoardRendererProps> = ({ gameBoard, currentTetromino, tetrominoPosition, isPositionInBoard, totalClearedLines, gameOverMessage, nextTetrominos }) => {
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

  const renderTetrominoPreview = (tetromino: Tetromino) => {
    return (
      <div className="tetromino-preview">
        {tetromino.shape.map(([x, y], index) => (
          <div
            key={index}
            className="preview-cell"
            style={{
              '--tetromino-color': tetromino.color,
              top: `${y * BLOCK_SIZE / 2}px`, // Reduced size for the preview
              left: `${x * BLOCK_SIZE / 2}px`, // Reduced size for the preview
              width: BLOCK_SIZE / 2,
              height: BLOCK_SIZE / 2,
            } as React.CSSProperties}
          />
        ))}
      </div>
    );
  };
  
  return (
    <div className="game-container">
      <div className="board-container">
        {renderGameBoard()}
      </div>
    
      <div className="next-tetrominos">
        <h3>Next Blocks</h3>
        <div className="preview-container">
          {nextTetrominos.slice(0, 2).map((tetromino, index) => (
            <div key={index} className="tetromino-wrapper">
              {renderTetrominoPreview(tetromino)}
            </div>
          ))}
        </div>
      </div>

      <div className="game-info">
        <p>Total Cleared Lines: {totalClearedLines}</p>
        {gameOverMessage && <p className="game-over">{gameOverMessage}</p>}
      </div>
    </div>
  );
};

export default BoardRenderer;
