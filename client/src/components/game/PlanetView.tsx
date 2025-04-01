import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Text } from '@react-three/drei';
import * as THREE from 'three';
import { usePlanet } from '@/lib/stores/usePlanet';

// The planet overview mode showing all sides
const PlanetView = () => {
  const planetRef = useRef<THREE.Mesh>(null);
  const labelsRef = useRef<THREE.Group>(null);
  
  const { 
    sides, 
    gameStatePerSide,
    activeSide,
    planetRotation,
    setPlanetRotation
  } = usePlanet();

  // Create a planet geometry based on number of sides
  const planetGeometry = useRef<THREE.PolyhedronGeometry | null>(null);
  
  // Update planet rotation
  useFrame((state, delta) => {
    if (planetRef.current) {
      // Slow auto-rotation
      planetRef.current.rotation.y += delta * 0.1;
      
      // Update the planet rotation in the store
      setPlanetRotation(planetRef.current.rotation.clone());
    }
    
    // Keep labels facing camera
    if (labelsRef.current) {
      labelsRef.current.quaternion.copy(state.camera.quaternion);
    }
  });

  // Generate a polyhedron corresponding to the number of sides
  useEffect(() => {
    // Create vertices and faces based on number of sides
    let vertices: number[] = [];
    let faces: number[] = [];
    let radius = 5;
    
    if (sides === 3) { // Tetrahedron
      vertices = [
        1, 1, 1,    -1, -1, 1,    -1, 1, -1,    1, -1, -1
      ];
      
      faces = [
        2, 1, 0,    0, 3, 2,    1, 3, 0,    2, 3, 1
      ];
    } else if (sides === 4) { // Cube/Hexahedron
      vertices = [
        -1, -1, -1,    1, -1, -1,    1, 1, -1,    -1, 1, -1,
        -1, -1, 1,     1, -1, 1,     1, 1, 1,     -1, 1, 1
      ];
      
      faces = [
        0, 1, 2,    0, 2, 3,    1, 5, 6,    1, 6, 2,
        5, 4, 7,    5, 7, 6,    4, 0, 3,    4, 3, 7,
        3, 2, 6,    3, 6, 7,    4, 5, 1,    4, 1, 0
      ];
    } else if (sides === 6) { // Octahedron
      vertices = [
        1, 0, 0,    -1, 0, 0,    0, 1, 0,
        0, -1, 0,   0, 0, 1,     0, 0, -1
      ];
      
      faces = [
        0, 2, 4,    0, 4, 3,    0, 3, 5,    0, 5, 2,
        1, 2, 5,    1, 5, 3,    1, 3, 4,    1, 4, 2
      ];
    } else if (sides === 8) { // Icosahedron (approximation)
      // Phi (golden ratio)
      const phi = (1 + Math.sqrt(5)) / 2;
      
      vertices = [
        -1, phi, 0,   1, phi, 0,    -1, -phi, 0,   1, -phi, 0,
        0, -1, phi,   0, 1, phi,    0, -1, -phi,   0, 1, -phi,
        phi, 0, -1,   phi, 0, 1,    -phi, 0, -1,   -phi, 0, 1
      ];
      
      faces = [
        0, 11, 5,     0, 5, 1,      0, 1, 7,      0, 7, 10,
        0, 10, 11,    1, 5, 9,      5, 11, 4,     11, 10, 2,
        10, 7, 6,     7, 1, 8,      3, 9, 4,      3, 4, 2,
        3, 2, 6,      3, 6, 8,      3, 8, 9,      4, 9, 5,
        2, 4, 11,     6, 2, 10,     8, 6, 7,      9, 8, 1
      ];
    } else {
      // Default to a sphere with icosphere subdivision for other values
      const temp = new THREE.IcosahedronGeometry(radius, 1);
      
      // Extract vertices and faces from the icosphere
      const positions = temp.getAttribute('position').array;
      const indices = temp.getIndex()?.array;
      
      if (positions && indices) {
        for (let i = 0; i < positions.length; i++) {
          vertices.push(positions[i]);
        }
        
        for (let i = 0; i < indices.length; i++) {
          faces.push(indices[i]);
        }
      }
    }
    
    // Create the polyhedron geometry
    planetGeometry.current = new THREE.PolyhedronGeometry(
      vertices, 
      faces, 
      radius, 
      2
    );
    
  }, [sides]);

  return (
    <group>
      {/* Planet */}
      <mesh
        ref={planetRef}
        geometry={planetGeometry.current}
      >
        <meshStandardMaterial
          color="#335577"
          metalness={0.8}
          roughness={0.4}
          wireframe={true}
        />
      </mesh>
      
      {/* Side indicators */}
      <group ref={labelsRef}>
        {Array.from({ length: sides }).map((_, index) => {
          // Calculate position around the planet
          const angle = (Math.PI * 2 / sides) * index;
          const distance = 6;
          
          // Get game state for this side
          const sideState = gameStatePerSide[index];
          const score = sideState?.score || 0;
          const level = sideState?.level || 1;
          const filled = sideState?.filledCount || 0;
          
          // Calculate a color based on game progress
          const levelColor = score > 0 
            ? `hsl(${Math.min(120, level * 30)}, 80%, 60%)`
            : '#666';
            
          return (
            <group
              key={`side-${index}`}
              position={[
                Math.sin(angle) * distance,
                0,
                Math.cos(angle) * distance * -1
              ]}
            >
              {/* Side number */}
              <Text
                position={[0, 1.5, 0]}
                color={index === activeSide ? '#ffffff' : '#aaaaaa'}
                fontSize={0.5}
                font="/fonts/inter.json"
                anchorX="center"
                anchorY="middle"
              >
                {`Side ${index + 1}`}
              </Text>
              
              {/* Level and score */}
              <Text
                position={[0, 0.8, 0]}
                color={levelColor}
                fontSize={0.3}
                font="/fonts/inter.json"
                anchorX="center"
                anchorY="middle"
              >
                {score > 0 ? `Level ${level} - ${score} pts` : 'Empty'}
              </Text>
              
              {/* Indicator sphere */}
              <mesh position={[0, 0, 0]}>
                <sphereGeometry args={[0.3, 16, 16]} />
                <meshStandardMaterial 
                  color={index === activeSide ? '#50c878' : levelColor}
                  emissive={index === activeSide ? '#50c878' : 'black'}
                  emissiveIntensity={0.5}
                />
              </mesh>
            </group>
          );
        })}
      </group>
    </group>
  );
};

export default PlanetView;
