import React from 'react';
import { Box, Text } from '@react-three/drei';
import { useLoader, ThreeEvent } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { TILE_SIZE, RACK_HEIGHT, SHELF_HEIGHT, getZoneColor } from '../configuration';
import { useTooltip } from '../context/TooltipContext';

interface RackProps {
  position: [number, number, number];
  zone: string; // zone label, for display only
  zoneIndex: number; // index for color assignment
  labelDirections?: Array<'north' | 'south' | 'east' | 'west'>;
  occupation: number; // 0 to 1, for percentage occupied (also determines visual height)
}

export const Rack: React.FC<RackProps> = ({ position, zone, zoneIndex, labelDirections = ['north', 'south', 'east', 'west'], occupation }) => {
  const cardboardTexture = useLoader(TextureLoader, '/assets/texture-cardboard.png');
  const color = getZoneColor(zoneIndex);
  const { showTooltip, hideTooltip, updatePosition } = useTooltip();
  
  // Calculate actual rack height based on occupation percentage
  const actualRackHeight = RACK_HEIGHT * occupation;
  
  // Calculate number of shelves based on actual height
  const maxShelves = Math.floor(RACK_HEIGHT / SHELF_HEIGHT);
  const actualShelfCount = Math.floor(actualRackHeight / SHELF_HEIGHT);
  
  // Determine which colored shelves to show based on occupation thresholds
  const getVisibleShelves = () => {
    const thresholds = [0.1, 0.3, 0.5, 0.7, 0.9]; // 10%, 30%, 50%, 70%, 90%
    const visibleShelves: number[] = [];
    
    thresholds.forEach((threshold) => {
      if (occupation >= threshold) {
        // Calculate which shelf index this threshold corresponds to
        const shelfIndex = Math.floor(threshold * maxShelves);
        if (shelfIndex < actualShelfCount) {
          visibleShelves.push(shelfIndex);
        }
      }
    });
    
    return visibleShelves;
  };
  
  const visibleColoredShelves = getVisibleShelves();
  
  // Configure texture repeat for better tiling
  cardboardTexture.wrapS = cardboardTexture.wrapT = 1000; // RepeatWrapping
  cardboardTexture.repeat.set(2, 3); // Adjust repeat values for good tiling
  
  // Calculate occupation label - use the same occupation data for both display and tooltip
  const occupationPercent = Math.round(occupation * 100);
  const labelText = `${zone} (${occupationPercent}%)`;

  // Handle mouse events for tooltip
  const handlePointerOver = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    const x = event.nativeEvent.clientX || 0;
    const y = event.nativeEvent.clientY || 0;
    
    showTooltip(
      { x, y },
      {
        zone,
        occupation, // This matches the displayed occupation percentage
        heightPercentage: occupation // Height percentage is the same as occupation
      }
    );
  };

  const handlePointerOut = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    hideTooltip();
  };

  const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
    const x = event.nativeEvent.clientX || 0;
    const y = event.nativeEvent.clientY || 0;
    updatePosition({ x, y });
  };
  
  return (
    <group position={position}>
      {/* Main rack structure with cardboard texture - dynamic height */}
      <Box
        args={[TILE_SIZE * 0.8, actualRackHeight, TILE_SIZE * 0.8]}
        position={[0, actualRackHeight / 2, 0]}
        castShadow
        receiveShadow
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onPointerMove={handlePointerMove}
      >
        <meshStandardMaterial 
          map={cardboardTexture} 
          roughness={0.8}
          metalness={0.1}
        />
      </Box>
      
      {/* Colored zone shelves - only show based on height thresholds */}
      {visibleColoredShelves.map((shelfIndex) => (
        <Box
          key={`colored-${shelfIndex}`}
          args={[TILE_SIZE * 0.9, 0.2, TILE_SIZE * 0.9]}
          position={[0, shelfIndex * SHELF_HEIGHT + 0.5, 0]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color={color} />
        </Box>
      ))}
      
      {/* Storage boxes on shelves with cardboard texture - only on existing shelves */}
      {Array.from({ length: actualShelfCount }, (_, shelfIndex) =>
        Array.from({ length: 3 }, (_, boxIndex) => (
          <Box
            key={`${shelfIndex}-${boxIndex}`}
            args={[0.8, 0.6, 0.8]}
            position={[
              (boxIndex - 1) * 1.2,
              shelfIndex * SHELF_HEIGHT + 0.9,
              0
            ]}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial 
              map={cardboardTexture} 
              roughness={0.9}
              metalness={0.05}
              opacity={0.9}
            />
          </Box>
        ))
      )}
      
      {/* Zone letters on selected sides only */}
      {/* North (negative Z) */}
      {labelDirections.includes('north') && (
        <Text
          position={[0, actualRackHeight * 0.7, TILE_SIZE * 0.45]}
          fontSize={0.8}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {labelText}
        </Text>
      )}
      {/* South (positive Z) */}
      {labelDirections.includes('south') && (
        <Text
          position={[0, actualRackHeight * 0.7, -TILE_SIZE * 0.45]}
          fontSize={0.8}
          color="white"
          anchorX="center"
          anchorY="middle"
          rotation={[0, Math.PI, 0]}
        >
          {labelText}
        </Text>
      )}
      {/* East (positive X) */}
      {labelDirections.includes('east') && (
        <Text
          position={[TILE_SIZE * 0.45, actualRackHeight * 0.7, 0]}
          fontSize={0.8}
          color="white"
          anchorX="center"
          anchorY="middle"
          rotation={[0, Math.PI / 2, 0]}
        >
          {labelText}
        </Text>
      )}
      {/* West (negative X) */}
      {labelDirections.includes('west') && (
        <Text
          position={[-TILE_SIZE * 0.45, actualRackHeight * 0.7, 0]}
          fontSize={0.8}
          color="white"
          anchorX="center"
          anchorY="middle"
          rotation={[0, -Math.PI / 2, 0]}
        >
          {labelText}
        </Text>
      )}
    </group>
  );
};