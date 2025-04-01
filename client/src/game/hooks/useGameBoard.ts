import { useState, useCallback } from 'react';
import { BOARD_HEIGHT, BOARD_WIDTH } from '../constants';
import { checkCollision, sweepRows } from '../utils';
import { TetrominoShape } from '../tetrominos';

type BoardType = (string | 0 | 1 | 2)[][];

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
    try {
      // Safety check for invalid player data
      if (!player || !player.tetromino || !Array.isArray(player.tetromino) || player.tetromino.length === 0) {
        console.error("Invalid player data in updateBoard", player);
        return { board: prevBoard, rowsCleared: 0 }; // Return original board for safety
      }
      
      // Safety check for invalid board
      if (!prevBoard || !Array.isArray(prevBoard) || prevBoard.length === 0) {
        console.error("Invalid board data in updateBoard", prevBoard);
        return { board: prevBoard, rowsCleared: 0 }; // Return original board for safety
      }
      
      // Safety check for missing color
      const safeColor = player.color && player.color.trim() !== '' 
        ? player.color 
        : '#888888'; // Default color if none provided
      
      console.log("Updating board with player:", { 
        pos: player.pos,
        tetrominoSize: player.tetromino.length + 'x' + player.tetromino[0].length,
        color: safeColor,
        collided: player.collided
      });

      // First, create a clean board that only contains the settled pieces
      // (remove any non-collided tetromino blocks from previous frame)
      const cleanBoard = prevBoard.map(row => 
        row.map(cell => (typeof cell === 'string' ? cell : 0))
      ) as BoardType;

      // Then draw the current tetromino on the clean board
      const newBoard = [...cleanBoard.map(row => [...row])] as BoardType;
      
      // Loop through the tetromino shape and draw it on the board
      for (let y = 0; y < player.tetromino.length; y++) {
        for (let x = 0; x < player.tetromino[y].length; x++) {
          // Only draw if the tetromino cell is not empty
          if (player.tetromino[y][x] !== 0) {
            const boardY = y + player.pos.y;
            const boardX = x + player.pos.x;
            
            // Make sure we don't draw outside the board
            if (
              boardY >= 0 && 
              boardY < newBoard.length && 
              boardX >= 0 && 
              boardX < newBoard[0].length
            ) {
              // Always use the color for consistency
              newBoard[boardY][boardX] = safeColor;
            }
          }
        }
      }

      // Check if player collided
      if (player.collided) {
        // Sweep the completed rows
        const { newBoard: sweptBoard, rowsCleared } = sweepRows(newBoard);
        setBoard(sweptBoard); // Immediately update the board state
        return { board: sweptBoard, rowsCleared };
      }

      setBoard(newBoard); // Immediately update the board state
      return { board: newBoard, rowsCleared: 0 };
    } catch (error) {
      console.error("Error in updateBoard:", error);
      return { board: prevBoard, rowsCleared: 0 };
    }
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
    try {
      // Safety check for invalid player data
      if (!player || !player.tetromino || !Array.isArray(player.tetromino) || player.tetromino.length === 0) {
        console.error("Invalid player data in dropTetromino", player);
        return { ...player, collided: true }; // Stop movement for safety
      }
      
      // Safety check for invalid board
      if (!board || !Array.isArray(board) || board.length === 0) {
        console.error("Invalid board data in dropTetromino", board);
        return { ...player, collided: true }; // Stop movement for safety
      }
    
      // If it's an instant drop, drop until collision
      if (instantDrop) {
        let dropHeight = 0;
        const maxSafeDistance = Math.min(
          board.length - player.pos.y - 1, // Don't go beyond board height
          board.length // Hard safety limit
        );
        
        while (
          dropHeight < maxSafeDistance && 
          !checkCollision(player, board, { x: 0, y: dropHeight + 1 })
        ) {
          dropHeight += 1;
        }
        
        console.log(`Instant drop height: ${dropHeight}, from y=${player.pos.y} to y=${player.pos.y + dropHeight}`);
        
        return {
          ...player,
          pos: { ...player.pos, y: player.pos.y + dropHeight },
          collided: dropHeight > 0 // Only mark as collided if we actually moved
        };
      }
      
      // Regular drop - check if the next position would cause a collision
      if (!checkCollision(player, board, { x: 0, y: 1 })) {
        // Make sure we're not going beyond board boundaries
        const newY = player.pos.y + 1;
        if (newY < board.length) {
          // Move the tetromino down
          return { ...player, pos: { ...player.pos, y: newY } };
        } else {
          // Beyond board boundaries, stop movement
          console.warn("Tried to move beyond board bottom boundary");
          return { ...player, collided: true };
        }
      } else {
        // Collision detected, set collided to true
        return { ...player, collided: true };
      }
    } catch (error) {
      console.error("Error in dropTetromino:", error);
      return { ...player, collided: true }; // Stop movement on error for safety
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
