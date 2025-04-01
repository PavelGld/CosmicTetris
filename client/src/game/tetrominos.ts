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
  try {
    const tetrominoTypes = Object.keys(TETROMINOS) as TetrominoType[];
    
    // Make sure we have valid tetromino types
    if (!tetrominoTypes || tetrominoTypes.length === 0) {
      console.error("No tetromino types available!");
      // Return a default tetromino as fallback
      return {
        type: 'T',
        shape: [
          [0, 1, 0],
          [1, 1, 1],
          [0, 0, 0]
        ],
        color: COLORS.T
      };
    }
    
    // Get a random type
    const randIndex = Math.floor(Math.random() * tetrominoTypes.length);
    const randTetromino = tetrominoTypes[randIndex];
    
    // Make sure it's a valid tetromino
    if (!TETROMINOS[randTetromino]) {
      console.error("Invalid tetromino type:", randTetromino);
      // Return a default tetromino as fallback
      return {
        type: 'T',
        shape: [
          [0, 1, 0],
          [1, 1, 1],
          [0, 0, 0]
        ],
        color: COLORS.T
      };
    }
    
    // Create a deep copy to avoid reference issues
    const tetromino = {
      ...TETROMINOS[randTetromino],
      shape: JSON.parse(JSON.stringify(TETROMINOS[randTetromino].shape))
    };
    
    // Verify the shape is valid
    if (!tetromino.shape || !Array.isArray(tetromino.shape) || tetromino.shape.length === 0) {
      console.error("Invalid tetromino shape for type:", randTetromino);
      // Fix the shape
      tetromino.shape = [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0]
      ];
    }
    
    console.log("Generated tetromino:", tetromino.type, "shape size:", tetromino.shape.length + "x" + tetromino.shape[0].length);
    return tetromino;
  } catch (error) {
    console.error("Error in getRandomTetromino:", error);
    // Return a default tetromino as fallback
    return {
      type: 'T',
      shape: [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0]
      ],
      color: COLORS.T
    };
  }
};
