import React from 'react';
import { Box } from '@react-three/drei';
import { TILE_SIZE } from '../configuration';

interface FloorTileProps {
  position: [number, number, number];
  type: 'aisle' | 'dock';
}

export const FloorTile: React.FC<FloorTileProps> = ({ position, type }) => {
  const color = type === 'aisle' ? '#cccccc' : '#999999';
  
  return (
    <Box
      args={[TILE_SIZE, 0.1, TILE_SIZE]}
      position={[position[0], position[1] - 0.05, position[2]]}
      receiveShadow
    >
      <meshStandardMaterial 
        color={color} 
        roughness={0.8}
        metalness={0.1}
      />
    </Box>
  );
};