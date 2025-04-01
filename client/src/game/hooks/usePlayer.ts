import { useState, useCallback } from 'react';
import { BOARD_WIDTH } from '../constants';
import { getRandomTetromino, Tetromino, TetrominoShape } from '../tetrominos';

interface PlayerState {
  pos: {
    x: number;
    y: number;
  };
  tetromino: TetrominoShape;
  collided: boolean;
  color: string;
  type: string; // Note: This should match TetrominoType, but we're keeping it as string for backward compatibility
}

export const usePlayer = () => {
  // Get a valid initial tetromino
  const getInitialTetromino = (): Tetromino => {
    try {
      const tetromino = getRandomTetromino();
      
      // Verify that we have a valid tetromino with shape
      if (!tetromino || !tetromino.shape || !Array.isArray(tetromino.shape) || tetromino.shape.length === 0) {
        console.error("Invalid initial tetromino, fallback to default T piece");
        return {
          type: 'T',
          shape: [
            [0, 1, 0],
            [1, 1, 1],
            [0, 0, 0]
          ] as TetrominoShape,
          color: '#9900FF' // Purple
        };
      }
      
      return tetromino;
    } catch (error) {
      console.error("Error generating initial tetromino:", error);
      return {
        type: 'T',
        shape: [
          [0, 1, 0],
          [1, 1, 1],
          [0, 0, 0]
        ] as TetrominoShape,
        color: '#9900FF' // Purple
      };
    }
  };
  
  // Initialize with a random tetromino for a proper initial state
  const initialTetromino = getInitialTetromino();
  console.log("Initial tetromino:", initialTetromino.type, initialTetromino.shape);
  
  const [player, setPlayer] = useState<PlayerState>({
    pos: { 
      x: Math.floor(BOARD_WIDTH / 2) - Math.floor(initialTetromino.shape[0].length / 2),
      y: 0 
    },
    tetromino: JSON.parse(JSON.stringify(initialTetromino.shape)), // Use deep copy to avoid reference issues
    collided: false,
    color: initialTetromino.color,
    type: initialTetromino.type
  });
  
  // Next piece with the same validation
  const [nextPiece, setNextPiece] = useState<Tetromino>(getInitialTetromino());

  // Function to reset the player
  const resetPlayer = useCallback(() => {
    try {
      // Check if next piece is valid
      let validNextPiece = nextPiece;
      
      // Validate the nextPiece - make sure it has a valid shape
      if (!validNextPiece || 
          !validNextPiece.shape || 
          !Array.isArray(validNextPiece.shape) || 
          validNextPiece.shape.length === 0 ||
          !validNextPiece.color) {
        console.warn("Invalid next piece detected. Generating new tetromino.");
        validNextPiece = getRandomTetromino();
      }
      
      // Generate new next piece
      setNextPiece(getRandomTetromino());
      
      // Calculate initial X position based on tetromino width
      const tetrominoWidth = validNextPiece.shape[0].length;
      const initialX = Math.floor(BOARD_WIDTH / 2) - Math.floor(tetrominoWidth / 2);
      
      console.log(`Resetting player with tetromino type: ${validNextPiece.type}, shape: ${validNextPiece.shape.length}x${tetrominoWidth}, color: ${validNextPiece.color}`);
      
      // Set player with a deep copy of the tetromino shape to avoid reference issues
      setPlayer({
        pos: { 
          x: initialX,
          y: 0 
        },
        tetromino: JSON.parse(JSON.stringify(validNextPiece.shape)),
        collided: false,
        color: validNextPiece.color,
        type: validNextPiece.type
      });
    } catch (error) {
      console.error("Error in resetPlayer:", error);
      // Fallback to a default tetromino
      const defaultTetromino = {
        type: 'T',
        shape: [
          [0, 1, 0],
          [1, 1, 1],
          [0, 0, 0]
        ] as TetrominoShape,
        color: '#9900FF' // Purple
      };
      
      setNextPiece(getRandomTetromino());
      
      setPlayer({
        pos: { 
          x: Math.floor(BOARD_WIDTH / 2) - 1, // Default T piece is 3 wide
          y: 0 
        },
        tetromino: defaultTetromino.shape,
        collided: false,
        color: defaultTetromino.color,
        type: defaultTetromino.type
      });
    }
  }, [nextPiece]);

  // Function to update the player position with boundary checks
  const updatePlayerPos = useCallback(({ x, y, collided }: { x: number; y: number; collided: boolean }) => {
    setPlayer(prev => {
      // Calculate new position
      const newX = prev.pos.x + x;
      const newY = Math.min(prev.pos.y + y, BOARD_WIDTH * 2); // Set a reasonable maximum for Y to prevent overflow
      
      // Apply the changes with boundary checks
      return {
        ...prev,
        pos: { 
          x: newX, 
          y: newY 
        },
        collided
      };
    });
  }, []);

  // Update the player's tetromino (for rotations)
  const updatePlayerTetromino = useCallback((newTetromino: TetrominoShape) => {
    setPlayer(prev => ({
      ...prev,
      tetromino: newTetromino
    }));
  }, []);

  // Set the player directly (for loading saved state)
  const setPlayerState = useCallback((playerState: PlayerState, newNextPiece: Tetromino) => {
    setPlayer(playerState);
    setNextPiece(newNextPiece);
  }, []);

  return { 
    player, 
    nextPiece, 
    updatePlayerPos, 
    updatePlayerTetromino, 
    resetPlayer,
    setPlayerState
  };
};
