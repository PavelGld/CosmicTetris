import { useState, useCallback } from 'react';
import { BOARD_HEIGHT, BOARD_WIDTH } from '../constants';
import { checkCollision, sweepRows } from '../utils';
import { TetrominoShape } from '../tetrominos';

type BoardType = (string | number)[][];

export const useGameBoard = () => {
  const [board, setBoard] = useState<BoardType>(() => 
    Array.from(Array(BOARD_HEIGHT + 5), () => 
      Array(BOARD_WIDTH).fill(0)
    )
  );
  
  // Reset the board
  const resetBoard = useCallback(() => {
    setBoard(Array.from(Array(BOARD_HEIGHT + 5), () => 
      Array(BOARD_WIDTH).fill(0)
    ));
  }, []);

  // Update board with the current tetromino
  const updateBoard = useCallback((prevBoard: BoardType, player: {
    pos: { x: number; y: number },
    tetromino: TetrominoShape,
    collided: boolean,
    color: string
  }) => {
    // First create a copy of the previous board
    const newBoard = [...prevBoard.map(row => [...row])];

    // Then draw the tetromino
    player.tetromino.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          newBoard[y + player.pos.y][x + player.pos.x] = 
            player.collided ? player.color : value;
        }
      });
    });

    // Check if player collided
    if (player.collided) {
      // Sweep the completed rows
      const { newBoard: sweptBoard, rowsCleared } = sweepRows(newBoard);
      return { board: sweptBoard, rowsCleared };
    }

    return { board: newBoard, rowsCleared: 0 };
  }, []);

  // Move the tetromino function for horizontal movement
  const moveTetromino = useCallback((player: {
    pos: { x: number; y: number },
    tetromino: TetrominoShape,
    collided: boolean
  }, dir: number, board: BoardType) => {
    // Check if movement would cause a collision
    if (
      !checkCollision(
        player,
        board,
        { x: dir, y: 0 }
      )
    ) {
      // Move the tetromino
      return { ...player, pos: { ...player.pos, x: player.pos.x + dir } };
    }
    return player;
  }, []);

  // Drop the tetromino one row
  const dropTetromino = useCallback((player: {
    pos: { x: number; y: number },
    tetromino: TetrominoShape,
    collided: boolean
  }, board: BoardType, instantDrop = false) => {
    // If it's an instant drop, drop until collision
    if (instantDrop) {
      let dropHeight = 0;
      while (!checkCollision(player, board, { x: 0, y: dropHeight + 1 })) {
        dropHeight += 1;
      }
      
      return {
        ...player,
        pos: { ...player.pos, y: player.pos.y + dropHeight },
        collided: true
      };
    }
    
    // Check if the next position would cause a collision
    if (!checkCollision(player, board, { x: 0, y: 1 })) {
      // Move the tetromino down
      return { ...player, pos: { ...player.pos, y: player.pos.y + 1 } };
    } else {
      // Collision detected, set collided to true
      return { ...player, collided: true };
    }
  }, []);

  // Rotate the tetromino
  const rotateTetromino = useCallback((player: {
    pos: { x: number; y: number },
    tetromino: TetrominoShape,
    collided: boolean
  }, board: BoardType, clockwise = true) => {
    // Create a deep copy of the tetromino
    const clonedTetromino = JSON.parse(JSON.stringify(player.tetromino)) as TetrominoShape;
    
    // Transpose the matrix
    for (let y = 0; y < clonedTetromino.length; y++) {
      for (let x = 0; x < y; x++) {
        [clonedTetromino[x][y], clonedTetromino[y][x]] = 
        [clonedTetromino[y][x], clonedTetromino[x][y]];
      }
    }
    
    // Reverse each row to get a clockwise rotation or reverse each column for counter-clockwise
    if (clockwise) {
      clonedTetromino.forEach(row => row.reverse());
    } else {
      clonedTetromino.reverse();
    }

    // Check for collisions with the rotated tetromino
    const posX = player.pos.x;
    const posY = player.pos.y;
    const rotatedPlayer = {
      ...player,
      tetromino: clonedTetromino
    };

    // Check normal position
    if (!checkCollision(rotatedPlayer, board, { x: 0, y: 0 })) {
      return rotatedPlayer;
    }

    // Wall kicks for I tetromino
    if (clonedTetromino.length === 4) {
      // Try to move left
      for (let offset = 1; offset <= 2; offset++) {
        if (!checkCollision(rotatedPlayer, board, { x: -offset, y: 0 })) {
          return {
            ...rotatedPlayer,
            pos: { ...rotatedPlayer.pos, x: posX - offset }
          };
        }
      }
      // Try to move right
      for (let offset = 1; offset <= 2; offset++) {
        if (!checkCollision(rotatedPlayer, board, { x: offset, y: 0 })) {
          return {
            ...rotatedPlayer,
            pos: { ...rotatedPlayer.pos, x: posX + offset }
          };
        }
      }
    } else {
      // Wall kicks for all other pieces
      // Try to move left
      if (!checkCollision(rotatedPlayer, board, { x: -1, y: 0 })) {
        return {
          ...rotatedPlayer,
          pos: { ...rotatedPlayer.pos, x: posX - 1 }
        };
      }
      // Try to move right
      if (!checkCollision(rotatedPlayer, board, { x: 1, y: 0 })) {
        return {
          ...rotatedPlayer,
          pos: { ...rotatedPlayer.pos, x: posX + 1 }
        };
      }
    }

    // If all else fails, return the original player
    return player;
  }, []);

  // Load a board from saved state
  const loadBoard = useCallback((savedBoard: BoardType) => {
    if (savedBoard && Array.isArray(savedBoard)) {
      setBoard(savedBoard);
    }
  }, []);

  return { 
    board,
    setBoard,
    resetBoard,
    updateBoard,
    moveTetromino,
    dropTetromino,
    rotateTetromino,
    loadBoard
  };
};
