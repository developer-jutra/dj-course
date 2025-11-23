import React, { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { useWarehouseControls } from '../useWarehouseControls';
import { INITIAL_PLAYER_POSITION } from '../model/position';

interface CameraControllerProps {
  onPositionChange: (pos: { x: number; z: number }, rot: number) => void;
}

export const CameraController: React.FC<CameraControllerProps> = ({ onPositionChange }) => {
  const { camera } = useThree();
  const { position, rotation } = useWarehouseControls(camera);

  useEffect(() => {
    camera.position.set(
      INITIAL_PLAYER_POSITION.x, 
      INITIAL_PLAYER_POSITION.y, 
      INITIAL_PLAYER_POSITION.z
    );
    // FIXED: Look north initially (negative Z direction) - corrected the target position
    camera.lookAt(
      INITIAL_PLAYER_POSITION.x, 
      INITIAL_PLAYER_POSITION.y, 
      INITIAL_PLAYER_POSITION.z - 5  // Look towards negative Z (north)
    );
  }, [camera]);

  useEffect(() => {
    onPositionChange({ x: position.x, z: position.z }, rotation);
  }, [position, rotation, onPositionChange]);

  return null;
};