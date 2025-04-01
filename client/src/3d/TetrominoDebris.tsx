import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TETROMINOS, TetrominoType } from '@/game/tetrominos';
import { COLORS } from '@/game/constants';

interface DebrisProps {
  count?: number;
}

const TetrominoDebris: React.FC<DebrisProps> = ({ count = 10 }) => {
  const debrisGroup = useRef<THREE.Group>(null);
  
  // Create debris objects
  const debrisItems = useMemo(() => {
    const items = [];
    const tetrominoTypes = Object.keys(TETROMINOS) as TetrominoType[];
    
    for (let i = 0; i < count; i++) {
      // Random tetromino type
      const randomType = tetrominoTypes[Math.floor(Math.random() * tetrominoTypes.length)];
      const color = COLORS[randomType];
      
      // Random position in a sphere around the origin
      const radius = 15 + Math.random() * 10;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      // Random rotation and scale
      const rotX = Math.random() * Math.PI * 2;
      const rotY = Math.random() * Math.PI * 2;
      const rotZ = Math.random() * Math.PI * 2;
      
      const scale = 0.1 + Math.random() * 0.2;
      
      // Random rotation speed
      const rotSpeed = (Math.random() - 0.5) * 0.01;
      
      items.push({
        id: i,
        type: randomType,
        position: [x, y, z],
        rotation: [rotX, rotY, rotZ],
        scale,
        rotSpeed,
        color
      });
    }
    
    return items;
  }, [count]);
  
  // Rotate each debris object
  useFrame((state, delta) => {
    if (debrisGroup.current) {
      for (let i = 0; i < debrisGroup.current.children.length; i++) {
        const child = debrisGroup.current.children[i];
        child.rotation.x += debrisItems[i].rotSpeed;
        child.rotation.y += debrisItems[i].rotSpeed * 1.2;
        child.rotation.z += debrisItems[i].rotSpeed * 0.7;
      }
    }
  });
  
  return (
    <group ref={debrisGroup}>
      {debrisItems.map((item) => {
        const tetromino = TETROMINOS[item.type];
        const shape = tetromino.shape;
        
        return (
          <group
            key={item.id}
            position={item.position as [number, number, number]}
            rotation={item.rotation as [number, number, number]}
            scale={item.scale}
          >
            {shape.map((row, y) => 
              row.map((cell, x) => {
                if (cell) {
                  return (
                    <mesh
                      key={`${item.id}-${y}-${x}`}
                      position={[
                        (x - shape[0].length / 2 + 0.5) * 1.1,
                        -(y - shape.length / 2 + 0.5) * 1.1,
                        0
                      ]}
                      castShadow
                    >
                      <boxGeometry args={[1, 1, 1]} />
                      <meshStandardMaterial
                        color={item.color}
                        emissive={item.color}
                        emissiveIntensity={0.3}
                        roughness={0.3}
                        metalness={0.7}
                      />
                    </mesh>
                  );
                }
                return null;
              })
            )}
          </group>
        );
      })}
    </group>
  );
};

export default TetrominoDebris;
