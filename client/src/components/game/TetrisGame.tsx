import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Stats } from "@react-three/drei";
import { useGame } from "@/lib/stores/useGame";
import { usePlanet } from "@/lib/stores/usePlanet";
import { useTetris } from "@/lib/stores/useTetris";
import GameUI from "../ui/GameUI";
import TetrisBoard from "./TetrisBoard";
import PlanetView from "./PlanetView";
import GameControls from "./GameControls";
import { useAudio } from "@/lib/stores/useAudio";

const TetrisGame = () => {
  const { pause, restart } = useGame();
  const { activeSide, isOverviewMode } = usePlanet();
  const { gameOver, isPaused } = useTetris();
  const { backgroundMusic, isMuted } = useAudio();
  const [showStats, setShowStats] = useState(false);

  // Play background music
  useEffect(() => {
    if (backgroundMusic && !isMuted) {
      backgroundMusic.play().catch(error => {
        console.log("Background music play prevented:", error);
      });
    }

    return () => {
      if (backgroundMusic) {
        backgroundMusic.pause();
      }
    };
  }, [backgroundMusic, isMuted]);

  // Handle pressing 'P' to pause the game
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "KeyP") {
        pause();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [pause]);

  return (
    <div className="w-full h-full relative">
      {/* Game Canvas */}
      <Canvas
        shadows
        camera={{
          position: isOverviewMode ? [0, 8, 12] : [0, 0, 15],
          fov: 45,
          near: 0.1,
          far: 1000
        }}
        gl={{
          antialias: true,
          powerPreference: "default"
        }}
      >
        <color attach="background" args={["#020313"]} />
        
        {/* Environment lighting */}
        <Environment preset="night" />
        <ambientLight intensity={0.2} />
        <directionalLight 
          position={[5, 10, 5]} 
          intensity={0.8} 
          castShadow 
          shadow-mapSize={[1024, 1024]} 
        />
        
        {isOverviewMode ? (
          <PlanetView />
        ) : (
          <TetrisBoard />
        )}
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
          rotateSpeed={0.5}
          enabled={isOverviewMode}
        />
        {showStats && <Stats />}
      </Canvas>
      
      {/* Game Controls */}
      <GameControls />
      
      {/* Game UI - score, level, next piece */}
      <GameUI />
      
      {/* Game Over or Pause overlay */}
      {(gameOver || isPaused) && (
        <div className="absolute top-0 left-0 w-full h-full bg-black/80 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-purple-500 rounded-lg p-8 text-center max-w-md">
            <h2 className="text-3xl font-bold text-white mb-4">
              {gameOver ? "Game Over" : "Paused"}
            </h2>
            {gameOver && (
              <p className="text-lg text-gray-300 mb-6">
                Your final score is saved to the leaderboard.
              </p>
            )}
            <div className="flex justify-center gap-4">
              {gameOver && (
                <button
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold"
                  onClick={restart}
                >
                  Play Again
                </button>
              )}
              {isPaused && (
                <button
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold"
                  onClick={() => pause()}
                >
                  Resume
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TetrisGame;
