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
  const [player, setPlayer] = useState<PlayerState>({
    pos: { x: 0, y: 0 },
    tetromino: [[0]],
    collided: false,
    color: '',
    type: ''
  });
  
  const [nextPiece, setNextPiece] = useState<Tetromino>(getRandomTetromino());

  // Function to reset the player
  const resetPlayer = useCallback(() => {
    const newTetromino = nextPiece;
    setNextPiece(getRandomTetromino());
    
    setPlayer({
      pos: { 
        x: Math.floor(BOARD_WIDTH / 2) - Math.floor(newTetromino.shape[0].length / 2),
        y: 0 
      },
      tetromino: newTetromino.shape,
      collided: false,
      color: newTetromino.color,
      type: newTetromino.type
    });
  }, [nextPiece]);

  // Function to update the player position
  const updatePlayerPos = useCallback(({ x, y, collided }: { x: number; y: number; collided: boolean }) => {
    setPlayer(prev => ({
      ...prev,
      pos: { x: (prev.pos.x + x), y: (prev.pos.y + y) },
      collided
    }));
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
