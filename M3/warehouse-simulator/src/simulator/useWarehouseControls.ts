import { useEffect, useRef, useState } from 'react';
import { Camera, Vector3 } from 'three';
import { 
  warehouseMap,
} from './warehouseMap';
import { INITIAL_PLAYER_POSITION } from './model/position';
import { INITIAL_PLAYER_ROTATION } from './configuration';
import {
  MOVEMENT_SPEED,
  FAST_MOVEMENT_SPEED,
  ROTATION_SPEED,
  TILE_SIZE
} from './configuration';

export const useWarehouseControls = (camera: Camera | null) => {
  const keysPressed = useRef<Set<string>>(new Set());
  const [position, setPosition] = useState(new Vector3(
    INITIAL_PLAYER_POSITION.x, 
    INITIAL_PLAYER_POSITION.y, 
    INITIAL_PLAYER_POSITION.z
  ));
  const [rotation, setRotation] = useState(INITIAL_PLAYER_ROTATION);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      keysPressed.current.add(event.code);
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      keysPressed.current.delete(event.code);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const updateMovement = () => {
      if (!camera) return;

      const newPosition = position.clone();
      let newRotation = rotation;

      // Handle rotation (faster with Shift)
      const isFastRotation = keysPressed.current.has('ShiftLeft') || keysPressed.current.has('ShiftRight');
      const currentRotationSpeed = isFastRotation ? ROTATION_SPEED * 2.5 : ROTATION_SPEED;

      if (keysPressed.current.has('ArrowLeft')) {
        newRotation += currentRotationSpeed;
      }
      if (keysPressed.current.has('ArrowRight')) {
        newRotation -= currentRotationSpeed;
      }

      // Determine movement speed (faster with Shift for forward/backward)
      const isFastMovement = keysPressed.current.has('ShiftLeft') || keysPressed.current.has('ShiftRight');
      const currentSpeed = isFastMovement ? FAST_MOVEMENT_SPEED : MOVEMENT_SPEED;

      // Handle movement
      const moveVector = new Vector3();
      
      // Forward/backward movement - 0 rotation = facing north (negative Z)
      if (keysPressed.current.has('ArrowUp')) {
        moveVector.x = -Math.sin(newRotation) * currentSpeed;
        moveVector.z = -Math.cos(newRotation) * currentSpeed;
      }
      if (keysPressed.current.has('ArrowDown')) {
        moveVector.x = Math.sin(newRotation) * currentSpeed;
        moveVector.z = Math.cos(newRotation) * currentSpeed;
      }

      // Side movement with Command key
      const isSideMovement = keysPressed.current.has('MetaLeft') || keysPressed.current.has('MetaRight');
      if (isSideMovement) {
        if (keysPressed.current.has('ArrowLeft')) {
          // Move left (perpendicular to facing direction)
          moveVector.x = -Math.cos(newRotation) * MOVEMENT_SPEED;
          moveVector.z = Math.sin(newRotation) * MOVEMENT_SPEED;
        }
        if (keysPressed.current.has('ArrowRight')) {
          // Move right (perpendicular to facing direction)
          moveVector.x = Math.cos(newRotation) * MOVEMENT_SPEED;
          moveVector.z = -Math.sin(newRotation) * MOVEMENT_SPEED;
        }
      }

      // Check collision using new warehouse map system
      const testPosition = newPosition.clone().add(moveVector);
      const { width, height } = warehouseMap.getDimensions();
      
      const col = Math.floor((testPosition.x + width * TILE_SIZE / 2) / TILE_SIZE);
      const row = Math.floor((testPosition.z + height * TILE_SIZE / 2) / TILE_SIZE);
      
      // Only allow movement if the destination tile exists and is walkable
      if (warehouseMap.isWalkable(row, col)) {
        newPosition.add(moveVector);
      }

      // Update states if changed
      if (!newPosition.equals(position)) {
        setPosition(newPosition);
      }
      if (newRotation !== rotation) {
        setRotation(newRotation);
      }

      // Update camera
      camera.position.copy(newPosition);
      camera.lookAt(
        newPosition.x - Math.sin(newRotation),
        newPosition.y,
        newPosition.z - Math.cos(newRotation)
      );
    };

    const interval = setInterval(updateMovement, 16); // ~60fps
    return () => clearInterval(interval);
  }, [camera, position, rotation]);

  return { position, rotation };
};