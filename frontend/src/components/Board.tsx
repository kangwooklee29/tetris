import React from 'react';
import BoardRenderer from './BoardRenderer';
import useBoardLogic from './BoardLogic';
import useBoardControls from './BoardControls';

const Board: React.FC = () => {
  const { board, current, pos, setPos, setCurrent, setBoard, drop, move, rotate } = useBoardLogic();
  useBoardControls({ drop, move, rotate });

  return <BoardRenderer board={board} current={current} pos={pos} />;
};

export default Board;
