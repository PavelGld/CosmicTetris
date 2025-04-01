import { useState, useEffect, useCallback } from 'react';
import { ROWS_PER_LEVEL, POINTS, INITIAL_DROP_TIME, LEVEL_SPEED_FACTOR } from '../constants';
import { calculateDropTime } from '../utils';

export const useGameStatus = (rowsCleared: number) => {
  const [score, setScore] = useState(0);
  const [rows, setRows] = useState(0);
  const [level, setLevel] = useState(1);
  const [dropTime, setDropTime] = useState(INITIAL_DROP_TIME);
  const [gameTime, setGameTime] = useState(0);
  const [gameTimer, setGameTimer] = useState<number | null>(null);

  // Calculate scores
  useEffect(() => {
    if (rowsCleared > 0) {
      // Calculate score based on rows cleared
      let rowPoints = 0;
      switch (rowsCleared) {
        case 1:
          rowPoints = POINTS.SINGLE;
          break;
        case 2:
          rowPoints = POINTS.DOUBLE;
          break;
        case 3:
          rowPoints = POINTS.TRIPLE;
          break;
        case 4:
          rowPoints = POINTS.TETRIS;
          break;
        default:
          rowPoints = 0;
      }
      
      // Multiply by level
      setScore(prev => prev + rowPoints * level);
      setRows(prev => prev + rowsCleared);
    }
  }, [rowsCleared, level]);

  // Increase level when rows threshold is reached
  useEffect(() => {
    if (rows >= level * ROWS_PER_LEVEL) {
      setLevel(prev => prev + 1);
      // Decrease drop time as level increases
      setDropTime(calculateDropTime(level + 1, INITIAL_DROP_TIME, LEVEL_SPEED_FACTOR));
    }
  }, [rows, level]);

  // Game timer
  useEffect(() => {
    if (gameTimer) {
      const timerId = setInterval(() => {
        setGameTime(prev => prev + 1000); // Add 1 second
      }, 1000);
      
      return () => clearInterval(timerId);
    }
    
    return undefined;
  }, [gameTimer]);

  // Start the game timer
  const startGameTimer = useCallback(() => {
    setGameTimer(1);
  }, []);
  
  // Stop the game timer
  const stopGameTimer = useCallback(() => {
    setGameTimer(null);
  }, []);
  
  // Add points for hard drop
  const addHardDropPoints = useCallback((dropDistance: number) => {
    setScore(prev => prev + (dropDistance * POINTS.HARD_DROP));
  }, []);
  
  // Add points for soft drop
  const addSoftDropPoints = useCallback(() => {
    setScore(prev => prev + POINTS.SOFT_DROP);
  }, []);
  
  // Reset the game status
  const resetGameStatus = useCallback(() => {
    setScore(0);
    setRows(0);
    setLevel(1);
    setDropTime(INITIAL_DROP_TIME);
    setGameTime(0);
    setGameTimer(null);
  }, []);

  // Load game status from saved state
  const loadGameStatus = useCallback((savedStatus: {
    score: number;
    rows: number;
    level: number;
    gameTime: number;
  }) => {
    setScore(savedStatus.score || 0);
    setRows(savedStatus.rows || 0);
    setLevel(savedStatus.level || 1);
    setGameTime(savedStatus.gameTime || 0);
    setDropTime(calculateDropTime(savedStatus.level || 1, INITIAL_DROP_TIME, LEVEL_SPEED_FACTOR));
  }, []);

  return { 
    score, 
    setScore, 
    rows, 
    level, 
    dropTime, 
    setDropTime,
    gameTime,
    startGameTimer,
    stopGameTimer,
    addHardDropPoints,
    addSoftDropPoints,
    resetGameStatus,
    loadGameStatus
  };
};
