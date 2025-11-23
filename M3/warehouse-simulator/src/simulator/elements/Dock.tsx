import React from 'react';
import { Box, Cylinder, Sphere } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { TILE_SIZE } from '../configuration';

interface DockProps {
  position: [number, number, number];
}

const WHEEL_POSITIONS = [
  [-0.8, -0.9, 2.1], [0.8, -0.9, 2.1],   // Rear wheels
  [-0.8, -0.9, -2.6], [0.8, -0.9, -2.6], // Front wheels
];

export const Dock: React.FC<DockProps> = ({ position }) => {
  const truckTexture = useLoader(TextureLoader, '/assets/texture-truck.png');
  
  // Configure texture for proper tiling on the truck
  truckTexture.wrapS = truckTexture.wrapT = 1000; // RepeatWrapping
  truckTexture.repeat.set(1, 1); // Single repeat for clean appearance
  
  return (
    <group position={position}>
      {/* Dock platform */}
      <Box args={[TILE_SIZE, 0.5, TILE_SIZE]} position={[0, 0.25, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#444444" />
      </Box>

      {/* Truck */}
      <group position={[0, 1.5, TILE_SIZE * 0.4]}>
        {/* Cargo area with new texture */}
        <Box args={[1.6, 1.4, 4.5]} position={[0, 0.2, 1]} castShadow receiveShadow>
          <meshStandardMaterial 
            map={truckTexture} 
            metalness={0.2} 
            roughness={0.7} 
          />
        </Box>

        {/* Cab */}
        <Box args={[1.6, 1.2, 1.7]} position={[0, 0, -2.1]} castShadow receiveShadow>
          <meshStandardMaterial color="#ff6600" metalness={0.5} roughness={0.5} />
        </Box>

        {/* Windshield */}
        <Box args={[1.4, 0.7, 0.1]} position={[0, 0.3, -3]} rotation={[-Math.PI / 10, 0, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#7ec0ee" transparent opacity={0.6} />
        </Box>

        {/* Side mirrors */}
        <Box args={[0.1, 0.2, 0.5]} position={[-1, 0.4, -2.2]} castShadow receiveShadow>
          <meshStandardMaterial color="#222" />
        </Box>
        <Box args={[0.1, 0.2, 0.5]} position={[1, 0.4, -2.2]} castShadow receiveShadow>
          <meshStandardMaterial color="#222" />
        </Box>

        {/* Headlights */}
        <Sphere args={[0.13, 16, 16]} position={[-0.4, -0.3, -3.7]} castShadow>
          <meshStandardMaterial color="#ffffcc" emissive="#ffffcc" emissiveIntensity={0.7} />
        </Sphere>
        <Sphere args={[0.13, 16, 16]} position={[0.4, -0.3, -3.7]} castShadow>
          <meshStandardMaterial color="#ffffcc" emissive="#ffffcc" emissiveIntensity={0.7} />
        </Sphere>

        {/* Wheels */}
        {WHEEL_POSITIONS.map(([x, y, z], idx) => (
          <group key={idx} position={[x, y, z]}>
            <Cylinder args={[0.4, 0.4, 0.3, 24]} rotation={[Math.PI / 2 - 0.26, 0, 1.6]} castShadow receiveShadow>
              <meshStandardMaterial color="#222" />
            </Cylinder>
            {/* Wheel hub */}
            <Cylinder args={[0.15, 0.15, 0.31, 16]} rotation={[Math.PI / 2 - 0.26, 0, 1.6]} castShadow>
              <meshStandardMaterial color="#bbb" />
            </Cylinder>
          </group>
        ))}
      </group>
    </group>
  );
};