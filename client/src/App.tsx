import { Canvas } from '@react-three/fiber';
import { Suspense, useState, useEffect } from 'react';
import { KeyboardControls } from '@react-three/drei';
import { useAudio } from "@/lib/stores/useAudio";
import "@fontsource/inter";

import TetrisGame from '@/components/TetrisGame';

// Main App component
function App() {
  return (
    <div className="w-full h-full bg-gray-900 overflow-hidden">
      <TetrisGame />
    </div>
  );
}

export default App;
