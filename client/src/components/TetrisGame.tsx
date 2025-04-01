import { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { GamePhase } from '@/game/constants';
import { useTetris } from '@/lib/stores/useTetris';
import { useLeaderboard } from '@/lib/stores/useLeaderboard';
import { useAudio } from '@/lib/stores/useAudio';

import StartScreen from './StartScreen';
import GameDisplay from './GameDisplay';
import PlanetView from './PlanetView';
import PlanetOverview from './PlanetOverview';

const TetrisGame = () => {
  const gamePhase = useTetris(state => state.gamePhase);
  const loadGame = useTetris(state => state.loadGame);
  const [loaded, setLoaded] = useState(false);
  const { loadLeaderboard } = useLeaderboard();
  
  // Load audio elements
  const {
    setBackgroundMusic,
    setHitSound,
    setSuccessSound
  } = useAudio();
  
  useEffect(() => {
    // Load leaderboard on startup
    loadLeaderboard();
    
    // Try to load saved game
    const hasLoadedGame = loadGame();
    setLoaded(hasLoadedGame);
    
    // Setup audio
    const bgMusic = new Audio('/sounds/background.mp3');
    bgMusic.loop = true;
    bgMusic.volume = 0.5;
    
    const hitSound = new Audio('/sounds/hit.mp3');
    hitSound.volume = 0.3;
    
    const successSound = new Audio('/sounds/success.mp3');
    successSound.volume = 0.4;
    
    setBackgroundMusic(bgMusic);
    setHitSound(hitSound);
    setSuccessSound(successSound);
  }, [loadGame, loadLeaderboard, setBackgroundMusic, setHitSound, setSuccessSound]);

  return (
    <div className="w-full h-full flex relative">
      {/* Background SVG */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(/src/assets/space-bg.svg)'
        }}
      />
      
      {/* Main Content */}
      <div className="z-10 w-full h-full">
        {gamePhase === GamePhase.START && (
          <StartScreen hasLoadedGame={loaded} />
        )}
        
        {gamePhase === GamePhase.PLAYING || gamePhase === GamePhase.PAUSED || gamePhase === GamePhase.GAME_OVER ? (
          <GameDisplay />
        ) : null}
        
        {gamePhase === GamePhase.PLANET_VIEW && (
          <div className="w-full h-full flex">
            {/* 2D Planet Overview */}
            <div className="w-full h-full z-10">
              <PlanetOverview />
            </div>
            
            {/* 3D Planet Visualization (as background) */}
            <div className="fixed inset-0 z-0">
              <Canvas
                camera={{ position: [0, 0, 15], fov: 60 }}
                style={{ width: '100%', height: '100%' }}
                dpr={[1, 1.5]} // Lower resolution for better performance
                frameloop="demand" // Render only when needed
              >
                <PlanetView />
              </Canvas>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TetrisGame;
