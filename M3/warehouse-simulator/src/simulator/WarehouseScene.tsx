import React, { useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { CameraController } from './scene/CameraController';
import { WarehouseEnvironment } from './scene/WarehouseEnvironment';
import { Minimap } from './tooltips/Minimap';
import { WarehouseNavigation } from './tooltips/WarehouseNavigation';
import { INITIAL_PLAYER_POSITION } from './model/position';
import { INITIAL_PLAYER_ROTATION } from './configuration';
import { PCFSoftShadowMap } from 'three';
import { AudioControls } from './audio/AudioControls';
import { WarehouseContentRef } from './scene/WarehouseContent';

export const WarehouseScene: React.FC = () => {
  const [playerPosition, setPlayerPosition] = useState({ 
    x: INITIAL_PLAYER_POSITION?.x ?? 0, 
    z: INITIAL_PLAYER_POSITION?.z ?? 0 
  });
  const [playerRotation, setPlayerRotation] = useState(INITIAL_PLAYER_ROTATION);
  const contentRef = useRef<WarehouseContentRef>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.shiftKey && event.code === 'KeyD') {
        contentRef.current?.killRandomSoldier();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handlePositionChange = (pos: { x: number; z: number }, rot: number) => {
    setPlayerPosition(pos);
    setPlayerRotation(rot);
  };

  return (
    <div className="w-full h-screen">
      <Canvas
        camera={{ 
          fov: 75, 
          near: 0.1, 
          far: 1000,
          position: [
            INITIAL_PLAYER_POSITION?.x ?? 0,
            INITIAL_PLAYER_POSITION?.y ?? 0,
            INITIAL_PLAYER_POSITION?.z ?? 0
          ]
        }}
        shadows={{
          enabled: true,
          type: PCFSoftShadowMap
        }}
      >
        <CameraController onPositionChange={handlePositionChange} />
        <WarehouseEnvironment ref={contentRef} />
      </Canvas>
      
      <Minimap 
        playerPosition={playerPosition}
        playerRotation={playerRotation}
      />
      
      <div className="absolute top-4 left-4 z-50" style={{ width: 'max-content' }}>
        <div className="flex flex-col gap-2">
          <WarehouseNavigation />
          <AudioControls />
        </div>
      </div>
    </div>
  );
};
