import { useState, useEffect } from 'react';
import { MIN_SIDES, MAX_SIDES, GamePhase } from '@/game/constants';
import { useTetris } from '@/lib/stores/useTetris';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import Leaderboard from './Leaderboard';
import { useAudio } from '@/lib/stores/useAudio';
import Polygon2D from './Polygon2D';

interface StartScreenProps {
  hasLoadedGame: boolean;
}

const StartScreen: React.FC<StartScreenProps> = ({ hasLoadedGame }) => {
  const { 
    playerName, 
    setPlayerName, 
    planetSides, 
    setPlanetSides, 
    setGamePhase, 
    resetAllSides,
    allSides
  } = useTetris();
  
  const [name, setName] = useState(playerName || '');
  const [sides, setSides] = useState(planetSides || 4);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const { toggleMute, isMuted } = useAudio();
  
  useEffect(() => {
    // Set sides in the store whenever it changes locally
    setPlanetSides(sides);
  }, [sides, setPlanetSides]);
  
  // Start a new game
  const startNewGame = () => {
    if (name.trim()) {
      setPlayerName(name);
      resetAllSides();
      setGamePhase(GamePhase.PLAYING);
    }
  };
  
  // Continue a saved game
  const continueGame = () => {
    setGamePhase(GamePhase.PLAYING);
  };
  
  // Toggle leaderboard
  const toggleLeaderboard = () => {
    setShowLeaderboard(!showLeaderboard);
  };

  // Generate number buttons for sides selection
  const sideButtons = [];
  for (let i = MIN_SIDES; i <= MAX_SIDES; i++) {
    sideButtons.push(
      <Button 
        key={i}
        size="sm"
        variant={sides === i ? "default" : "outline"}
        className={sides === i ? "bg-purple-600 hover:bg-purple-700" : ""}
        onClick={() => setSides(i)}
      >
        {i}
      </Button>
    );
  }
  
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="bg-black/80 p-8 rounded-lg shadow-lg w-full max-w-md border border-purple-500">
        <h1 className="text-3xl font-bold text-center text-white mb-6">
          Cosmic Tetris
        </h1>
        
        {!showLeaderboard ? (
          <>
            <div className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-200">
                  Enter Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Your Name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-200">
                  Planet Sides: {sides}
                </label>
                <div className="mx-auto flex items-center justify-center mb-3">
                  <Polygon2D sides={sides} size={150} boardData={allSides} />
                </div>
                <div className="flex justify-center gap-1 mb-2">
                  {sideButtons}
                </div>
              </div>
              
              <div className="pt-4 space-y-3">
                <Button 
                  className="w-full bg-purple-600 hover:bg-purple-700" 
                  onClick={startNewGame}
                  disabled={!name.trim()}
                >
                  New Game
                </Button>
                
                {hasLoadedGame && (
                  <Button 
                    variant="outline" 
                    className="w-full border-purple-500 text-purple-500 hover:bg-purple-500/10" 
                    onClick={continueGame}
                  >
                    Continue Game
                  </Button>
                )}
                
                <Button
                  variant="ghost"
                  className="w-full hover:bg-purple-500/10"
                  onClick={toggleLeaderboard}
                >
                  Leaderboard
                </Button>
                
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full hover:bg-purple-500/10",
                    isMuted ? "text-gray-400" : "text-white"
                  )}
                  onClick={toggleMute}
                >
                  {isMuted ? "Unmute Sound" : "Mute Sound"}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            <Leaderboard />
            <div className="mt-6">
              <Button
                className="w-full bg-purple-600 hover:bg-purple-700"
                onClick={toggleLeaderboard}
              >
                Back to Menu
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StartScreen;
