import { useEffect, useState } from 'react';
import { COLS, ROWS, Point, InitialDropInterval, ClearLineDelay, DebounceInterval } from '../utils/constants';
import { randomTetromino, Tetromino } from '../utils/tetromino';
import { useDebounce } from '../context/DebounceContext';

const useBoardLogic = () => {
  const { debounceRef } = useDebounce();
  const [gameBoard, setGameBoard] = useState<string[][]>(
    Array.from({ length: ROWS }, () => Array(COLS).fill(""))
  );
  const [currentTetromino, setCurrentTetromino] = useState<Tetromino>(randomTetromino());
  const [tetrominoPosition, setTetrominoPosition] = useState<Point>([0, COLS / 2 - 1]);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [gameOverMessage, setGameOverMessage] = useState<string>("");
  const [totalClearedLines, setTotalClearedLines] = useState<number>(0);

  let currentDropInterval = InitialDropInterval;
  let currentBoardFreeze = false;
  let droppedToFloor = false;

  const isPositionInBoard = (position: Point, offset: Point): boolean => {
    const newX = position[0] + offset[0];
    const newY = position[1] + offset[1];
    if (newX < 0 || newY < 0 || newX >= ROWS || newY >= COLS) {
      return false;
    }
    return true;
  };

  const isTetrominoValid = (shape: Point[], offset: Point): boolean => {
    for (let position of shape) {
      if (!isPositionInBoard(position, offset) || gameBoard[position[0] + offset[0]][position[1] + offset[1]] !== "") {
        return false;
      }
    }
    return true;
  };

  const lockTetromino = () => {
    const newBoard = gameBoard.map(row => [...row]);
    currentTetromino.shape.forEach(([x, y]) => {
      const newX = x + tetrominoPosition[0];
      const newY = y + tetrominoPosition[1];
      newBoard[newX][newY] = currentTetromino.color;
    });
    setGameBoard(newBoard);

    clearLines(newBoard);
  };

  const clearLines = (newBoard: string[][]) => {
    const linesToClear = newBoard.filter(row => row.every(cell => cell !== "")).length;
  
    if (linesToClear === 0) {
      return;
    }

    currentBoardFreeze = true;
    animateLineClear(newBoard);

    setTimeout(() => {
      const clearedBoard = newBoard.filter(row => !row.every(cell => cell !== ""));
      const clearedLines = ROWS - clearedBoard.length;
      const newEmptyRows = Array.from({ length: clearedLines }, () => Array(COLS).fill(""));
  
      setGameBoard([...newEmptyRows, ...clearedBoard]);
      currentBoardFreeze = false;
      setTotalClearedLines(totalClearedLines + linesToClear);
    }, ClearLineDelay);
  };

  const animateLineClear = (newBoard: string[][]) => {
    const rowsToClear = newBoard.map(row => row.every(cell => cell !== "") ? Array(COLS).fill("gray") : row);
    setGameBoard(rowsToClear);
  };

  const processGameOver = () => {
    const newBoard = gameBoard.map(row =>
      row.map(cell => cell ? "gray" : "")
    );
    setGameBoard(newBoard);
    setIsGameOver(true);
    setGameOverMessage("Game Over");
  };

  const lockAndResetTetromino = () => {
    lockTetromino();
    setCurrentTetromino(randomTetromino());
    setTetrominoPosition([0, COLS / 2 - 1]);
    if (!isTetrominoValid(currentTetromino.shape, tetrominoPosition)) {
      processGameOver();
    }
  };

  useEffect(() => {
    if (currentBoardFreeze || isGameOver) {
      return;
    }

    if (droppedToFloor)
    {
      lockAndResetTetromino();
      droppedToFloor = true;
      return;
    }

    if(!isTetrominoValid(currentTetromino.shape, [tetrominoPosition[0] + 1, tetrominoPosition[1]])) {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      debounceRef.current = setTimeout(() => {
        lockAndResetTetromino();
      }, DebounceInterval);
    }
  }, [tetrominoPosition, currentTetromino, currentBoardFreeze, isGameOver]);

  const dropTetromino = (toFloor?: boolean) => {
    if (currentBoardFreeze || isGameOver) {
      return;
    }

    if (toFloor) {
      let newPos: Point = [tetrominoPosition[0], tetrominoPosition[1]];
      while (isTetrominoValid(currentTetromino.shape, [newPos[0] + 1, newPos[1]])) {
        newPos = [newPos[0] + 1, newPos[1]];
      }
      droppedToFloor = true;
      setTetrominoPosition(newPos);
      return;
    }

    const newPos: Point = [tetrominoPosition[0] + 1, tetrominoPosition[1]];
    if (isTetrominoValid(currentTetromino.shape, newPos)) {
      setTetrominoPosition(newPos);
    }
  };

  const moveTetromino = (dir: number) => {
    setTetrominoPosition(tetrominoPosition); // for debouncing
    const newPos: Point = [tetrominoPosition[0], tetrominoPosition[1] + dir];
    if (isTetrominoValid(currentTetromino.shape, newPos)) {
      setTetrominoPosition(newPos);
    }
  };

  const rotateTetromino = () => {
    setTetrominoPosition(tetrominoPosition); // for debouncing
    const newShape = currentTetromino.shape.map(([x, y]) => [-y, x] as Point);
    if (isTetrominoValid(newShape, tetrominoPosition)) {
      setCurrentTetromino({ ...currentTetromino, shape: newShape });
    } else {
      const offsets: Point[] = [
        [0, -1], // 왼쪽으로 이동
        [0, 1],  // 오른쪽으로 이동
        [-1, 0], // 위로 이동
        [1, 0]   // 아래로 이동
      ];
      for (let offset of offsets) {
        const newPosition: Point = [tetrominoPosition[0] + offset[0], tetrominoPosition[1] + offset[1]];
        if (isTetrominoValid(newShape, newPosition)) {
          setTetrominoPosition(newPosition);
          setCurrentTetromino({ ...currentTetromino, shape: newShape });
          break;
        }
      }
    }
  };

  return { isPositionInBoard, gameBoard, currentTetromino, tetrominoPosition, setTetrominoPosition, setCurrentTetromino, setGameBoard, dropTetromino, moveTetromino, rotateTetromino, currentDropInterval, totalClearedLines, gameOverMessage };
};

export default useBoardLogic;
