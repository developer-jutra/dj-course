import React from 'react';

export const WarehouseLighting: React.FC = () => {
  return (
    <>
      {/* Minimal ambient lighting for deep shadows */}
      <ambientLight intensity={0.05} />
      
      {/* Optional: Very subtle directional light for minimal fill */}
      <directionalLight
        position={[50, 30, 20]}
        intensity={0.1}
        color="#4a5568"
        castShadow
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-camera-left={-40}
        shadow-camera-right={40}
        shadow-camera-top={40}
        shadow-camera-bottom={-40}
        shadow-camera-near={0.1}
        shadow-camera-far={100}
        shadow-bias={-0.0001}
      />
    </>
  );
};