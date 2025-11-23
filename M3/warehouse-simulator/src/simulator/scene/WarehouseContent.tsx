import React from 'react';
import { warehouseMap } from '../warehouseMap';
import { getWorldPosition } from '../model/warehouse-utilities';
import { TILE_TYPES } from '../model/warehouse.types';
import { CHARACTER_POSITIONS } from '../configuration';
import { Rack } from '../elements/Rack';
import { Dock } from '../elements/Dock';
import { FloorTile } from '../elements/FloorTile';
import { HangingLamp } from '../elements/HangingLamp';
import { Character, CharacterConfig } from '../elements/Character';

export const WarehouseContent: React.FC = () => {
  const structure = warehouseMap.getStructure();
  const characters: CharacterConfig[] = CHARACTER_POSITIONS;

  return (
    <group>
      {/* Warehouse tiles */}
      {(() => {
        // Build a sorted list of unique zone names for consistent color assignment
        const uniqueZones = Array.from(new Set(
          structure.grid.flat().filter(tile => tile.zone).map(tile => tile.zone as string)
        )).sort();
        return structure.grid.map((row, rowIndex) =>
          row.map((tile, colIndex) => {
            const worldPos = getWorldPosition(rowIndex, colIndex);
            const position: [number, number, number] = [worldPos.x, 0, worldPos.z];

            if (tile.type === TILE_TYPES.RACK && tile.zone) {
              const zoneIndex = uniqueZones.indexOf(tile.zone);
              // Determine which directions have an adjacent aisle (strict rule)
              const labelDirections: Array<'north' | 'south' | 'east' | 'west'> = [];
              
              // Check each direction for adjacent aisle
              const northTile = warehouseMap.getTile(rowIndex + 1, colIndex);
              if (northTile && northTile.type === TILE_TYPES.AISLE) {
                labelDirections.push('north');
              }
              
              const southTile = warehouseMap.getTile(rowIndex - 1, colIndex);
              if (southTile && southTile.type === TILE_TYPES.AISLE) {
                labelDirections.push('south');
              }
              
              const eastTile = warehouseMap.getTile(rowIndex, colIndex + 1);
              if (eastTile && eastTile.type === TILE_TYPES.AISLE) {
                labelDirections.push('east');
              }
              
              const westTile = warehouseMap.getTile(rowIndex, colIndex - 1);
              if (westTile && westTile.type === TILE_TYPES.AISLE) {
                labelDirections.push('west');
              }
              const occupation = tile.capacity && tile.capacity.total ? tile.capacity.used / tile.capacity.total : 0;
              return (
                <Rack
                  key={`${rowIndex}-${colIndex}`}
                  position={position}
                  zone={tile.zone as 'A' | 'B' | 'C' | 'D' | 'E'}
                  zoneIndex={zoneIndex}
                  labelDirections={labelDirections}
                  occupation={occupation}
                />
              );
            } else if (tile.type === TILE_TYPES.DOCK) {
              return (
                <group key={`${rowIndex}-${colIndex}`}>
                  <FloorTile position={position} type="dock" />
                  <Dock position={position} />
                </group>
              );
            } else if (tile.type === TILE_TYPES.AISLE) {
              // Check if this is a lamp position (from original '+' character)
              const originalChar = warehouseMap.getStringMap()[rowIndex]?.[colIndex];
              const isLampPosition = originalChar === '+';
              
              return (
                <group key={`${rowIndex}-${colIndex}`}>
                  <FloorTile position={position} type="aisle" />
                  {isLampPosition && (
                    <HangingLamp 
                      position={[worldPos.x, 7.5, worldPos.z]} 
                      cableLength={2.5} 
                    />
                  )}
                </group>
              );
            }
            return null;
          })
        );
      })()}
      
      {/* Animated Characters */}
      {characters.map((character, index) => {
        const worldPos = getWorldPosition(character.row, character.col);
        return (
          <Character
            key={`character-${index}`}
            position={[worldPos.x, 0, worldPos.z]}
            src={character.src}
            scale={character.scale || 3.0}
          />
        );
      })}
    </group>
  );
};