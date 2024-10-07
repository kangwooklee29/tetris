import { SHAPES, COLORS } from './constants';
import { Point } from './constants';

export interface Tetromino {
  shape: Point[];
  color: string;
}

const TETROMINO_TYPES = Object.keys(SHAPES);

export function randomTetromino(): Tetromino {
  const type = TETROMINO_TYPES[Math.floor(Math.random() * TETROMINO_TYPES.length)];
  return {
    shape: SHAPES[type],
    color: COLORS[type],
  };
}
