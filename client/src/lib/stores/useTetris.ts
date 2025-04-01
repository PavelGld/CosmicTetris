import { create } from 'zustand';
import { GamePhase, STORAGE_KEYS } from '@/game/constants';
import { getLocalStorage, setLocalStorage } from '@/lib/utils';

export interface PlanetSide {
  id: number;
  board: (string | number)[][];
  player: {
    pos: { x: number; y: number };
    tetromino: (0 | 1 | 2)[][];
    collided: boolean;
    color: string;
    type: string;
  };
  nextPiece: {
    type: string;
    shape: (0 | 1 | 2)[][];
    color: string;
  };
  gameStatus: {
    score: number;
    rows: number;
    level: number;
    gameTime: number;
  };
  gameOver: boolean;
}

interface TetrisState {
  playerName: string;
  planetSides: number;
  currentSide: number;
  gamePhase: GamePhase;
  allSides: PlanetSide[];
  
  // Actions
  setPlayerName: (name: string) => void;
  setPlanetSides: (sides: number) => void;
  setCurrentSide: (side: number) => void;
  setGamePhase: (phase: GamePhase) => void;
  
  // Planet side management
  updateSide: (side: PlanetSide) => void;
  resetAllSides: () => void;
  
  // Persistence
  saveGame: () => void;
  loadGame: () => boolean;
}

export const useTetris = create<TetrisState>((set, get) => ({
  playerName: '',
  planetSides: 4,
  currentSide: 0,
  gamePhase: GamePhase.START,
  allSides: [],
  
  setPlayerName: (name: string) => {
    set({ playerName: name });
    setLocalStorage(STORAGE_KEYS.PLAYER_NAME, name);
  },
  
  setPlanetSides: (sides: number) => {
    set({ planetSides: sides });
    setLocalStorage(STORAGE_KEYS.PLANET_SIDES, sides);
    
    // Initialize all sides
    const allSides: PlanetSide[] = [];
    for (let i = 0; i < sides; i++) {
      allSides.push({
        id: i,
        board: Array.from(Array(25), () => Array(10).fill(0)),
        player: {
          pos: { x: 0, y: 0 },
          tetromino: [[0]],
          collided: false,
          color: '',
          type: ''
        },
        nextPiece: {
          type: '',
          shape: [[0]],
          color: ''
        },
        gameStatus: {
          score: 0,
          rows: 0,
          level: 1,
          gameTime: 0
        },
        gameOver: false
      });
    }
    
    set({ allSides });
  },
  
  setCurrentSide: (side: number) => {
    const { planetSides } = get();
    if (side >= 0 && side < planetSides) {
      set({ currentSide: side });
    }
  },
  
  setGamePhase: (phase: GamePhase) => {
    set({ gamePhase: phase });
  },
  
  updateSide: (side: PlanetSide) => {
    const { allSides } = get();
    const newSides = [...allSides];
    const index = newSides.findIndex(s => s.id === side.id);
    
    if (index !== -1) {
      newSides[index] = { ...side };
      set({ allSides: newSides });
    }
  },
  
  resetAllSides: () => {
    const { planetSides } = get();
    
    // Re-initialize all sides
    const allSides: PlanetSide[] = [];
    for (let i = 0; i < planetSides; i++) {
      allSides.push({
        id: i,
        board: Array.from(Array(25), () => Array(10).fill(0)),
        player: {
          pos: { x: 0, y: 0 },
          tetromino: [[0]],
          collided: false,
          color: '',
          type: ''
        },
        nextPiece: {
          type: '',
          shape: [[0]],
          color: ''
        },
        gameStatus: {
          score: 0,
          rows: 0,
          level: 1,
          gameTime: 0
        },
        gameOver: false
      });
    }
    
    set({ allSides, gamePhase: GamePhase.START });
  },
  
  saveGame: () => {
    const { playerName, planetSides, currentSide, allSides, gamePhase } = get();
    
    const gameState = {
      playerName,
      planetSides,
      currentSide,
      allSides,
      gamePhase
    };
    
    setLocalStorage(STORAGE_KEYS.GAME_STATE, gameState);
  },
  
  loadGame: () => {
    const savedState = getLocalStorage(STORAGE_KEYS.GAME_STATE);
    
    if (savedState) {
      const { playerName, planetSides, currentSide, allSides, gamePhase } = savedState;
      
      set({
        playerName,
        planetSides,
        currentSide,
        allSides,
        gamePhase
      });
      
      return true;
    }
    
    return false;
  }
}));
