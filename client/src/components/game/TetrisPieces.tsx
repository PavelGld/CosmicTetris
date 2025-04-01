import React, { useMemo } from 'react';
import { Box } from '@react-three/drei';
import * as THREE from 'three';
import { TetrominoType, TetrominoShape } from '@/game/tetrominos';

interface TetrisPieceProps {
  pieceType: TetrominoType;
  color: string;
  position: [number, number, number];
  rotation: [number, number, number];
  shape: TetrominoShape;
  cellSize: number;
  isGhost?: boolean;
}

// Component to render a Tetris piece in 3D space
export const TetrisPiece: React.FC<TetrisPieceProps> = ({
  pieceType,
  color,
  position,
  rotation,
  shape,
  cellSize,
  isGhost = false
}) => {
  // Memoize blocks to avoid re-renders
  const blocks = useMemo(() => {
    const blocks = [];
    
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] !== 0) {
          blocks.push(
            <Box 
              key={`${x}-${y}`}
              position={[x * cellSize, -y * cellSize, 0]}
              args={[cellSize, cellSize, cellSize]}
            >
              <meshStandardMaterial 
                color={color} 
                transparent={isGhost} 
                opacity={isGhost ? 0.5 : 1} 
              />
            </Box>
          );
        }
      }
    }
    
    return blocks;
  }, [shape, cellSize, color, isGhost]);

  return (
    <group 
      position={position} 
      rotation={new THREE.Euler(...rotation)}
    >
      {blocks}
    </group>
  );
};

// Component to display the next piece preview
export const NextPiecePreview: React.FC<{
  pieceType: TetrominoType;
  color: string;
  shape: TetrominoShape;
}> = ({ pieceType, color, shape }) => {
  const cellSize = 0.7;
  
  return (
    <group position={[0, 0, 0]}>
      <TetrisPiece
        pieceType={pieceType}
        color={color}
        position={[0, 0, 0]}
        rotation={[0, 0, 0]}
        shape={shape}
        cellSize={cellSize}
      />
    </group>
  );
};
