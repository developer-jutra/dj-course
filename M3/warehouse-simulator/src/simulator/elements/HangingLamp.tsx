import React from "react";
import { Cylinder, Sphere } from "@react-three/drei";

interface HangingLampProps {
  position: [number, number, number];
  cableLength?: number;
}

export const HangingLamp: React.FC<HangingLampProps> = ({
  position,
  cableLength = 2,
}) => {
  const lampPosition: [number, number, number] = [
    position[0],
    position[1] - cableLength,
    position[2]
  ];

  return (
    <group position={position}>
      {/* Cable */}
      <Cylinder
        args={[0.02, 0.02, cableLength, 8]}
        position={[0, -cableLength / 2, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#f5f5f5" />
      </Cylinder>

      {/* Lamp shade */}
      <Cylinder
        args={[0.4, 0.3, 0.6, 16, 1, true]}
        position={[0, -cableLength + 0.1, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial 
          color="#1a1a1a" 
          metalness={0.8} 
          roughness={0.2} 
        />
      </Cylinder>

      {/* Bulb */}
      <Sphere 
        args={[0.15, 16, 16]} 
        position={lampPosition}
        castShadow={false}
      >
        <meshStandardMaterial 
          color="#fff8dc" 
          emissive="#fff8dc" 
          emissiveIntensity={0.8}
          transparent
          opacity={0.9}
        />
      </Sphere>

      {/* Primary point light for dramatic illumination */}
      <pointLight
        position={lampPosition}
        intensity={8}
        distance={15}
        decay={2}
        color="#fff4e6"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.1}
        shadow-camera-far={20}
        shadow-bias={-0.0005}
      />

      {/* Secondary softer light for subtle fill */}
      <pointLight
        position={[lampPosition[0], lampPosition[1] - 0.2, lampPosition[2]]}
        intensity={3}
        distance={8}
        decay={1.5}
        color="#ffeaa7"
        castShadow={false}
      />
    </group>
  );
};