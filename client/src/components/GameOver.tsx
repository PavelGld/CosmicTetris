import { useTetris } from '@/lib/stores/useTetris';
import { useLeaderboard } from '@/lib/stores/useLeaderboard';
import { formatScore } from '@/game/utils';
import { Button } from '@/components/ui/button';
import { GamePhase } from '@/game/constants';

interface GameOverProps {
  sideId: number;
}

const GameOver: React.FC<GameOverProps> = ({ sideId }) => {
  const { allSides, resetAllSides, setGamePhase } = useTetris();
  const { entries } = useLeaderboard();
  
  const currentSide = allSides[sideId];
  
  if (!currentSide || !currentSide.gameStatus) {
    return null;
  }
  
  const { score, level, rows } = currentSide.gameStatus;
  
  // Calculate total score across all sides
  const totalScore = allSides.reduce((sum, side) => {
    return sum + (side?.gameStatus?.score || 0);
  }, 0);
  
  // Get player's position on the leaderboard
  const playerPosition = entries.findIndex(entry => entry.score === totalScore) + 1;
  const isTopScore = playerPosition === 1;
  
  const restartGame = () => {
    resetAllSides();
    setGamePhase(GamePhase.PLAYING);
  };
  
  const backToMenu = () => {
    setGamePhase(GamePhase.START);
  };
  
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-black border-2 border-purple-500 rounded-lg p-6 w-full max-w-md text-white">
        <h2 className="text-2xl font-bold text-center mb-4">Game Over!</h2>
        
        {isTopScore && (
          <div className="bg-yellow-700/30 border border-yellow-500 rounded-md p-3 mb-4 text-center">
            <h3 className="text-lg font-bold text-yellow-300">New High Score!</h3>
          </div>
        )}
        
        <div className="bg-gray-900/70 rounded-md p-4 mb-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-gray-400 text-sm">Side Score:</p>
              <p className="font-mono text-lg">{formatScore(score)}</p>
            </div>
            
            <div>
              <p className="text-gray-400 text-sm">Total Score:</p>
              <p className="font-mono text-lg">{formatScore(totalScore)}</p>
            </div>
            
            <div>
              <p className="text-gray-400 text-sm">Level:</p>
              <p className="font-mono">{level}</p>
            </div>
            
            <div>
              <p className="text-gray-400 text-sm">Rows Cleared:</p>
              <p className="font-mono">{rows}</p>
            </div>
          </div>
          
          {playerPosition <= 10 && (
            <div className="mt-3 text-center">
              <p className="text-gray-400 text-sm">Leaderboard Position</p>
              <p className="font-bold text-xl">{playerPosition.toString().padStart(2, '0')}</p>
            </div>
          )}
        </div>
        
        <div className="flex gap-3">
          <Button onClick={restartGame} className="flex-1">
            Play Again
          </Button>
          <Button onClick={backToMenu} variant="outline" className="flex-1">
            Back to Menu
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GameOver;
