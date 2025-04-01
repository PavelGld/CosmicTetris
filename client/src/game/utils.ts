import { BOARD_HEIGHT, BOARD_WIDTH } from './constants';
import { TetrominoShape } from './tetrominos';

/**
 * Creates an empty game board
 */
export const createEmptyBoard = (): (string | 0 | 1 | 2)[][] => 
  Array.from(Array(BOARD_HEIGHT + 5), () => 
    Array(BOARD_WIDTH).fill(0)
  );

/**
 * Check if a tetromino collides with the game board
 */
export const checkCollision = (
  player: { pos: { x: number; y: number }; tetromino: TetrominoShape },
  board: (string | 0 | 1 | 2)[][],
  { x: moveX, y: moveY }: { x: number; y: number }
): boolean => {
  try {
    // Safety check for invalid player data
    if (!player || !player.tetromino || !Array.isArray(player.tetromino)) {
      console.error("Invalid player data in checkCollision", player);
      return true; // Assume collision for safety
    }
    
    // Safety check for invalid board
    if (!board || !Array.isArray(board) || board.length === 0) {
      console.error("Invalid board data in checkCollision", board);
      return true; // Assume collision for safety
    }
    
    // Using for loops for better readability
    for (let y = 0; y < player.tetromino.length; y++) {
      for (let x = 0; x < player.tetromino[y].length; x++) {
        // 1. Check that we're on a tetromino cell (has content)
        if (player.tetromino[y][x] !== 0) {
          const newY = y + player.pos.y + moveY;
          const newX = x + player.pos.x + moveX;
          
          // 2. Check if our move is outside the board boundaries
          if (newY < 0 || newY >= board.length || newX < 0 || newX >= board[0].length) {
            return true; // Out of bounds = collision
          }
          
          // 3. Check if there's already a piece at the target position (not empty)
          if (board[newY][newX] !== 0) {
            return true; // Cell is occupied = collision
          }
        }
      }
    }
    return false; // No collision detected
  } catch (error) {
    console.error("Error in checkCollision:", error);
    return true; // Assume collision on error for safety
  }
};

/**
 * Calculate score based on rows cleared and level
 */
export const calculateScore = (rowsCleared: number, level: number): number => {
  const scores = [0, 100, 300, 500, 800];
  return rowsCleared > 0 ? scores[rowsCleared] * level : 0;
};

/**
 * Check and sweep rows that are full
 */
export const sweepRows = (board: (string | 0 | 1 | 2)[][]): {
  newBoard: (string | 0 | 1 | 2)[][];
  rowsCleared: number;
} => {
  let rowsCleared = 0;
  const newBoard = board.reduce((acc, row) => {
    // If the row doesn't include any empty cells (0), clear it
    if (row.findIndex(cell => cell === 0) === -1) {
      rowsCleared += 1;
      // Add an empty row at the beginning
      acc.unshift(new Array(board[0].length).fill(0));
      return acc;
    }
    acc.push(row);
    return acc;
  }, [] as (string | 0 | 1 | 2)[][]);

  return { newBoard, rowsCleared };
};

/**
 * Rotate a tetromino matrix
 */
export const rotateMatrix = (matrix: TetrominoShape, clockwise = true): TetrominoShape => {
  // Make a copy of the matrix
  const rotatedMatrix = matrix.map(row => [...row]);
  
  // Transpose the matrix
  for (let y = 0; y < rotatedMatrix.length; y++) {
    for (let x = 0; x < y; x++) {
      [rotatedMatrix[x][y], rotatedMatrix[y][x]] = 
      [rotatedMatrix[y][x], rotatedMatrix[x][y]];
    }
  }
  
  // Reverse each row to get a clockwise rotation or reverse each column for counter-clockwise
  if (clockwise) {
    rotatedMatrix.forEach(row => row.reverse());
  } else {
    rotatedMatrix.reverse();
  }
  
  return rotatedMatrix;
};

/**
 * Calculate drop time based on level
 */
export const calculateDropTime = (level: number, initialDropTime: number, speedFactor: number): number => {
  return initialDropTime * Math.pow(speedFactor, level - 1);
};

/**
 * Format milliseconds to MM:SS format
 */
export const formatTime = (timeInMs: number): string => {
  const totalSeconds = Math.floor(timeInMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * Get next side index in a planet
 */
export const getNextSideIndex = (currentIndex: number, totalSides: number, clockwise = true): number => {
  if (clockwise) {
    return (currentIndex + 1) % totalSides;
  } else {
    return (currentIndex - 1 + totalSides) % totalSides;
  }
};

/**
 * Format a number score with commas
 */
export const formatScore = (score: number): string => {
  return score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
