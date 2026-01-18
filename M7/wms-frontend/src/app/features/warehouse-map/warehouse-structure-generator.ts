import { TILE_TYPES, WarehouseTile, ZoneInfo, AisleInfo, WarehouseStructure } from './warehouse.types';

export class WarehouseStructureGenerator {
  #config: WarehouseStructure | null = null;
  // #colors: string[] = ['#E53E3E', '#38A169', '#3182CE', '#805AD5', '#D69E2E', '#DD6B20', '#319795', '#C53030'];

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
          grid[row][col] = {
            type: TILE_TYPES.DOCK,
            status: Math.random() < 0.3 ? 'OCCUPIED' : 'AVAILABLE',
            row,
            col,
            ...(Math.random() < 0.3 && {
              truck: {
                cargo: ['Electronics', 'Furniture', 'Clothing', 'Food Products', 'Automotive Parts'][Math.floor(Math.random() * 5)],
                driver: ['John Smith', 'Maria Garcia', 'David Johnson', 'Sarah Wilson', 'Mike Brown'][Math.floor(Math.random() * 5)]
              }
            })
          };
        } else {
          grid[row][col] = {
            type: TILE_TYPES.RACK,
            zone: undefined,
            row,
            col,
            capacity: {
              total: Math.floor(Math.random() * 100) + 50,
              used: Math.floor(Math.random() * 80) + 10
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
    const verticalAisleCols = [5, 11, 17, 23, 29];
    verticalAisleCols.forEach((colIndex, index) => {
      if (colIndex < gridWidth) {
        const aisleId = `V${index + 1}`;
        const aisleTiles: Array<{ row: number; col: number }> = [];
        for (let row = 1; row < gridHeight; row++) {
          if (grid[row][colIndex].type !== TILE_TYPES.AISLE) {
            grid[row][colIndex] = {
              type: TILE_TYPES.AISLE,
              row,
              col: colIndex,
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
          // const color = this.#colors[zoneCounter % this.#colors.length];
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
            // color,
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
      this.#config = this.generateWarehouseStructure(30, 12);
    }
    return this.#config;
  }

  getZoneRackCount(zoneId: string): number {
    const data = this.getWarehouseStructure();
    return data.zones[zoneId]?.rackCount || 0;
  }

  getAisleInfo(): AisleInfo[] {
    const data = this.getWarehouseStructure();
    return data.aisles;
  }
}

export const warehouseStructureGenerator = new WarehouseStructureGenerator();
