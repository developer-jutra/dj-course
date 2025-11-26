import { warehouseMap } from '../warehouseMap';
import { PLAYER_HEIGHT, INITIAL_PLAYER_TILE } from '../configuration';
import { getWorldPosition, findFirstWalkablePosition } from './warehouse-utilities';

// Centralized initial player position - use configured tile if valid, else fallback
export function getInitialPlayerPosition() {
  const structure = warehouseMap.getStructure();
  const { row, col } = INITIAL_PLAYER_TILE;
  const tile = structure.grid[row]?.[col];
  if (tile && tile.walkable && tile.type.toString().toLowerCase() === 'aisle') {
    const worldPos = getWorldPosition(row, col);
    return {
      x: worldPos.x,
      y: PLAYER_HEIGHT,
      z: worldPos.z
    };
  }
  // Fallback to first walkable position
  return findFirstWalkablePosition();
}

export const INITIAL_PLAYER_POSITION = getInitialPlayerPosition();
