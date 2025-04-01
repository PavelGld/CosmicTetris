import React, { useMemo } from 'react';
import { PlanetSide as PlanetSideType } from '@/lib/stores/useTetris';
import * as THREE from 'three';
import { BOARD_WIDTH, BOARD_HEIGHT, HIDDEN_ROWS } from '@/game/constants';
import { useThree } from '@react-three/fiber';

interface PlanetSideProps {
  sideData: PlanetSideType;
  sideIndex: number;
  position: [number, number, number];
  rotation: [number, number, number];
  hovered: boolean;
  onHover: () => void;
  onUnhover: () => void;
}

const PlanetSide: React.FC<PlanetSideProps> = ({
  sideData,
  sideIndex,
  position,
  rotation,
  hovered,
  onHover,
  onUnhover
}) => {
  const { viewport } = useThree();
  
  // Generate the geometry for the side based on board data
  const boardGeometry = useMemo(() => {
    const visibleRows = sideData.board.slice(HIDDEN_ROWS);
    
    // Create boxes for each filled cell on the board
    const boxes: JSX.Element[] = [];
    
    visibleRows.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell !== 0) {
          const xPos = (x - BOARD_WIDTH / 2 + 0.5) * 0.1;
          const yPos = -(y - BOARD_HEIGHT / 2 + 0.5) * 0.1;
          
          boxes.push(
            <mesh
              key={`cell-${y}-${x}`}
              position={[xPos, yPos, 0.025]}
              castShadow
              receiveShadow
            >
              <boxGeometry args={[0.095, 0.095, 0.05]} />
              <meshStandardMaterial 
                color={cell as string}
                emissive={cell as string}
                emissiveIntensity={0.3}
                roughness={0.3}
                metalness={0.7}
              />
            </mesh>
          );
        }
      });
    });
    
    return boxes;
  }, [sideData.board]);
  
  return (
    <group
      position={position}
      rotation={rotation}
      onPointerOver={onHover}
      onPointerOut={onUnhover}
    >
      {/* Base plate for the side */}
      <mesh receiveShadow>
        <boxGeometry args={[1, 1, 0.05]} />
        <meshStandardMaterial 
          color={hovered ? '#4c1d95' : '#1e1b4b'} 
          roughness={0.75}
          metalness={0.5}
        />
      </mesh>
      
      {/* Grid lines */}
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial 
          transparent 
          opacity={0.1} 
          wireframe 
          color="#ffffff" 
        />
      </mesh>
      
      {/* Side label */}
      <mesh position={[0, 0, 0.026]}>
        <planeGeometry args={[0.3, 0.1]} />
        <meshBasicMaterial transparent opacity={0}>
          <canvasTexture 
            attach="map" 
            image={(() => {
              const canvas = document.createElement('canvas');
              canvas.width = 128;
              canvas.height = 32;
              const ctx = canvas.getContext('2d');
              if (ctx) {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.strokeStyle = hovered ? '#a855f7' : '#6366f1';
                ctx.lineWidth = 4;
                ctx.strokeRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = 'white';
                ctx.font = '18px sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(`Side ${sideIndex + 1}`, canvas.width / 2, canvas.height / 2);
              }
              return canvas;
            })()}
          />
        </meshBasicMaterial>
      </mesh>
      
      {/* Board content */}
      {boardGeometry}
    </group>
  );
};

export default PlanetSide;
