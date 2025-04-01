import { useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { useTetris } from '@/lib/stores/useTetris';
import * as THREE from 'three';

import CubePlanet from './CubePlanet';
import TetrominoDebris from './TetrominoDebris';

const PlanetScene = () => {
  const { allSides, planetSides } = useTetris();
  
  return (
    <Canvas
      shadows
      camera={{ position: [0, 2, 10], fov: 60 }}
      style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%' 
      }}
    >
      {/* Ambient light */}
      <ambientLight intensity={0.3} />
      
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
      
      {/* Background stars */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} />
      
      {/* Planet with rotating animation */}
      <RotatingPlanet sides={planetSides} boardData={allSides} />
      
      {/* Floating tetromino debris in the background */}
      <TetrominoDebris count={15} />
      
      {/* Controls */}
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={5}
        maxDistance={15}
        dampingFactor={0.1}
        rotateSpeed={0.5}
      />
    </Canvas>
  );
};

const RotatingPlanet = ({ sides, boardData }: { sides: number; boardData: any[] }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  // Rotate the planet slowly
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
    }
  });
  
  return (
    <group ref={groupRef}>
      <CubePlanet 
        sides={sides} 
        boardData={boardData} 
        onHover={() => {}} 
        hoveredSide={null} 
      />
    </group>
  );
};

export default PlanetScene;
