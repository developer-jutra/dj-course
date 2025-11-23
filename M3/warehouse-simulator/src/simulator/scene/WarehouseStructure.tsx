import React from 'react';
import { warehouseMap } from '../warehouseMap';
import { TILE_SIZE } from '../configuration';
import { WallLogo } from '../elements/WallLogo';

export const WarehouseStructure: React.FC = () => {
  const { width, height } = warehouseMap.getDimensions();
  const mapWidth = width * TILE_SIZE;
  const mapDepth = height * TILE_SIZE;

  return (
    <group>
      {/* Floor boundary */}
      <mesh position={[0, -0.1, 0]} receiveShadow>
        <boxGeometry args={[mapWidth + 4, 0.1, mapDepth + 4]} />
        <meshStandardMaterial 
          color="#888888" 
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>
      
      {/* Ceiling */}
      <mesh position={[0, 8, 0]} receiveShadow>
        <boxGeometry args={[mapWidth + 4, 0.2, mapDepth + 4]} />
        <meshStandardMaterial 
          color="#666666" 
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>
      
      {/* Walls */}
      {/* North wall */}
      <mesh position={[0, 4, -mapDepth/2 - 2]} receiveShadow castShadow>
        <boxGeometry args={[mapWidth + 4, 8, 0.4]} />
        <meshStandardMaterial 
          color="#141623" 
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>
      
      {/* South wall */}
      <mesh position={[0, 4, mapDepth/2 + 2]} receiveShadow castShadow>
        <boxGeometry args={[mapWidth + 4, 8, 0.4]} />
        <meshStandardMaterial 
          color="#141623" 
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>
      
      {/* East wall */}
      <mesh position={[mapWidth/2 + 2, 4, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.4, 8, mapDepth + 4]} />
        <meshStandardMaterial 
          color="#141623" 
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>
      
      {/* West wall */}
      <mesh position={[-mapWidth/2 - 2, 4, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.4, 8, mapDepth + 4]} />
        <meshStandardMaterial 
          color="#141623" 
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>

      {/* Wall logos */}
      <WallLogo 
        position={[0, 4, -mapDepth/2 - 1.8]} 
        rotation={[0, 0, 0]} 
      />
      <WallLogo 
        position={[0, 4, mapDepth/2 + 1.8]} 
        rotation={[0, Math.PI, 0]} 
      />
      <WallLogo 
        position={[mapWidth/2 + 1.8, 4, 0]} 
        rotation={[0, -Math.PI/2, 0]} 
      />
      <WallLogo 
        position={[-mapWidth/2 - 1.8, 4, 0]} 
        rotation={[0, Math.PI/2, 0]} 
      />
    </group>
  );
};