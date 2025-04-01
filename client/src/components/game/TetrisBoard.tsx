import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Box } from '@react-three/drei';
import * as THREE from 'three';
import { useTetris } from '@/lib/stores/useTetris';
import { usePlanet } from '@/lib/stores/usePlanet';
import { TetrisPiece } from './TetrisPieces';

// The main Tetris board component using Three.js
const TetrisBoard = () => {
  const boardRef = useRef<THREE.Group>(null);
  const gridRef = useRef<THREE.Group>(null);
  
  const { 
    board, 
    currentPiece, 
    currentPosition,
    isPaused,
    gameOver,
    ghostPosition
  } = useTetris();
  
  const { 
    activeSide,
    sides,
    planetRotation
  } = usePlanet();

  // Calculate the angle to position the board based on active side
  const angle = useMemo(() => {
    return (Math.PI * 2 / sides) * activeSide;
  }, [activeSide, sides]);

  // Rotate the board to the correct position
  useEffect(() => {
    if (boardRef.current) {
      boardRef.current.rotation.y = angle;
    }
  }, [angle]);

  // Apply rotation animation to the board
  useFrame((state, delta) => {
    if (boardRef.current && !isPaused && !gameOver) {
      // Smooth rotation to target position
      const targetRotation = angle;
      boardRef.current.rotation.y = THREE.MathUtils.lerp(
        boardRef.current.rotation.y,
        targetRotation,
        0.1
      );
    }
    
    // Apply planet rotation from the planet store
    if (gridRef.current) {
      gridRef.current.rotation.copy(planetRotation);
    }
  });

  // Determine grid colors based on active side
  const gridColor = useMemo(() => {
    const colors = [
      '#50c878', // Emerald
      '#4169e1', // Royal Blue
      '#ff4500', // Orange Red
      '#9370db', // Medium Purple
      '#ff6347', // Tomato
      '#20b2aa', // Light Sea Green
      '#ff69b4', // Hot Pink
      '#ffd700'  // Gold
    ];
    return colors[activeSide % colors.length];
  }, [activeSide]);

  // Create board dimensions
  const boardWidth = 10;
  const boardHeight = 20;
  const cellSize = 1;
  
  // Offset to center the board
  const offsetX = (boardWidth * cellSize) / 2 - cellSize / 2;
  const offsetY = (boardHeight * cellSize) / 2 - cellSize / 2;
  
  // Calculate board distance from center
  const distanceFromCenter = 10;
  
  return (
    <group ref={boardRef} position={[0, 0, 0]}>
      {/* Board positioned away from the planet center */}
      <group 
        position={[
          0, 
          0, 
          -distanceFromCenter
        ]}
        ref={gridRef}
      >
        {/* Grid border */}
        <mesh position={[0, 0, -0.2]}>
          <boxGeometry 
            args={[
              boardWidth * cellSize + 0.5, 
              boardHeight * cellSize + 0.5, 
              0.1
            ]} 
          />
          <meshStandardMaterial color="black" />
        </mesh>
        
        {/* Grid background */}
        <mesh position={[0, 0, -0.1]}>
          <boxGeometry 
            args={[
              boardWidth * cellSize + 0.2, 
              boardHeight * cellSize + 0.2, 
              0.1
            ]} 
          />
          <meshStandardMaterial color="#111" />
        </mesh>
        
        {/* Grid lines */}
        <group>
          {/* Vertical grid lines */}
          {Array.from({ length: boardWidth + 1 }).map((_, i) => (
            <mesh 
              key={`v-${i}`} 
              position={[
                i * cellSize - offsetX - 0.5, 
                0, 
                0
              ]}
            >
              <boxGeometry 
                args={[
                  0.02, 
                  boardHeight * cellSize + 0.1, 
                  0.01
                ]} 
              />
              <meshStandardMaterial 
                color={gridColor} 
                transparent 
                opacity={0.3} 
              />
            </mesh>
          ))}
          
          {/* Horizontal grid lines */}
          {Array.from({ length: boardHeight + 1 }).map((_, i) => (
            <mesh 
              key={`h-${i}`} 
              position={[
                0, 
                i * cellSize - offsetY - 0.5, 
                0
              ]}
            >
              <boxGeometry 
                args={[
                  boardWidth * cellSize + 0.1, 
                  0.02, 
                  0.01
                ]} 
              />
              <meshStandardMaterial 
                color={gridColor} 
                transparent 
                opacity={0.3} 
              />
            </mesh>
          ))}
        </group>
        
        {/* Render the placed blocks */}
        {board.map((row, y) => 
          row.map((cell, x) => {
            if (cell) {
              return (
                <Box
                  key={`block-${x}-${y}`}
                  position={[
                    x * cellSize - offsetX,
                    (boardHeight - 1 - y) * cellSize - offsetY,
                    0
                  ]}
                  args={[cellSize * 0.9, cellSize * 0.9, cellSize * 0.9]}
                >
                  <meshStandardMaterial color={cell} />
                </Box>
              );
            }
            return null;
          })
        )}
        
        {/* Render ghost piece */}
        {!gameOver && !isPaused && currentPiece && ghostPosition && (
          <TetrisPiece
            pieceType={currentPiece.type}
            color={currentPiece.color + '33'} // Semi-transparent
            position={[
              ghostPosition.x * cellSize - offsetX,
              (boardHeight - 1 - ghostPosition.y) * cellSize - offsetY,
              0
            ]}
            rotation={[0, 0, 0]}
            shape={currentPiece.shape}
            cellSize={cellSize * 0.9}
            isGhost={true}
          />
        )}
        
        {/* Render the current active piece */}
        {!gameOver && !isPaused && currentPiece && currentPosition && (
          <TetrisPiece
            pieceType={currentPiece.type}
            color={currentPiece.color}
            position={[
              currentPosition.x * cellSize - offsetX,
              (boardHeight - 1 - currentPosition.y) * cellSize - offsetY,
              0
            ]}
            rotation={[0, 0, 0]}
            shape={currentPiece.shape}
            cellSize={cellSize * 0.9}
          />
        )}
        
        {/* Game over text */}
        {gameOver && (
          <Text
            position={[0, 0, 0.5]}
            color="white"
            fontSize={1.5}
            font="/fonts/inter.json"
            anchorX="center"
            anchorY="middle"
          >
            GAME OVER
          </Text>
        )}
        
        {/* Pause text */}
        {isPaused && !gameOver && (
          <Text
            position={[0, 0, 0.5]}
            color="white"
            fontSize={1.5}
            font="/fonts/inter.json"
            anchorX="center"
            anchorY="middle"
          >
            PAUSED
          </Text>
        )}
      </group>
    </group>
  );
};

export default TetrisBoard;
