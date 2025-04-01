import { useEffect } from 'react';
import { useTetris } from '@/lib/stores/useTetris';
import { formatScore, formatTime } from '@/game/utils';

const GameStats: React.FC = () => {
  const allSides = useTetris(state => state.allSides);
  const currentSide = useTetris(state => state.currentSide);
  const planetSides = useTetris(state => state.planetSides);
  
  // Get current side data
  const sideData = allSides[currentSide];
  
  // Calculate total score across all sides
  const totalScore = allSides.reduce((sum, side) => {
    return sum + (side?.gameStatus?.score || 0);
  }, 0);
  
  if (!sideData || !sideData.gameStatus) {
    return (
      <div className="bg-gray-900/50 p-3 rounded border border-gray-700">
        <p>Loading stats...</p>
      </div>
    );
  }
  
  const { score, level, rows, gameTime } = sideData.gameStatus;
  
  return (
    <div className="bg-gray-900/50 p-3 rounded border border-gray-700">
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <p className="text-gray-400">Score:</p>
          <p className="font-mono text-xl">{formatScore(score)}</p>
        </div>
        
        <div>
          <p className="text-gray-400">Total Score:</p>
          <p className="font-mono text-xl">{formatScore(totalScore)}</p>
        </div>
        
        <div>
          <p className="text-gray-400">Level:</p>
          <p className="font-mono">{level}</p>
        </div>
        
        <div>
          <p className="text-gray-400">Rows:</p>
          <p className="font-mono">{rows}</p>
        </div>
        
        <div>
          <p className="text-gray-400">Time:</p>
          <p className="font-mono">{formatTime(gameTime)}</p>
        </div>
        
        <div>
          <p className="text-gray-400">Side:</p>
          <p className="font-mono">{currentSide + 1}/{planetSides}</p>
        </div>
      </div>
    </div>
  );
};

export default GameStats;
