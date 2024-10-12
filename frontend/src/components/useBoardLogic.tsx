import { useEffect, useRef, useState } from 'react';
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
  const [currentDropInterval, setCurrentDropInterval] = useState<number>(InitialDropInterval);
  const [nextTetrominos, SetNextTetrominos] = useState<Tetromino[]>([
    randomTetromino(),
    randomTetromino(),
  ]);

  const currentBoardFreezeRef = useRef<boolean>(false);
  const droppedToFloorRef = useRef<boolean>(false);

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

    currentBoardFreezeRef.current = true;
    animateLineClear(newBoard);

    setTimeout(() => {
      const clearedBoard = newBoard.filter(row => !row.every(cell => cell !== ""));
      const clearedLines = ROWS - clearedBoard.length;
      const newEmptyRows = Array.from({ length: clearedLines }, () => Array(COLS).fill(""));
  
      setGameBoard([...newEmptyRows, ...clearedBoard]);
      currentBoardFreezeRef.current = false;
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
    setCurrentTetromino(nextTetrominos[0);
    setTetrominoPosition([0, COLS / 2 - 1]);

    const newNextTetrominos = [
      ...nextTetrominos.slice(1),
      randomTetromino(),
    ];

    setNextTetrominos(newNextTetrominos)

    if (!isTetrominoValid(currentTetromino.shape, tetrominoPosition)) {
      processGameOver();
    }
  };

  useEffect(() => {
    if (currentBoardFreezeRef.current || isGameOver) {
      return;
    }

    if (droppedToFloorRef.current)
    {
      lockAndResetTetromino();
      droppedToFloorRef.current = false;
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
  }, [tetrominoPosition, currentTetromino, currentBoardFreezeRef, isGameOver]);

  const dropTetromino = (toFloor?: boolean) => {
    if (currentBoardFreezeRef.current || isGameOver) {
      return;
    }

    if (toFloor) {
      let newPos: Point = [tetrominoPosition[0], tetrominoPosition[1]];
      while (isTetrominoValid(currentTetromino.shape, [newPos[0] + 1, newPos[1]])) {
        newPos = [newPos[0] + 1, newPos[1]];
      }
      droppedToFloorRef.current = true;
      console.log(droppedToFloorRef.current);
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
      for (let offseti of offsets) {
        for (let offsetj of offsets) {
          let newPosition: Point = [tetrominoPosition[0], tetrominoPosition[1]];
          for (let i = 1; i < 4; i++) {
            for (let j = 1; j < 4; j++) {
              newPosition = [tetrominoPosition[0] + offseti[0] * i + offsetj[0] * j, tetrominoPosition[1] + offseti[1] * i + offsetj[1] * j];
              if (isTetrominoValid(newShape, newPosition)) {
                setTetrominoPosition(newPosition);
                setCurrentTetromino({ ...currentTetromino, shape: newShape });
                break;
              }
            }
          }
        }
      }
    }
  };

  return { isPositionInBoard, gameBoard, currentTetromino, tetrominoPosition, setTetrominoPosition, setCurrentTetromino, setGameBoard, dropTetromino, moveTetromino, rotateTetromino, currentDropInterval, totalClearedLines, gameOverMessage, nextTetrominos };
};

export default useBoardLogic;
