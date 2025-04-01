import { COLORS } from './constants';

export type TetrominoShape = (0 | 1 | 2)[][];
export type TetrominoType = 'I' | 'O' | 'T' | 'L' | 'J' | 'S' | 'Z';

export interface Tetromino {
  type: TetrominoType;
  shape: TetrominoShape;
  color: string;
}

/**
 * Tetromino shapes representation
 * 0 = empty cell
 * 1 = filled cell
 * 2 = filled cell with glow (for rendering effects, treated as filled for collision)
 */
export const TETROMINOS: { [key in TetrominoType]: Tetromino } = {
  I: {
    type: 'I',
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    color: COLORS.I
  },
  O: {
    type: 'O',
    shape: [
      [1, 1],
      [1, 1]
    ],
    color: COLORS.O
  },
  T: {
    type: 'T',
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    color: COLORS.T
  },
  L: {
    type: 'L',
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0]
    ],
    color: COLORS.L
  },
  J: {
    type: 'J',
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    color: COLORS.J
  },
  S: {
    type: 'S',
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0]
    ],
    color: COLORS.S
  },
  Z: {
    type: 'Z',
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0]
    ],
    color: COLORS.Z
  }
};

/**
 * Function to get a random tetromino
 */
export const getRandomTetromino = (): Tetromino => {
  const tetrominoTypes = Object.keys(TETROMINOS) as TetrominoType[];
  const randTetromino = 
    tetrominoTypes[Math.floor(Math.random() * tetrominoTypes.length)];
  return TETROMINOS[randTetromino];
};
