export enum TILE_TYPES {
  AISLE = 'AISLE',
  RACK = 'RACK',
  DOCK = 'DOCK'
}

export type TileType = keyof typeof TILE_TYPES;

export interface WarehouseTile {
  type: TILE_TYPES;
  zone?: string;
  capacity?: {
    total: number;
    used: number;
  };
  status?: 'AVAILABLE' | 'OCCUPIED';
  truck?: {
    cargo: string;
    driver: string;
  };
  row: number;
  col: number;
  aisleId?: string;
  heightPercentage?: number; // For racks: 0 to 1
  walkable: boolean;
}

export interface ZoneInfo {
  name: string;
  rackCount: number;
}

export interface AisleInfo {
  id: string;
  name: string;
  type: 'HORIZONTAL' | 'VERTICAL';
  tiles: Array<{ row: number; col: number }>;
}

export interface WarehouseStructure {
  grid: WarehouseTile[][];
  zones: Record<string, ZoneInfo>;
  aisles: AisleInfo[];
  width: number;
  height: number;
}

// Define a type for the simplified tile structure returned by parseWarehouseMap
export type ParsedWarehouseTile = {
  type: 'dock' | 'aisle' | 'rack';
  zone?: string;
  walkable: boolean;
  heightPercentage?: number;
};
