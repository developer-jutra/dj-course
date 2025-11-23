import { WAREHOUSE_WIDTH, WAREHOUSE_HEIGHT, VERTICAL_AISLE_COLS } from './configuration';
import { 
  TILE_TYPES, 
  TileType, 
  WarehouseTile, 
  ZoneInfo, 
  AisleInfo, 
  WarehouseStructure, 
  ParsedWarehouseTile 
} from './model/warehouse.types';
import { getWorldPosition, findFirstWalkablePosition, getTileFromPosition } from './model/warehouse-utilities';

// Re-export types for backward compatibility
export type { 
  TileType, 
  WarehouseTile, 
  ZoneInfo, 
  AisleInfo, 
  WarehouseStructure, 
  ParsedWarehouseTile 
} from './model/warehouse.types';
export { 
  TILE_TYPES
} from './model/warehouse.types';

class WarehouseStructureGenerator {
  #config: WarehouseStructure | null = null;

  generateWarehouseStructure(gridWidth: number, gridHeight: number): WarehouseStructure {
    // 1. Create grid
    const grid = this.#createGrid(gridWidth, gridHeight);
    // 2. Calculate horizontal aisles
    const horizontalAisleRows = this.#calculateHorizontalAisleRows(gridHeight);
    // 3. Place horizontal aisles in grid and collect aisle info
    const aisles: AisleInfo[] = this.#placeHorizontalAisles(grid, horizontalAisleRows);
    // 4. Place vertical aisles in grid and collect aisle info
    this.#placeVerticalAisles(grid, aisles);
    // 5. Assign zones using flood fill
    const zones = this.#assignZones(grid, gridWidth, gridHeight);
    // 6. Store config
    this.#config = { grid, zones, aisles, width: gridWidth, height: gridHeight };
    return this.#config;
  }

