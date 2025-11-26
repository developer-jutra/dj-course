import React from 'react';
import { Plane } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';

interface WallLogoProps {
  position: [number, number, number];
  rotation?: [number, number, number];
}

export const WallLogo: React.FC<WallLogoProps> = ({ position, rotation = [0, 0, 0] }) => {
  const texture = useLoader(TextureLoader, '/assets/deliveroo-dark-bg-1.png');
  
  return (
    <Plane
      args={[6, 4]}
      position={position}
      rotation={rotation}
    >
      <meshStandardMaterial map={texture} transparent />
    </Plane>
  );
};