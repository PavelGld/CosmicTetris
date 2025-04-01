import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { KeyboardControls } from "@react-three/drei";
import { useAudio } from "./lib/stores/useAudio";
import "@fontsource/inter";
import MainMenu from "./components/ui/MainMenu";
import TetrisGame from "./components/game/TetrisGame";
import { usePlanet } from "./lib/stores/usePlanet";
import { useGame } from "./lib/stores/useGame";

// Define control keys for the game
const controls = [
  { name: "left", keys: ["KeyA", "ArrowLeft"] },
  { name: "right", keys: ["KeyD", "ArrowRight"] },
  { name: "rotate", keys: ["KeyW", "ArrowUp"] },
  { name: "softDrop", keys: ["KeyS", "ArrowDown"] },
  { name: "hardDrop", keys: ["Space"] },
  { name: "pause", keys: ["KeyP"] },
  { name: "switchLeft", keys: ["KeyQ"] },
  { name: "switchRight", keys: ["KeyE"] },
  { name: "overview", keys: ["KeyO"] }
];

// Main App component
function App() {
  const { phase } = useGame();
  const [showCanvas, setShowCanvas] = useState(false);
  const { backgroundMusic, setBackgroundMusic } = useAudio();
  const { loadGameState } = usePlanet();

  // Initialize background music
  useEffect(() => {
    if (!backgroundMusic) {
      const music = new Audio("/sounds/background.mp3");
      music.loop = true;
      music.volume = 0.3;
      setBackgroundMusic(music);
    }
  }, [backgroundMusic, setBackgroundMusic]);

  // Load saved game state from localStorage
  useEffect(() => {
    loadGameState();
  }, [loadGameState]);

  // Show the canvas once everything is loaded
  useEffect(() => {
    setShowCanvas(true);
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {showCanvas && (
        <KeyboardControls map={controls}>
          {phase === 'ready' && <MainMenu />}

          {phase === 'playing' && (
            <TetrisGame />
          )}
        </KeyboardControls>
      )}
    </div>
  );
}

export default App;
