import { useMemo } from 'react';
import { PlanetSide as PlanetSideType } from '@/lib/stores/useTetris';
import * as THREE from 'three';

import PlanetSide from '@/components/PlanetSide';

interface CubePlanetProps {
  sides: number;
  boardData: PlanetSideType[];
  onHover: (side: number | null) => void;
  hoveredSide: number | null;
}

const CubePlanet = ({ sides, boardData, onHover, hoveredSide }: CubePlanetProps) => {
  // Calculate positions for each side based on number of sides
  const sidePositions = useMemo(() => {
    const positions: { position: [number, number, number]; rotation: [number, number, number] }[] = [];
    
    switch (sides) {
      case 3: // Triangular prism (3 sides)
        positions.push(
          { position: [0, 0, 1], rotation: [0, 0, 0] },
          { position: [0.866, 0, -0.5], rotation: [0, 2 * Math.PI / 3, 0] },
          { position: [-0.866, 0, -0.5], rotation: [0, 4 * Math.PI / 3, 0] }
        );
        break;
        
      case 4: // Tetrahedron (4 sides)
        positions.push(
          { position: [0, 0.6, 0], rotation: [Math.PI / 2, 0, 0] },
          { position: [0, -0.2, 0.8], rotation: [-Math.PI / 6, 0, 0] },
          { position: [0.7, -0.2, -0.4], rotation: [-Math.PI / 6, 2 * Math.PI / 3, 0] },
          { position: [-0.7, -0.2, -0.4], rotation: [-Math.PI / 6, 4 * Math.PI / 3, 0] }
        );
        break;
        
      case 5: // Pentagonal prism (5 sides)
        positions.push(
          { position: [0, 0, 1], rotation: [0, 0, 0] },
          { position: [0.951, 0, 0.309], rotation: [0, Math.PI / 2.5, 0] },
          { position: [0.588, 0, -0.809], rotation: [0, 2 * Math.PI / 2.5, 0] },
          { position: [-0.588, 0, -0.809], rotation: [0, 3 * Math.PI / 2.5, 0] },
          { position: [-0.951, 0, 0.309], rotation: [0, 4 * Math.PI / 2.5, 0] }
        );
        break;
        
      case 6: // Cube (6 sides)
        positions.push(
          { position: [0, 0, 1], rotation: [0, 0, 0] },
          { position: [1, 0, 0], rotation: [0, Math.PI / 2, 0] },
          { position: [0, 0, -1], rotation: [0, Math.PI, 0] },
          { position: [-1, 0, 0], rotation: [0, -Math.PI / 2, 0] },
          { position: [0, 1, 0], rotation: [Math.PI / 2, 0, 0] },
          { position: [0, -1, 0], rotation: [-Math.PI / 2, 0, 0] }
        );
        break;
        
      case 7: // Heptagonal prism (7 sides)
        for (let i = 0; i < 7; i++) {
          const angle = (i * 2 * Math.PI) / 7;
          positions.push({
            position: [Math.sin(angle), 0, Math.cos(angle)],
            rotation: [0, angle, 0]
          });
        }
        break;
        
      case 8: // Octagonal prism (8 sides)
        for (let i = 0; i < 8; i++) {
          const angle = (i * 2 * Math.PI) / 8;
          positions.push({
            position: [Math.sin(angle), 0, Math.cos(angle)],
            rotation: [0, angle, 0]
          });
        }
        break;
        
      default: // Default to cube (6 sides)
        positions.push(
          { position: [0, 0, 1], rotation: [0, 0, 0] },
          { position: [1, 0, 0], rotation: [0, Math.PI / 2, 0] },
          { position: [0, 0, -1], rotation: [0, Math.PI, 0] },
          { position: [-1, 0, 0], rotation: [0, -Math.PI / 2, 0] },
          { position: [0, 1, 0], rotation: [Math.PI / 2, 0, 0] },
          { position: [0, -1, 0], rotation: [-Math.PI / 2, 0, 0] }
        );
    }
    
    return positions;
  }, [sides]);
  
  return (
    <group>
      {/* Planet sides */}
      {boardData.map((sideData, index) => {
        if (index < sidePositions.length) {
          const { position, rotation } = sidePositions[index];
          
          return (
            <PlanetSide
              key={`side-${index}`}
              sideData={sideData}
              sideIndex={index}
              position={position}
              rotation={rotation}
              hovered={hoveredSide === index}
              onHover={() => onHover(index)}
              onUnhover={() => onHover(null)}
            />
          );
        }
        return null;
      })}
      
      {/* Planet core (connecting the sides) */}
      <mesh position={[0, 0, 0]} castShadow>
        <icosahedronGeometry args={[0.5, 1]} />
        <meshStandardMaterial 
          color="#2e1065" 
          metalness={0.8}
          roughness={0.2}
          emissive="#7c3aed"
          emissiveIntensity={0.2}
        />
      </mesh>
    </group>
  );
};

export default CubePlanet;
