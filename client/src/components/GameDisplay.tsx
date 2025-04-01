import { useEffect, useState, useCallback } from 'react';
import { GamePhase } from '@/game/constants';
import { useTetris } from '@/lib/stores/useTetris';
import { useKeyboard } from '@/lib/useKeyboard';

import GameBoard from './GameBoard';
import NextPiece from './NextPiece';
import GameStats from './GameStats';
import GameOver from './GameOver';
import Controls from './Controls';
import { Button } from '@/components/ui/button';
import { useAudio } from '@/lib/stores/useAudio';

const GameDisplay = () => {
  const gamePhase = useTetris(state => state.gamePhase);
  const currentSide = useTetris(state => state.currentSide);
  const allSides = useTetris(state => state.allSides);
  const planetSides = useTetris(state => state.planetSides);
  const setGamePhase = useTetris(state => state.setGamePhase);
  const setCurrentSide = useTetris(state => state.setCurrentSide);
  const saveGame = useTetris(state => state.saveGame);
  
  const [showControls, setShowControls] = useState(false);
  const keyState = useKeyboard();
  const { backgroundMusic, isMuted } = useAudio();
  
  // Resume the game
  const resumeGame = useCallback(() => {
    if (gamePhase === GamePhase.PAUSED) {
      setGamePhase(GamePhase.PLAYING);
    }
  }, [gamePhase, setGamePhase]);
  
  // Pause the game
  const pauseGame = useCallback(() => {
    if (gamePhase === GamePhase.PLAYING) {
      setGamePhase(GamePhase.PAUSED);
      // Save game state when paused
      saveGame();
    }
  }, [gamePhase, setGamePhase, saveGame]);
  
  // Switch to planet view
  const switchToPlanetView = useCallback(() => {
    // Save game before switching
    saveGame();
    setGamePhase(GamePhase.PLANET_VIEW);
  }, [saveGame, setGamePhase]);
  
  // Switch to next side
  const switchToNextSide = useCallback(() => {
    // Save game before switching
    saveGame();
    
    // Calculate next side index
    const nextSide = (currentSide + 1) % planetSides;
    setCurrentSide(nextSide);
  }, [currentSide, planetSides, saveGame, setCurrentSide]);
  
  // Switch to previous side
  const switchToPrevSide = useCallback(() => {
    // Save game before switching
    saveGame();
    
    // Calculate previous side index
    const prevSide = (currentSide - 1 + planetSides) % planetSides;
    setCurrentSide(prevSide);
  }, [currentSide, planetSides, saveGame, setCurrentSide]);
  
  // Toggle controls display
  const toggleControls = useCallback(() => {
    setShowControls(prev => !prev);
  }, []);
  
  // Check for pause key
  useEffect(() => {
    if (keyState.KeyP) {
      if (gamePhase === GamePhase.PLAYING) {
        pauseGame();
      } else if (gamePhase === GamePhase.PAUSED) {
        resumeGame();
      }
    }
  }, [keyState.KeyP, gamePhase, pauseGame, resumeGame]);
  
  // Handle background music
  useEffect(() => {
    if (backgroundMusic) {
      if (gamePhase === GamePhase.PLAYING && !isMuted) {
        backgroundMusic.play().catch(error => {
          console.log("Background music play prevented:", error);
        });
      } else {
        backgroundMusic.pause();
      }
    }
    
    return () => {
      backgroundMusic?.pause();
    };
  }, [gamePhase, backgroundMusic, isMuted]);

  // Get the current side data
  const currentSideData = allSides[currentSide];
  
  return (
    <div className="flex flex-col lg:flex-row w-full h-full p-2 lg:p-4">
      <div className="flex flex-col items-center mb-4 lg:mb-0 lg:mr-4">
        {/* Game board */}
        <GameBoard />
        
        {/* Mobile controls for touch devices */}
        <div className="lg:hidden mt-2">
          <Button size="sm" onClick={toggleControls} variant="outline">
            {showControls ? 'Hide Controls' : 'Show Controls'}
          </Button>
          {showControls && <Controls />}
        </div>
      </div>
      
      <div className="flex flex-col flex-1">
        {/* Game info and controls */}
        <div className="bg-black/80 border border-purple-500 rounded-lg p-4 mb-4 text-white">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Side {currentSide + 1}/{planetSides}</h2>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={switchToPrevSide}>
                ← Prev
              </Button>
              <Button size="sm" variant="outline" onClick={switchToNextSide}>
                Next →
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Game statistics */}
            <GameStats />
            
            {/* Next piece preview */}
            <div className="bg-gray-900/50 p-3 rounded border border-gray-700">
              <h3 className="text-sm font-medium mb-2">Next Piece</h3>
              <NextPiece tetromino={currentSideData?.nextPiece} />
            </div>
          </div>
          
          {/* Game controls */}
          <div className="mt-4 flex flex-wrap gap-2">
            {gamePhase === GamePhase.PLAYING ? (
              <Button size="sm" onClick={pauseGame}>Pause</Button>
            ) : (
              <Button size="sm" onClick={resumeGame}>Resume</Button>
            )}
            <Button size="sm" variant="outline" onClick={switchToPlanetView}>
              Planet View
            </Button>
            <Button size="sm" variant="secondary" onClick={saveGame}>
              Save Game
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => setGamePhase(GamePhase.START)}
            >
              Main Menu
            </Button>
          </div>
        </div>
        
        {/* Keyboard controls info (desktop only) */}
        <div className="hidden lg:block bg-black/80 border border-purple-500 rounded-lg p-4 text-white">
          <h3 className="text-lg font-medium mb-2">Keyboard Controls</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p>← / → - Move left/right</p>
              <p>↑ - Rotate</p>
              <p>↓ - Soft drop</p>
            </div>
            <div>
              <p>Space - Hard drop</p>
              <p>P - Pause/Resume</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Game over modal */}
      {gamePhase === GamePhase.GAME_OVER && (
        <GameOver sideId={currentSide} />
      )}
    </div>
  );
};

export default GameDisplay;
