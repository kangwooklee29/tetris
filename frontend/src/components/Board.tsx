import React from 'react';
import BoardRenderer from './BoardRenderer';
import useBoardLogic from './useBoardLogic';
import useBoardControls from './BoardControls';

const Board: React.FC = () => {
  const { isPositionInBoard, gameBoard, currentTetromino, tetrominoPosition, setTetrominoPosition, setCurrentTetromino, setGameBoard, dropTetromino, moveTetromino, rotateTetromino, currentDropInterval, totalClearedLines, gameOverMessage, nextTetrominos } = useBoardLogic();
  useBoardControls({ dropTetromino, moveTetromino, rotateTetromino, currentDropInterval });

  return <BoardRenderer gameBoard={gameBoard} currentTetromino={currentTetromino} tetrominoPosition={tetrominoPosition} isPositionInBoard={isPositionInBoard} totalClearedLines={totalClearedLines} gameOverMessage={gameOverMessage} nextTetrominos={nextTetrominos}/>;
};

export default Board;
