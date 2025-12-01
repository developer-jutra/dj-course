// Centralized configuration for warehouse simulator

export const WAREHOUSE_WIDTH = 18;
export const WAREHOUSE_HEIGHT = 12;

export const TILE_SIZE = 4;
export const RACK_HEIGHT = 6;
export const SHELF_HEIGHT = 1.2;
export const PLAYER_HEIGHT = 1.7;
export const MOVEMENT_SPEED = 0.2;
export const FAST_MOVEMENT_SPEED = 0.4;
export const ROTATION_SPEED = 0.08;

// Columns where vertical aisles are placed
export const VERTICAL_AISLE_COLS = [5, 11, 17, 23, 29];

// Zone color palette (at least 10 distinct colors)
export const ZONE_COLORS = [
  '#ff4444', // Red
  '#4444ff', // Blue
  '#44ff44', // Green
  '#ffff44', // Yellow
  '#ff44ff', // Magenta
  '#44ffff', // Cyan
  '#ff8844', // Orange
  '#8844ff', // Purple
  '#44ff88', // Mint
  '#ff4488', // Pink
];

// Main hero starting tile (grid coordinates, 0-based)
export const INITIAL_PLAYER_TILE = { row: 4, col: 5 };

export const INITIAL_PLAYER_ROTATION = 0; // 0 = facing north (negative Z direction)

// Helper to get a color for a zone index (rotates if more zones than colors)
export function getZoneColor(zoneIndex: number): string {
  return ZONE_COLORS[zoneIndex % ZONE_COLORS.length]!;
}
