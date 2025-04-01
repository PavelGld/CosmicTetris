import { useEffect, useState } from 'react';
import { useTetris } from '@/lib/stores/useTetris';
import { usePlanet } from '@/lib/stores/usePlanet';
import { Canvas } from '@react-three/fiber';
import { NextPiecePreview } from '../game/TetrisPieces';
import { useAudio } from '@/lib/stores/useAudio';

const GameUI = () => {
  const { 
    score, 
    level, 
    linesCleared, 
    nextPiece,
    holdPiece,
    isPaused,
    gameOver,
    canHold
  } = useTetris();
  
  const { 
    activeSide,
    sides,
    isOverviewMode,
    playerName
  } = usePlanet();
  
  const { isMuted, toggleMute } = useAudio();
  
  // Format time as MM:SS
  const [time, setTime] = useState<string>('00:00:00');
  const [startTime] = useState<number>(Date.now());
  
  // Update the timer
  useEffect(() => {
    if (isPaused || gameOver) return;
    
    const timer = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const hours = Math.floor(elapsedTime / (1000 * 60 * 60));
      const minutes = Math.floor((elapsedTime % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);
      
      setTime(
        `${hours.toString().padStart(2, '0')} ${minutes.toString().padStart(2, '0')} ${seconds.toString().padStart(2, '0')}`
      );
    }, 1000);
    
    return () => clearInterval(timer);
  }, [startTime, isPaused, gameOver]);
  
  if (isOverviewMode) return null;
  
  return (
    <div className="absolute top-0 left-0 w-full p-4 pointer-events-none">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start justify-between">
        {/* Game info */}
        <div className="bg-black/60 rounded-lg p-4 mb-4 md:mb-0 backdrop-blur-sm text-white w-full md:w-auto">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-orbitron text-xl text-purple-400 mb-1">COSMIC TETRIS</h2>
              <p className="text-gray-300 text-sm">{playerName}'s Game - Side {activeSide + 1}/{sides}</p>
            </div>
            
            <button 
              className="bg-gray-800 hover:bg-gray-700 rounded-full p-2 pointer-events-auto"
              onClick={toggleMute}
            >
              {isMuted ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                  <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path>
                  <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path>
                  <line x1="12" y1="19" x2="12" y2="23"></line>
                  <line x1="8" y1="23" x2="16" y2="23"></line>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
                  <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
                </svg>
              )}
            </button>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div>
              <h3 className="text-sm text-gray-400">Time</h3>
              <p className="font-mono text-green-400 text-lg">{time}</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-400">Score</h3>
              <p className="font-mono text-yellow-400 text-lg">{score.toString().padStart(10, '0')}</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-400">Level</h3>
              <p className="font-mono text-blue-400 text-lg">{level.toString().padStart(2, '0')}</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-400">Lines</h3>
              <p className="font-mono text-orange-400 text-lg">{linesCleared}</p>
            </div>
          </div>
        </div>
        
        {/* Controls info */}
        <div className="bg-black/60 rounded-lg p-4 backdrop-blur-sm text-white">
          <h3 className="text-sm text-gray-400 mb-2">Controls</h3>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs">
            <div>←/→: Move</div>
            <div>↑: Rotate</div>
            <div>↓: Soft Drop</div>
            <div>Space: Hard Drop</div>
            <div>P: Pause</div>
            <div>Q/E: Switch Side</div>
            <div>O: Overview</div>
          </div>
        </div>
      </div>
      
      {/* Next piece preview */}
      <div className="absolute top-4 right-4 bg-black/60 rounded-lg p-4 backdrop-blur-sm">
        <h3 className="text-sm text-gray-400 mb-2 text-center">Next</h3>
        <div className="w-20 h-20">
          <Canvas>
            <ambientLight intensity={0.8} />
            <directionalLight 
              position={[0, 5, 5]} 
              intensity={0.5} 
            />
            {nextPiece && (
              <NextPiecePreview
                pieceType={nextPiece.type}
                color={nextPiece.color}
                shape={nextPiece.shape}
              />
            )}
          </Canvas>
        </div>
      </div>
      
      {/* Hold piece */}
      <div className="absolute top-32 right-4 bg-black/60 rounded-lg p-4 backdrop-blur-sm">
        <h3 className="text-sm text-gray-400 mb-2 text-center">Hold</h3>
        <div className="w-20 h-20" style={{ opacity: canHold ? 1 : 0.5 }}>
          <Canvas>
            <ambientLight intensity={0.8} />
            <directionalLight 
              position={[0, 5, 5]} 
              intensity={0.5} 
            />
            {holdPiece && (
              <NextPiecePreview
                pieceType={holdPiece.type}
                color={holdPiece.color}
                shape={holdPiece.shape}
              />
            )}
          </Canvas>
        </div>
      </div>
    </div>
  );
};

export default GameUI;
