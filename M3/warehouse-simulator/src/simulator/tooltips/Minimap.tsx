import React from 'react';
import { warehouseMap } from '../warehouseMap';
import { TILE_TYPES } from '../model/warehouse.types';
import { TILE_SIZE, getZoneColor } from '../configuration';
import { Tooltip } from './Tooltip';

interface MinimapProps {
  playerPosition: { x: number; z: number };
  playerRotation: number;
}

export const Minimap: React.FC<MinimapProps> = ({ playerPosition, playerRotation }) => {
  const structure = warehouseMap.getStructure();
  const tileSize = 16; // Size of each tile in pixels
  const mapWidth = structure.width * tileSize;
  const mapHeight = structure.height * tileSize;
  
  // Build a sorted list of unique zone names for consistent color assignment
  const uniqueZones = Array.from(new Set(
    structure.grid.flat().filter(tile => tile.zone).map(tile => tile.zone as string)
  )).sort();

  // Find the first tile (top-left) for each zone
  const firstTileOfZone: Record<string, { row: number; col: number }> = {};
  structure.grid.forEach((row, rowIndex) => {
    row.forEach((tile, colIndex) => {
      if (typeof tile.zone === 'string') {
        if (
          !firstTileOfZone[tile.zone] ||
          rowIndex < (firstTileOfZone[tile.zone]?.row ?? Infinity) ||
          (rowIndex === (firstTileOfZone[tile.zone]?.row ?? Infinity) && colIndex < (firstTileOfZone[tile.zone]?.col ?? Infinity))
        ) {
          firstTileOfZone[tile.zone] = { row: rowIndex, col: colIndex };
        }
      }
    });
  });

  // Convert world position to minimap coordinates with proper centering
  const playerX = ((playerPosition.x + structure.width * TILE_SIZE / 2) / TILE_SIZE) * tileSize;
  const playerZ = ((playerPosition.z + structure.height * TILE_SIZE / 2) / TILE_SIZE) * tileSize;
  
  // Calculate rotation angle for the cowboy - now correctly aligned
  const rotationAngle = -playerRotation * (180 / Math.PI);

  return (
    <div className="absolute top-4 right-4">
      <Tooltip title="Warehouse Map" defaultOpen={true}>
        <div className="bg-black bg-opacity-80 p-3 rounded-lg border border-gray-600">
          <h4 className="text-white text-sm font-bold mb-2 text-center">Warehouse Map</h4>
          <div 
            className="relative border border-gray-500"
            style={{ width: mapWidth, height: mapHeight }}
          >
            {/* Render warehouse tiles */}
            {structure.grid.map((row, rowIndex) =>
              row.map((tile, colIndex) => {
                let bgColor = '#333333'; // Default
                let borderColor = '#555555';
                let icon = '';
                let zoneLabel = '';
                
                if (tile.type === TILE_TYPES.DOCK) {
                  bgColor = '#666666'; // Dock
                  borderColor = '#888888';
                } else if (tile.type === TILE_TYPES.AISLE) {
                  bgColor = '#cccccc'; // Aisle
                  borderColor = '#dddddd';
                  
                  // Check if this is a lamp position
                  const stringMap = warehouseMap.getStringMap();
                  const originalChar = stringMap?.[rowIndex]?.[colIndex];
                  if (originalChar === '+') {
                    icon = '💡'; // Lamp icon
                  }
                } else if (tile.type === TILE_TYPES.RACK && tile.zone) {
                  const zoneIndex = uniqueZones.indexOf(tile.zone);
                  bgColor = getZoneColor(zoneIndex);
                  borderColor = bgColor;
                  // If this is the first tile of the zone, show the zone letter
                  const first = firstTileOfZone[tile.zone];
                  if (first && first.row === rowIndex && first.col === colIndex) {
                    zoneLabel = tile.zone;
                  }
                }
                
                return (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className="absolute flex items-center justify-center"
                    style={{
                      left: colIndex * tileSize,
                      top: rowIndex * tileSize,
                      width: tileSize,
                      height: tileSize,
                      backgroundColor: bgColor,
                      border: `1px solid ${borderColor}`,
                      opacity: 0.8,
                      fontSize: '10px',
                      position: 'absolute',
                    }}
                  >
                    {icon}
                    {zoneLabel && (
                      <span
                        style={{
                          color: '#fff',
                          fontWeight: 'bold',
                          fontSize: '12px',
                          textShadow: '0 0 2px #000',
                          position: 'absolute',
                          left: '50%',
                          top: '50%',
                          transform: 'translate(-50%, -50%)',
                          pointerEvents: 'none',
                        }}
                      >
                        {zoneLabel}
                      </span>
                    )}
                  </div>
                );
              })
            )}
            
            {/* Player cowboy emoji - now correctly positioned at tile center */}
            <div
              className="absolute text-lg leading-none select-none"
              style={{
                left: playerX,
                top: playerZ,
                transform: `translate(-50%, -50%) rotate(${rotationAngle}deg)`,
                transformOrigin: 'center center'
              }}
            >
              🤠
            </div>
          </div>
          
          {/* Legend */}
          <div className="mt-2 text-xs text-white space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-lg">🤠</span>
              <span>You</span>
            </div>
            <div className="grid grid-cols-2 gap-1 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2" style={{ backgroundColor: '#cccccc' }}></div>
                <span>Aisle</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2" style={{ backgroundColor: '#666666' }}></div>
                <span>Dock</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs">💡</span>
                <span>Lamp</span>
              </div>
            </div>
          </div>
        </div>
      </Tooltip>
    </div>
  );
};