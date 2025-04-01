import { create } from 'zustand';
import { STORAGE_KEYS } from '@/game/constants';
import { getLocalStorage, setLocalStorage } from '@/lib/utils';

export interface LeaderboardEntry {
  playerName: string;
  score: number;
  level: number;
  rows: number;
  planetSides: number;
  date: string;
}

interface LeaderboardState {
  entries: LeaderboardEntry[];
  addEntry: (entry: Omit<LeaderboardEntry, 'date'>) => void;
  getTopEntries: (limit?: number) => LeaderboardEntry[];
  clearLeaderboard: () => void;
  loadLeaderboard: () => void;
}

export const useLeaderboard = create<LeaderboardState>((set, get) => ({
  entries: [],
  
  // Add a new entry to the leaderboard
  addEntry: (entry) => {
    const { entries } = get();
    
    // Create a new entry with the current date
    const newEntry: LeaderboardEntry = {
      ...entry,
      date: new Date().toISOString()
    };
    
    // Add the new entry and sort by score (descending)
    const updatedEntries = [...entries, newEntry].sort((a, b) => b.score - a.score);
    
    // Update state
    set({ entries: updatedEntries });
    
    // Save to localStorage
    setLocalStorage(STORAGE_KEYS.LEADERBOARD, updatedEntries);
  },
  
  // Get top N entries
  getTopEntries: (limit = 10) => {
    const { entries } = get();
    return entries.slice(0, limit);
  },
  
  // Clear the leaderboard
  clearLeaderboard: () => {
    set({ entries: [] });
    setLocalStorage(STORAGE_KEYS.LEADERBOARD, []);
  },
  
  // Load leaderboard from localStorage
  loadLeaderboard: () => {
    const savedEntries = getLocalStorage(STORAGE_KEYS.LEADERBOARD);
    
    if (savedEntries && Array.isArray(savedEntries)) {
      set({ entries: savedEntries });
    }
  }
}));