  #createGrid(gridWidth: number, gridHeight: number): WarehouseTile[][] {
    const grid: WarehouseTile[][] = [];
    for (let row = 0; row < gridHeight; row++) {
      grid[row] = [];
      for (let col = 0; col < gridWidth; col++) {
        if (row === 0) {
          const hasTruck = Math.random() < 0.3;
          const tile: WarehouseTile = {
            type: TILE_TYPES.DOCK,
            status: Math.random() < 0.3 ? 'OCCUPIED' : 'AVAILABLE',
            row,
            col,
            walkable: false
          };
          if (hasTruck) {
            const cargoOptions = ['Electronics', 'Furniture', 'Clothing', 'Food Products', 'Automotive Parts'];
            const driverOptions = ['John Smith', 'Maria Garcia', 'David Johnson', 'Sarah Wilson', 'Mike Brown'];
            tile.truck = {
              cargo: cargoOptions[Math.floor(Math.random() * cargoOptions.length)],
              driver: driverOptions[Math.floor(Math.random() * driverOptions.length)]
            };
          }
          grid[row][col] = tile;
        } else {
          // Generate a random occupation percentage between 0-100%
          const occupationPercentage = Math.random();
          const totalCapacity = Math.floor(Math.random() * 100) + 50;
          const usedCapacity = Math.floor(occupationPercentage * totalCapacity);
          
          grid[row][col] = {
            type: TILE_TYPES.RACK,
            row,
            col,
            walkable: false,
            heightPercentage: occupationPercentage, // Height matches occupation
            capacity: {
              total: totalCapacity,
              used: usedCapacity
            }
          };
        }
      }
    }
    return grid;
  }

  #calculateHorizontalAisleRows(gridHeight: number): number[] {
    const rows: number[] = [];
    let row = 1;
    while (row < gridHeight) {
      rows.push(row);
      row += 3;
    }
    return rows;
  }

  #placeHorizontalAisles(grid: WarehouseTile[][], horizontalAisleRows: number[]): AisleInfo[] {
    const aisles: AisleInfo[] = [];
    const gridWidth = grid[0].length;
    horizontalAisleRows.forEach((rowIndex, index) => {
      const aisleId = `H${index + 1}`;
      const aisleTiles: Array<{ row: number; col: number }> = [];
      for (let col = 0; col < gridWidth; col++) {
        grid[rowIndex][col] = {
          type: TILE_TYPES.AISLE,
          row: rowIndex,
          col,
          walkable: true,
          aisleId
        };
        aisleTiles.push({ row: rowIndex, col });
      }
      aisles.push({
        id: aisleId,
        name: `Horizontal Aisle ${index + 1}`,
        type: 'HORIZONTAL',
        tiles: aisleTiles
      });
    });
    return aisles;
  }

  #placeVerticalAisles(grid: WarehouseTile[][], aisles: AisleInfo[]): void {
    const gridHeight = grid.length;
    const gridWidth = grid[0].length;
    VERTICAL_AISLE_COLS.forEach((colIndex, index) => {
      if (colIndex < gridWidth) {
        const aisleId = `V${index + 1}`;
        const aisleTiles: Array<{ row: number; col: number }> = [];
        for (let row = 1; row < gridHeight; row++) {
          if (grid[row][colIndex].type !== TILE_TYPES.AISLE) {
            grid[row][colIndex] = {
              type: TILE_TYPES.AISLE,
              row,
              col: colIndex,
              walkable: true,
              aisleId
            };
          } else {
            grid[row][colIndex].aisleId = `${grid[row][colIndex].aisleId},${aisleId}`;
          }
          aisleTiles.push({ row, col: colIndex });
        }
        aisles.push({
          id: aisleId,
          name: `Vertical Aisle ${index + 1}`,
          type: 'VERTICAL',
          tiles: aisleTiles
        });
      }
    });
  }

  #getNeighbors(row: number, col: number, gridWidth: number, gridHeight: number): Array<[number, number]> {
    const deltas: [number, number][] = [
      [-1, 0], [1, 0], [0, -1], [0, 1]
    ];
    return deltas
      .map(([dr, dc]): [number, number] => [row + dr, col + dc])
      .filter(([r, c]) => r >= 0 && r < gridHeight && c >= 0 && c < gridWidth);
  }

  #assignZones(grid: WarehouseTile[][], gridWidth: number, gridHeight: number): Record<string, ZoneInfo> {
    let zoneCounter = 0;
    const zoneIdGrid: (string | undefined)[][] = Array.from({ length: gridHeight }, () => Array(gridWidth).fill(undefined));
    const dynamicZones: Record<string, ZoneInfo> = {};
    for (let row = 0; row < gridHeight; row++) {
      for (let col = 0; col < gridWidth; col++) {
        if (grid[row][col].type === TILE_TYPES.RACK && !zoneIdGrid[row][col]) {
          const zoneId = String.fromCharCode(65 + (zoneCounter % 26)) + (zoneCounter >= 26 ? Math.floor(zoneCounter / 26) : '');
          let rackCount = 0;
          const queue: Array<[number, number]> = [[row, col]];
          zoneIdGrid[row][col] = zoneId;
          while (queue.length > 0) {
            const [r, c] = queue.shift()!;
            grid[r][c].zone = zoneId;
            rackCount++;
            for (const [nr, nc] of this.#getNeighbors(r, c, gridWidth, gridHeight)) {
              if (grid[nr][nc].type === TILE_TYPES.RACK && !zoneIdGrid[nr][nc]) {
                zoneIdGrid[nr][nc] = zoneId;
                queue.push([nr, nc]);
              }
            }
          }
          dynamicZones[zoneId] = {
            name: `Storage Zone ${zoneId}`,
            rackCount
          };
          zoneCounter++;
        }
      }
    }
    return dynamicZones;
  }

  getWarehouseStructure(): WarehouseStructure {
    if (!this.#config) {
      this.#config = this.generateWarehouseStructure(WAREHOUSE_WIDTH, WAREHOUSE_HEIGHT); // Use similar dimensions to original
      // this.#config = this.generateWarehouseStructure(12, 7); // Use similar dimensions to original
    }
    return this.#config;
  }
}

const warehouseStructureGenerator = new WarehouseStructureGenerator();

export class WarehouseMap {
  private structure: WarehouseStructure;

  constructor() {
    // Use the algorithmic generator instead of hardcoded map
    this.structure = warehouseStructureGenerator.getWarehouseStructure();
  }

  // Query methods - UNCHANGED PUBLIC API
  public getStructure(): WarehouseStructure {
    return { ...this.structure };
  }

