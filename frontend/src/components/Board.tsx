import React from 'react';
import BoardRenderer from './BoardRenderer';
import useBoardLogic from './useBoardLogic';
import useBoardControls from './BoardControls';

const Board: React.FC = () => {
  const { isPositionInBoard, gameBoard, currentTetromino, tetrominoPosition, setTetrominoPosition, setCurrentTetromino, setGameBoard, dropTetromino, moveTetromino, rotateTetromino } = useBoardLogic();
  useBoardControls({ dropTetromino, moveTetromino, rotateTetromino });

  return <BoardRenderer gameBoard={gameBoard} currentTetromino={currentTetromino} tetrominoPosition={tetrominoPosition} isPositionInBoard={isPositionInBoard} />;
};

export default Board;
