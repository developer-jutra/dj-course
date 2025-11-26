import { warehouseMap } from '../warehouseMap';
import { TILE_SIZE, PLAYER_HEIGHT } from '../configuration';
import type { ParsedWarehouseTile } from './warehouse.types';

// Coordinate transformation to place objects at tile centers
export const getWorldPosition = (row: number, col: number) => {
  const dimensions = warehouseMap.getDimensions();
  return {
    x: (col - dimensions.width / 2 + 0.5) * TILE_SIZE,
    z: (row - dimensions.height / 2 + 0.5) * TILE_SIZE
  };
};

// Function to find the first walkable aisle tile
export const findFirstWalkablePosition = () => {
  const structure = warehouseMap.getStructure();
  // Look for the first horizontal aisle (should be row 1 based on the algorithm)
  for (let row = 1; row < structure.height; row++) {
    for (let col = 0; col < structure.width; col++) {
      const tile = structure.grid[row]?.[col];
      if (tile && tile.walkable && tile.type.toString() === 'AISLE') {
        // Convert grid coordinates to world coordinates
        const worldPos = getWorldPosition(row, col);
        return {
          x: worldPos.x,
          y: PLAYER_HEIGHT,
          z: worldPos.z
        };
      }
    }
  }
  // Fallback to center if no walkable position found
  return {
    x: 0,
    y: PLAYER_HEIGHT,
    z: 0
  };
};

// Collision detection to work with tile centers
export const getTileFromPosition = (x: number, z: number) => {
  const dimensions = warehouseMap.getDimensions();
  const col = Math.floor((x + dimensions.width * TILE_SIZE / 2) / TILE_SIZE);
  const row = Math.floor((z + dimensions.height * TILE_SIZE / 2) / TILE_SIZE);
  if (row < 0 || row >= dimensions.height || col < 0 || col >= dimensions.width) {
    return null;
  }
  const tile = warehouseMap.getTile(row, col);
  if (!tile) return null;
  return {
    type: tile.type === 'DOCK' ? 'dock' :
          tile.type === 'RACK' ? 'rack' : 'aisle',
    zone: tile.zone,
    walkable: tile.walkable
  };
};

export const INITIAL_PLAYER_ROTATION = 0; // 0 = facing north (negative Z direction)
