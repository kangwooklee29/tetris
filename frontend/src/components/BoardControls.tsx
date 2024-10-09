import { useEffect, useCallback } from 'react';

interface BoardControlsProps {
  dropTetromino: () => void;
  moveTetromino: (dir: number) => void;
  rotateTetromino: () => void;
}

const useBoardControls = ({ dropTetromino, moveTetromino, rotateTetromino }: BoardControlsProps) => {
  const handleKeyboardInput = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        moveTetromino(-1);
      } else if (e.key === 'ArrowRight') {
        moveTetromino(1);
      } else if (e.key === 'ArrowDown') {
        dropTetromino();
      } else if (e.key === 'ArrowUp') {
        rotateTetromino();
      }
    },
    [moveTetromino, dropTetromino, rotateTetromino]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyboardInput);
    return () => document.removeEventListener('keydown', handleKeyboardInput);
  }, [handleKeyboardInput]);

  useEffect(() => {
    const interval = setInterval(dropTetromino, 1000);
    return () => clearInterval(interval);
  }, [dropTetromino]);
};

export default useBoardControls;
