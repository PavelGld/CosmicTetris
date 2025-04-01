// Game dimensions
export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;
export const HIDDEN_ROWS = 5;
export const CELL_SIZE = 30;

// Game timing (in milliseconds)
export const INITIAL_DROP_TIME = 1000;
export const MIN_DROP_TIME = 50; // fastest drop time
export const SOFT_DROP_FACTOR = 0.1; // Multiply by this for soft drop speed

// Level progression
export const ROWS_PER_LEVEL = 10;
export const LEVEL_SPEED_FACTOR = 0.75; // Multiply drop time by this factor for each level

// Scoring system
export const POINTS = {
  SINGLE: 100,   // 1 row
  DOUBLE: 300,   // 2 rows
  TRIPLE: 500,   // 3 rows
  TETRIS: 800,   // 4 rows (full tetris)
  SOFT_DROP: 1,  // Points per cell for soft drop
  HARD_DROP: 2   // Points per cell for hard drop
};

// Planet sides limit
export const MIN_SIDES = 3;
export const MAX_SIDES = 8;

// Local storage keys
export const STORAGE_KEYS = {
  GAME_STATE: 'tetris_game_state',
  PLAYER_NAME: 'tetris_player_name',
  PLANET_SIDES: 'tetris_planet_sides',
  LEADERBOARD: 'tetris_leaderboard'
};

// Colors for tetrominos
export const COLORS = {
  I: '#00FFFF', // Cyan
  O: '#FFFF00', // Yellow
  T: '#9900FF', // Purple
  L: '#FF9900', // Orange
  J: '#0000FF', // Blue
  S: '#00FF00', // Green
  Z: '#FF0000'  // Red
};

// Game phases
export enum GamePhase {
  START = 'start',
  PLAYING = 'playing',
  PAUSED = 'paused',
  GAME_OVER = 'game_over',
  PLANET_VIEW = 'planet_view'
}
