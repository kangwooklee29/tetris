import { useEffect, useCallback, useRef } from 'react';

interface BoardControlsProps {
  dropTetromino: (toFloor?: boolean) => void;
  moveTetromino: (dir: number) => void;
  rotateTetromino: () => void;
  currentDropInterval: number;
}

const useBoardControls = ({ dropTetromino, moveTetromino, rotateTetromino, currentDropInterval }: BoardControlsProps) => {
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const prevTouchPosX = useRef(0);
  const prevTouchPosY = useRef(0);

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
      } else if (e.key === ' ') {
        dropTetromino(true);
      }
    },
    [moveTetromino, dropTetromino, rotateTetromino]
  );

  const handleTouchStart = useCallback((e: TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
    prevTouchPosX.current = touch.clientX;
    prevTouchPosY.current = touch.clientY;
  }, []);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    e.preventDefault();
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartX.current;
    const deltaY = touch.clientY - touchStartY.current;

    if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
      rotateTetromino();
    }
  }, [rotateTetromino]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStartX.current;
    const deltaY = touch.clientY - touchStartY.current;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      moveTetromino(deltaX > 0 ? 1 : -1);
    } else {
      dropTetromino();
    }

    if (Math.abs(deltaX) >= 10 || Math.abs(deltaY) >= 10) {
      prevTouchPosX.current = touch.clientX;
      prevTouchPosY.current = touch.clientY;
    }
  }, [moveTetromino, dropTetromino]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyboardInput);
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    return () => {
      document.removeEventListener('keydown', handleKeyboardInput);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, [handleKeyboardInput, handleTouchStart, handleTouchEnd]);

  useEffect(() => {
    const interval = setInterval(dropTetromino, currentDropInterval);
    return () => clearInterval(interval);
  }, [dropTetromino]);
};

export default useBoardControls;