  public getTile(row: number, col: number): WarehouseTile | null {
    if (row < 0 || row >= this.structure.height || col < 0 || col >= this.structure.width) {
      return null;
    }
    return { ...this.structure.grid[row][col] };
  }

  public getGrid(): WarehouseTile[][] {
    return this.structure.grid.map(row => row.map(tile => ({ ...tile })));
  }

  public getRow(rowIndex: number): WarehouseTile[] | null {
    if (rowIndex < 0 || rowIndex >= this.structure.height) {
      return null;
    }
    return this.structure.grid[rowIndex].map(tile => ({ ...tile }));
  }

  public getColumn(colIndex: number): WarehouseTile[] | null {
    if (colIndex < 0 || colIndex >= this.structure.width) {
      return null;
    }
    return this.structure.grid.map(row => ({ ...row[colIndex] }));
  }

  public getTilesByType(type: TILE_TYPES): WarehouseTile[] {
    const tiles: WarehouseTile[] = [];
    for (let row = 0; row < this.structure.height; row++) {
      for (let col = 0; col < this.structure.width; col++) {
        if (this.structure.grid[row][col].type === type) {
          tiles.push({ ...this.structure.grid[row][col] });
        }
      }
    }
    return tiles;
  }

  public getTilesByZone(zone: string): WarehouseTile[] {
    const tiles: WarehouseTile[] = [];
    for (let row = 0; row < this.structure.height; row++) {
      for (let col = 0; col < this.structure.width; col++) {
        if (this.structure.grid[row][col].zone === zone) {
          tiles.push({ ...this.structure.grid[row][col] });
        }
      }
    }
    return tiles;
  }

  public getZones(): Record<string, ZoneInfo> {
    return { ...this.structure.zones };
  }

  public getAisles(): AisleInfo[] {
    return this.structure.aisles.map(aisle => ({ ...aisle }));
  }

  public getDimensions(): { width: number; height: number } {
    return {
      width: this.structure.width,
      height: this.structure.height
    };
  }

  public isWalkable(row: number, col: number): boolean {
    const tile = this.getTile(row, col);
    return tile ? tile.walkable : false;
  }

  // Update methods
  public updateTile(row: number, col: number, updates: Partial<WarehouseTile>): boolean {
    if (row < 0 || row >= this.structure.height || col < 0 || col >= this.structure.width) {
      return false;
    }

    this.structure.grid[row][col] = {
      ...this.structure.grid[row][col],
      ...updates,
      row, // Ensure row/col don't get overwritten
      col
    };

    return true;
  }

  public setRackHeight(row: number, col: number, heightPercentage: number): boolean {
    const tile = this.getTile(row, col);
    if (!tile || tile.type !== TILE_TYPES.RACK) {
      return false;
    }

    return this.updateTile(row, col, { heightPercentage: Math.max(0, Math.min(1, heightPercentage)) });
  }

  // Legacy compatibility methods for existing code - UNCHANGED PUBLIC API
  public getStringMap(): string[] {
    return this.structure.grid.map(row => 
      row.map(tile => {
        if (tile.type === TILE_TYPES.DOCK) return 'D';
        if (tile.type === TILE_TYPES.AISLE) return '_';
        if (tile.type === TILE_TYPES.RACK && tile.zone) return tile.zone;
        return '_';
      }).join('')
    );
  }

  public parseWarehouseMap(): Array<Array<{ type: string; zone?: string; walkable: boolean; heightPercentage?: number }>> {
    return this.structure.grid.map(row =>
      row.map(tile => ({
        type: tile.type === TILE_TYPES.DOCK ? 'dock' :
              tile.type === TILE_TYPES.RACK ? 'rack' : 'aisle',
        zone: tile.zone,
        walkable: tile.walkable,
        heightPercentage: tile.heightPercentage
      }))
    );
  }
}

// Create singleton instance
export const warehouseMap = new WarehouseMap();

// Export for backward compatibility
export const warehouseMapData = warehouseMap.getStringMap();

// Standalone export for parseWarehouseMap
export const parseWarehouseMap = (): ParsedWarehouseTile[][] => {
  // The cast is safe because warehouseMap.parseWarehouseMap() returns the correct structure
  return warehouseMap.parseWarehouseMap() as ParsedWarehouseTile[][];
};