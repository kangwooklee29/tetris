import { useEffect, useCallback } from 'react';

interface BoardControlsProps {
  drop: () => void;
  move: (dir: number) => void;
  rotate: () => void;
}

const useBoardControls = ({ drop, move, rotate }: BoardControlsProps) => {
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
    [move, drop, rotate]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleInput);
    return () => document.removeEventListener('keydown', handleInput);
  }, [handleInput]);

  useEffect(() => {
    const interval = setInterval(drop, 1000);
    return () => clearInterval(interval);
  }, [drop]);
};

export default useBoardControls;
