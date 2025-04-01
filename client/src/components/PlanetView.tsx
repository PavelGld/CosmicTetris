import { useEffect, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useAspect, PerspectiveCamera, Html, OrbitControls } from '@react-three/drei';
import { useTetris } from '@/lib/stores/useTetris';
import { GamePhase } from '@/game/constants';
import CubePlanet from '@/3d/CubePlanet';
import TetrominoDebris from '@/3d/TetrominoDebris';
import { Button } from '@/components/ui/button';
import * as THREE from 'three';

const PlanetView = () => {
  const { allSides, planetSides, setGamePhase, setCurrentSide } = useTetris();
  const { camera } = useThree();
  const orbitControlsRef = useRef<any>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [hoveredSide, setHoveredSide] = useState<number | null>(null);
  
  // Set up camera position
  useEffect(() => {
    if (camera) {
      camera.position.set(0, 2, 8);
      camera.lookAt(0, 0, 0);
    }
  }, [camera]);
  
  // Rotate the planet slowly
  useFrame((state, delta) => {
    if (groupRef.current && !orbitControlsRef.current?.isDragging) {
      groupRef.current.rotation.y += delta * 0.1;
    }
  });
  
  // Return to the game
  const backToGame = () => {
    if (hoveredSide !== null) {
      setCurrentSide(hoveredSide);
    }
    setGamePhase(GamePhase.PLAYING);
  };
  
  return (
    <>
      {/* Ambient light */}
      <ambientLight intensity={0.2} />
      
      {/* Main directional light */}
      <directionalLight
        position={[5, 5, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      
      {/* Background point lights for atmosphere */}
      <pointLight position={[-10, 0, -10]} intensity={0.5} color="#3f7be4" />
      <pointLight position={[10, 5, 10]} intensity={0.5} color="#e43f9c" />
      
      {/* Floating tetromino debris in the background */}
      <TetrominoDebris count={20} />
      
      {/* Planet with all sides */}
      <group ref={groupRef}>
        <CubePlanet
          sides={planetSides}
          boardData={allSides}
          onHover={setHoveredSide}
          hoveredSide={hoveredSide}
        />
      </group>
      
      {/* Controls */}
      <OrbitControls 
        ref={orbitControlsRef}
        enablePan={false}
        enableZoom={true}
        minDistance={5}
        maxDistance={15}
        dampingFactor={0.1}
        rotateSpeed={0.5}
      />
      
      {/* UI Overlay */}
      <Html
        position={[0, -3.5, 0]}
        transform
        occlude
        style={{
          width: '300px',
          textAlign: 'center',
          pointerEvents: 'none'
        }}
      >
        <div className="bg-black/80 border border-purple-500 rounded p-3 text-white" style={{ pointerEvents: 'auto' }}>
          <h2 className="text-lg font-bold mb-2">Planet View</h2>
          {hoveredSide !== null ? (
            <p className="mb-2">Side {hoveredSide + 1} Selected</p>
          ) : (
            <p className="mb-2">Hover over a side to select it</p>
          )}
          <Button onClick={backToGame}>
            Back to Game
          </Button>
        </div>
      </Html>
    </>
  );
};

export default PlanetView;
