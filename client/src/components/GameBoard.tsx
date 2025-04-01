import { useEffect, useCallback, useState } from 'react';
import { BOARD_WIDTH, BOARD_HEIGHT, HIDDEN_ROWS, CELL_SIZE, GamePhase, INITIAL_DROP_TIME, SOFT_DROP_FACTOR } from '@/game/constants';
import { useGameBoard } from '@/game/hooks/useGameBoard';
import { usePlayer } from '@/game/hooks/usePlayer';
import { useGameStatus } from '@/game/hooks/useGameStatus';
import { useInterval } from '@/game/hooks/useInterval';
import { checkCollision } from '@/game/utils';
import { useTetris } from '@/lib/stores/useTetris';
import { useKeyboard } from '@/lib/useKeyboard';
import { useLeaderboard } from '@/lib/stores/useLeaderboard';
import { useAudio } from '@/lib/stores/useAudio';

import Cell from './Cell';

const GameBoard: React.FC = () => {
  const [rowsCleared, setRowsCleared] = useState(0);
  const [dropTime, setDropTime] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(false);
  
  const {
    board,
    resetBoard,
    updateBoard,
    moveTetromino,
    dropTetromino,
    rotateTetromino
  } = useGameBoard();
  
  const {
    player,
    nextPiece,
    updatePlayerPos,
    resetPlayer,
    setPlayerState
  } = usePlayer();
  
  const {
    score,
    rows,
    level,
    gameTime,
    setDropTime: setGameDropTime,
    startGameTimer,
    stopGameTimer,
    addHardDropPoints,
    addSoftDropPoints,
    resetGameStatus,
    loadGameStatus
  } = useGameStatus(rowsCleared);
  
  const keyState = useKeyboard();
  const { playHit, playSuccess } = useAudio();
  
  // Get game state from tetris store
  const gamePhase = useTetris(state => state.gamePhase);
  const currentSide = useTetris(state => state.currentSide);
  const allSides = useTetris(state => state.allSides);
  const updateSide = useTetris(state => state.updateSide);
  const setGamePhase = useTetris(state => state.setGamePhase);
  const { addEntry } = useLeaderboard();
  
  // Start the game
  useEffect(() => {
    // Initialize game
    if (gamePhase === GamePhase.PLAYING) {
      // Check if there's saved data for this side
      const sideData = allSides[currentSide];
      
      if (sideData && sideData.board && sideData.board.length > 0) {
        // Load the saved state
        setGameOver(sideData.gameOver);
        updateBoard(sideData.board, {
          pos: sideData.player.pos,
          tetromino: sideData.player.tetromino,
          collided: sideData.player.collided,
          color: sideData.player.color
        });
        
        // Cast the nextPiece to Tetromino type for compatibility with strict typing
        const typedNextPiece = {
          ...sideData.nextPiece,
          type: sideData.nextPiece.type as any
        };
        
        setPlayerState(sideData.player, typedNextPiece);
        loadGameStatus(sideData.gameStatus);
        
        // Start the game timer and droptime if the game is not over
        if (!sideData.gameOver) {
          startGameTimer();
          setDropTime(INITIAL_DROP_TIME);
        }
      } else {
        // Start a new game for this side
        resetBoard();
        resetPlayer();
        resetGameStatus();
        setGameOver(false);
        startGameTimer();
        setDropTime(INITIAL_DROP_TIME);
      }
    } else {
      // Pause the game
      stopGameTimer();
      setDropTime(null);
    }
  }, [gamePhase, currentSide, allSides]);
  
  // Save the current side's state
  useEffect(() => {
    if (gamePhase === GamePhase.PLAYING || gamePhase === GamePhase.PAUSED) {
      updateSide({
        id: currentSide,
        board,
        player,
        nextPiece,
        gameStatus: {
          score,
          rows,
          level,
          gameTime
        },
        gameOver
      });
    }
  }, [
    gamePhase,
    currentSide,
    board,
    player,
    nextPiece,
    score,
    rows,
    level,
    gameTime,
    gameOver,
    updateSide
  ]);
  
  // Drop the tetromino automatically
  useInterval(() => {
    drop();
  }, dropTime);
  
  // Calculate next position on drop
  const drop = useCallback(() => {
    if (gameOver) return;
    
    // Add point for soft drop if down key is pressed
    if (keyState.ArrowDown || keyState.KeyS) {
      addSoftDropPoints();
    }
    
    const updatedPlayer = dropTetromino(player, board);
    
    // If the player collided, check if game is over
    if (updatedPlayer.collided) {
      playHit();
      
      // Check if collision happened above the visible area (game over)
      if (updatedPlayer.pos.y < HIDDEN_ROWS) {
        console.log("GAME OVER");
        setGameOver(true);
        setDropTime(null);
        stopGameTimer();
        setGamePhase(GamePhase.GAME_OVER);
        
        // Add to leaderboard
        const { playerName, planetSides } = useTetris.getState();
        addEntry({
          playerName,
          score,
          level,
          rows,
          planetSides,
        });
        
        return;
      }
      
      // Generate new player with next tetromino
      resetPlayer();
    }
    
    // Update the game board
    const { board: newBoard, rowsCleared: clearedRows } = updateBoard(board, {
      ...updatedPlayer, 
      color: player.color
    });
    
    // If rows were cleared
    if (clearedRows > 0) {
      setRowsCleared(clearedRows);
      playSuccess();
    }
    
    // Update the player position
    updatePlayerPos({
      x: 0,
      y: 0,
      collided: updatedPlayer.collided
    });
  }, [
    gameOver,
    player,
    board,
    keyState.ArrowDown,
    keyState.KeyS,
    dropTetromino,
    updateBoard,
    updatePlayerPos,
    resetPlayer,
    addSoftDropPoints,
    setGamePhase,
    stopGameTimer,
    playHit,
    playSuccess
  ]);
  
  // Move the tetromino horizontally
  const movePlayer = useCallback((dir: number) => {
    if (gameOver || gamePhase !== GamePhase.PLAYING) return;
    
    const updatedPlayer = moveTetromino(player, dir, board);
    
    // If the player was able to move, update position
    if (updatedPlayer !== player) {
      updatePlayerPos({ 
        x: updatedPlayer.pos.x - player.pos.x, 
        y: 0, 
        collided: false 
      });
    }
  }, [gameOver, gamePhase, player, board, moveTetromino, updatePlayerPos]);
  
  // Rotate the tetromino
  const rotate = useCallback(() => {
    if (gameOver || gamePhase !== GamePhase.PLAYING) return;
    
    const rotatedPlayer = rotateTetromino(player, board);
    
    // If rotation was successful
    if (rotatedPlayer !== player) {
      updatePlayerPos({
        x: rotatedPlayer.pos.x - player.pos.x,
        y: 0,
        collided: false
      });
    }
  }, [gameOver, gamePhase, player, board, rotateTetromino, updatePlayerPos]);
  
  // Hard drop the tetromino
  const hardDrop = useCallback(() => {
    if (gameOver || gamePhase !== GamePhase.PLAYING) return;
    
    try {
      // Calculate drop distance with a safety limit to prevent infinite loops
      let dropDistance = 0;
      const maxDistance = BOARD_HEIGHT + HIDDEN_ROWS;
      
      while (
        dropDistance < maxDistance && 
        !checkCollision(player, board, { x: 0, y: dropDistance + 1 })
      ) {
        dropDistance += 1;
      }
      
      console.log("Hard drop distance:", dropDistance);
      
      // Add points for hard drop (only if we actually moved)
      if (dropDistance > 0) {
        addHardDropPoints(dropDistance);
      }
      
      // Check if dropping would cause immediate game over
      const newY = player.pos.y + dropDistance;
      const wouldCauseGameOver = newY < HIDDEN_ROWS && dropDistance > 0;
      
      if (wouldCauseGameOver) {
        console.log("Hard drop would cause game over");
        // Just do a normal drop instead to let the game over logic handle it normally
        updatePlayerPos({
          x: 0,
          y: 1,
          collided: false
        });
      } else {
        // Update player position normally
        updatePlayerPos({
          x: 0,
          y: dropDistance,
          collided: dropDistance > 0 // Only set collided if we actually moved
        });
      }
    } catch (error) {
      console.error("Error in hardDrop:", error);
    }
  }, [gameOver, gamePhase, player, board, updatePlayerPos, addHardDropPoints]);
  
  // Soft drop the tetromino
  const softDrop = useCallback(() => {
    if (gameOver || gamePhase !== GamePhase.PLAYING) return;
    
    // Increase drop speed
    setDropTime(INITIAL_DROP_TIME * SOFT_DROP_FACTOR * Math.pow(0.75, level - 1));
  }, [gameOver, gamePhase, level]);
  
  // Reset drop speed after soft drop
  const resetDropTime = useCallback(() => {
    if (gameOver || gamePhase !== GamePhase.PLAYING) return;
    
    // Set back to normal speed
    setDropTime(INITIAL_DROP_TIME * Math.pow(0.75, level - 1));
  }, [gameOver, gamePhase, level]);
  
  // Keyboard controls
  useEffect(() => {
    if (gamePhase !== GamePhase.PLAYING) return;
    
    // Handle left movement
    if (keyState.ArrowLeft || keyState.KeyA) {
      movePlayer(-1);
    }
    
    // Handle right movement
    if (keyState.ArrowRight || keyState.KeyD) {
      movePlayer(1);
    }
    
    // Handle rotation (up arrow)
    if (keyState.ArrowUp || keyState.KeyW) {
      rotate();
    }
    
    // Handle soft drop (down arrow)
    if (keyState.ArrowDown || keyState.KeyS) {
      softDrop();
    } else {
      resetDropTime();
    }
    
    // Handle hard drop (space)
    if (keyState.Space) {
      hardDrop();
    }
  }, [
    gamePhase,
    keyState,
    movePlayer,
    rotate,
    softDrop,
    resetDropTime,
    hardDrop
  ]);
  
  // Board display dimensions
  const boardWidth = BOARD_WIDTH * CELL_SIZE;
  const boardHeight = BOARD_HEIGHT * CELL_SIZE;
  
  const visibleRows = board.slice(HIDDEN_ROWS);
  
  // Debug: Log the game board state and player position
  console.log("Player position:", player.pos);
  console.log("Player tetromino:", player.tetromino);
  console.log("Player color:", player.color);
  console.log("Sample board cells:", board[player.pos.y][player.pos.x], board[player.pos.y][player.pos.x+1]);
  
  return (
    <div
      style={{
        width: `${boardWidth}px`,
        height: `${boardHeight}px`,
        background: 'rgba(0, 0, 0, 0.8)',
        border: '2px solid rgb(168, 85, 247)',
        borderRadius: '4px',
        position: 'relative',
        display: 'grid',
        gridTemplateRows: `repeat(${BOARD_HEIGHT}, ${CELL_SIZE}px)`,
        gridTemplateColumns: `repeat(${BOARD_WIDTH}, ${CELL_SIZE}px)`,
        overflow: 'hidden'
      }}
    >
      {visibleRows.map((row, y) =>
        row.map((cell, x) => (
          <Cell 
            key={`${y}-${x}`} 
            type={cell} 
          />
        ))
      )}
    </div>
  );
};

export default GameBoard;
