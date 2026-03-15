import * as d3 from 'd3';
import { TILE_TYPES, WarehouseStructure, WarehouseTile } from './warehouse.types';

export const Colors = {
  background: '#f8fafc',
  tile: {
    rack: [
      '#E53E3E', '#38A169', '#3182CE', '#805AD5', '#D69E2E', '#DD6B20', '#319795', '#C53030'
    ],
    dockAvailable: '#A3D977',
    dockOccupied: '#5A8E3E',
    aisle: '#9CA3AF',
    unknown: '#6B7280'
  },
};

export const ICONS = {
  OCCUPIED_DOCK_TRUCK: '🚛',
  RUNNING_OUT_OF_SPACE: '⚠️',
}

export const d3Styles = {
  // border: '#e5e7eb', // gray-200
  tileRegular: {
    border: '#e5e7eb', // gray-200
    strokeWidth: 1,
  },
  tileActive: {
    border: '#d97706', // amber-500
    strokeWidth: 3,
  },
  tilePinned: {
    border: '#973c00', // amber-800
    strokeWidth: 3,
  },
  tileLowAvailability: {
    border: '#dc2626', // red-500
    strokeWidth: 3,
  },
  shadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
  tile: {
    size: 40
  },
  margin: { top: 60, right: 20, bottom: 20, left: 20 }
}

let currentTooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, HTMLDivElement> | null = null;
let pinnedTooltip: WarehouseTile | null = null;
let isTooltipPinned = false;

export function renderWarehouse(element: HTMLElement, structure: WarehouseStructure, strategy: string = 'strategy2'): void {
  console.log("Rendering warehouse with data:", structure);
  
  // Clear existing content
  d3.select(element).selectAll("*").remove();

  // Remove any previous controls
  const existingControls = document.getElementById('warehouse-zoom-controls');
  if (existingControls) existingControls.remove();

  const gridWidth = structure.width;
  const gridHeight = structure.height;
  
  const totalWidth = gridWidth * d3Styles.tile.size + d3Styles.margin.left + d3Styles.margin.right;
  const totalHeight = gridHeight * d3Styles.tile.size + d3Styles.margin.top + d3Styles.margin.bottom;

  const svg = d3.select(element)
    .append("svg")
    .attr("width", totalWidth)
    .attr("height", totalHeight)
    .style("background", Colors.background);

  // D3 zoom behavior
  const g = svg.append("g")
    .attr("transform", `translate(${d3Styles.margin.left},${d3Styles.margin.top})`);
  const zoom = d3.zoom<SVGSVGElement, unknown>()
    .scaleExtent([0.5, 3])
    .on("zoom", (event: any) => {
      g.attr("transform", event.transform);
    });
  svg.call(zoom);

  // Add HTML zoom controls (fixed position in container)
  const controls = document.createElement('div');
  controls.id = 'warehouse-zoom-controls';
  controls.style.position = 'absolute';
  controls.style.top = '16px';
  controls.style.right = '16px';
  controls.style.zIndex = '20';
  controls.style.display = 'flex';
  controls.style.gap = '8px';
  controls.style.background = 'rgba(255,255,255,0.95)';
  controls.style.borderColor = 'rgba(0,0,0,0.1)';
  controls.style.borderWidth = '1px';
  controls.style.borderStyle = 'solid';
  controls.style.borderRadius = '8px';
  controls.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
  controls.style.padding = '6px 10px';
  controls.style.alignItems = 'center';

  // Helper to create a button
  function makeBtn(label: string, title: string) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.innerText = label;
    btn.title = title;
    btn.style.fontSize = '18px';
    btn.style.width = '32px';
    btn.style.height = '32px';
    btn.style.border = 'none';
    btn.style.background = 'none';
    btn.style.cursor = 'pointer';
    btn.style.borderRadius = '6px';
    btn.style.transition = 'background 0.2s';
    btn.onmouseenter = () => { btn.style.background = '#f3f4f6'; };
    btn.onmouseleave = () => { btn.style.background = 'none'; };
    return btn;
  }

  // Zoom in
  const zoomInBtn = makeBtn('+', 'Zoom in');
  zoomInBtn.onclick = () => {
    svg.transition().duration(200).call(zoom.scaleBy, 1.5);
  };
  controls.appendChild(zoomInBtn);

  // Zoom out
  const zoomOutBtn = makeBtn('−', 'Zoom out');
  zoomOutBtn.onclick = () => {
    svg.transition().duration(200).call(zoom.scaleBy, 0.67);
  };
  controls.appendChild(zoomOutBtn);

  // Reset
  const resetBtn = makeBtn('⟳', 'Reset zoom');
  resetBtn.onclick = () => {
    svg.transition().duration(200).call(zoom.transform, d3.zoomIdentity.translate(d3Styles.margin.left, d3Styles.margin.top));
  };
  controls.appendChild(resetBtn);

  // Attach controls to the container (element)
  element.style.position = 'relative';
  element.appendChild(controls);

  // Create tooltip
  const tooltip = d3.select("body")
    .append("div")
    .attr("class", "warehouse-tooltip")
    .style("position", "absolute")
    .style("visibility", "hidden")
    .style("background", "rgba(0, 0, 0, 0.9)")
    .style("color", "white")
    .style("padding", "12px")
    .style("border-radius", "8px")
    .style("font-size", "14px")
    .style("font-family", "system-ui, -apple-system, sans-serif")
    .style("box-shadow", "0 4px 12px rgba(0, 0, 0, 0.3)")
    .style("z-index", "1000")
    .style("max-width", "250px");

  currentTooltip = tooltip;

  // Render tiles
  structure.grid.forEach((row: WarehouseTile[], rowIndex: number) => {
    row.forEach((tile: WarehouseTile, colIndex: number) => {
      const x = colIndex * d3Styles.tile.size;
      const y = rowIndex * d3Styles.tile.size;
      
      const tileGroup = g.append("g")
        .style("cursor", "pointer");

      if (tile.type === TILE_TYPES.RACK) {
        renderRackTile(tileGroup, tile, x, y, strategy);
      } else {
        // Regular tile rendering for non-rack tiles
        const rect = tileGroup.append("rect")
          .attr("x", x)
          .attr("y", y)
          .attr("width", d3Styles.tile.size)
          .attr("height", d3Styles.tile.size)
          .attr("fill", getTileColor(tile))
          .attr("stroke", d3Styles.tileRegular.border)
          .attr("stroke-width", d3Styles.tileRegular.strokeWidth)
          .style("transition", "all 0.2s ease");

        // Add truck icon for occupied docks
        if (tile.type === TILE_TYPES.DOCK && tile.status === 'OCCUPIED') {
          tileGroup.append("text")
            .attr("x", x + d3Styles.tile.size / 2)
            .attr("y", y + d3Styles.tile.size / 2)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .attr("fill", "white")
            .attr("font-size", "20px")
            .text(ICONS.OCCUPIED_DOCK_TRUCK)
            .style("pointer-events", "none");
        }
      }

      // Add hover and click interactions to the group
      tileGroup
        .on("mouseover", function(event: any) {
          if (!isTooltipPinned) {
            if (isLowAvailabilityRack(tile, strategy)) {
              d3.select(this as any).selectAll("rect").attr("stroke-width", d3Styles.tileLowAvailability.strokeWidth).attr("stroke", d3Styles.tileLowAvailability.border);
            } else {
              d3.select(this as any).selectAll("rect").attr("stroke-width", d3Styles.tileActive.strokeWidth).attr("stroke", d3Styles.tileActive.border);
            }
            showTooltip(event, tile, g, structure, strategy, d3Styles);
          }
        })
        .on("mousemove", function(event: any) {
          if (!isTooltipPinned) {
            updateTooltipPosition(event);
          }
        })
        .on("mouseout", function() {
          if (!isTooltipPinned) {
            if (isLowAvailabilityRack(tile, strategy)) {
              d3.select(this as any).selectAll("rect").attr("stroke-width", d3Styles.tileLowAvailability.strokeWidth).attr("stroke", d3Styles.tileLowAvailability.border);
            } else {
              d3.select(this as any).selectAll("rect").attr("stroke-width", d3Styles.tileRegular.strokeWidth).attr("stroke", d3Styles.tileRegular.border);
            }
            hideTooltip();
          }
        })
        .on("click", function(event: any) {
          event.stopPropagation();
          // Restore correct border for all tiles before any pin/unpin logic
          restoreAllTileBorders(g, structure, strategy, d3Styles);
          if (pinnedTooltip === tile && isTooltipPinned) {
            // Unpin current tooltip
            unpinTile(g, structure, strategy, d3Styles);
          } else {
            // Pin new tooltip
            pinnedTooltip = tile;
            isTooltipPinned = true;
            if (isLowAvailabilityRack(tile, strategy)) {
              d3.select(this as any).selectAll("rect").attr("stroke-width", d3Styles.tileLowAvailability.strokeWidth).attr("stroke", d3Styles.tileLowAvailability.border);
            } else {
              d3.select(this as any).selectAll("rect").attr("stroke-width", d3Styles.tilePinned.strokeWidth).attr("stroke", d3Styles.tilePinned.border);
            }
            showTooltip(event, tile, g, structure, strategy, d3Styles);
          }
        });
    });
  });

  // Listen for zone highlighting events
  const handleZoneHighlight = (event: CustomEvent) => {
    const { zoneId } = event.detail;
    
    g.selectAll("g")
      .style("opacity", function(d: any, i: number) {
        const rowIndex = Math.floor(i / gridWidth);
        const colIndex = i % gridWidth;
        const tile = structure.grid[rowIndex]?.[colIndex];
        
        if (!zoneId) return 1;
        
        return tile?.zone === zoneId ? 1 : 0.3;
      });
  };
  
  window.addEventListener('highlightZone', handleZoneHighlight as EventListener);

  // Click outside to unpin tooltip
  d3.select("body").on("click", function() {
    if (isTooltipPinned) {
      unpinTile(g, structure, strategy, d3Styles);
    }
  });
}

function renderRackTile(tileGroup: d3.Selection<SVGGElement, unknown, any, any>, tile: WarehouseTile, x: number, y: number, strategy: string) {
  const baseColor = getTileColor(tile);
  const utilization = tile.capacity ? (tile.capacity.used / tile.capacity.total) : 0;
  const utilizationPercent = Math.round(utilization * 100);

  if (strategy === 'strategy1') {
    const availability = 1 - utilization;
    const isLowAvailability = availability < 0.1;
    tileGroup.append("rect")
      .attr("x", x)
      .attr("y", y)
      .attr("width", d3Styles.tile.size)
      .attr("height", d3Styles.tile.size)
      .attr("fill", baseColor)
      .attr("fill-opacity", 0.3 + (utilization * 0.7))
      .attr("stroke", isLowAvailability ? d3Styles.tileLowAvailability.border : d3Styles.tileRegular.border)
      .attr("stroke-width", isLowAvailability ? d3Styles.tileLowAvailability.strokeWidth : d3Styles.tileRegular.strokeWidth);
    if (isLowAvailability) {
      tileGroup.append("text")
        .attr("x", x + d3Styles.tile.size / 2)
        .attr("y", y + d3Styles.tile.size / 2)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("fill", "red")
        .attr("font-size", "16px")
        .attr("font-weight", "bold")
        .text(ICONS.RUNNING_OUT_OF_SPACE)
        .style("pointer-events", "none");
    }
  } else if (strategy === 'strategy2') {
    const usedWidth = d3Styles.tile.size * utilization;
    const availableWidth = d3Styles.tile.size - usedWidth;
    if (usedWidth > 0) {
      tileGroup.append("rect")
        .attr("x", x)
        .attr("y", y)
        .attr("width", usedWidth)
        .attr("height", d3Styles.tile.size)
        .attr("fill", d3.color(baseColor)?.darker(0.5)?.toString() || baseColor)
        .attr("stroke", d3Styles.tileRegular.border)
        .attr("stroke-width", 1);
    }
    if (availableWidth > 0) {
      tileGroup.append("rect")
        .attr("x", x + usedWidth)
        .attr("y", y)
        .attr("width", availableWidth)
        .attr("height", d3Styles.tile.size)
        .attr("fill", d3.color(baseColor)?.brighter(0.5)?.toString() || baseColor)
        .attr("stroke", d3Styles.tileRegular.border)
        .attr("stroke-width", 1);
    }
  } else if (strategy === 'strategy3') {
    const gridSize = 4; // 4x4 grid
    const squareSize = d3Styles.tile.size / gridSize;
    const totalSquares = gridSize * gridSize;
    const filledSquares = Math.round(totalSquares * utilization);
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const squareIndex = row * gridSize + col;
        const squareX = x + col * squareSize;
        const squareY = y + row * squareSize;
        const isFilled = squareIndex < filledSquares;
        tileGroup.append("rect")
          .attr("x", squareX)
          .attr("y", squareY)
          .attr("width", squareSize - 1)
          .attr("height", squareSize - 1)
          .attr("fill", isFilled ?
            d3.color(baseColor)?.darker(0.3)?.toString() || baseColor :
            d3.color(baseColor)?.brighter(0.5)?.toString() || baseColor
          )
          .attr("stroke", d3Styles.tileRegular.border)
          .attr("stroke-width", 0.5);
      }
    }
  } else {
    tileGroup.append("rect")
      .attr("x", x)
      .attr("y", y)
      .attr("width", d3Styles.tile.size)
      .attr("height", d3Styles.tile.size)
      .attr("fill", baseColor)
      .attr("stroke", d3Styles.tileRegular.border)
      .attr("stroke-width", 1);
  }
}

// Helper to convert zoneId (e.g. 'A', 'B', ..., 'Z', 'AA', 'AB', ...) to a zero-based index
function zoneIdToIndex(zoneId: string | undefined): number {
  if (!zoneId) return 0;
  let index = 0;
  for (let i = 0; i < zoneId.length; i++) {
    index *= 26;
    index += zoneId.charCodeAt(i) - 65 + 1;
  }
  return index - 1;
}

function getTileColor(tile: WarehouseTile): string {
  switch (tile.type) {
    case TILE_TYPES.RACK: {
      const idx = zoneIdToIndex(tile.zone);
      return Colors.tile.rack[idx % Colors.tile.rack.length] || Colors.tile.unknown;
    }
    case TILE_TYPES.DOCK:
      return tile.status === 'OCCUPIED' ? Colors.tile.dockOccupied : Colors.tile.dockAvailable;
    case TILE_TYPES.AISLE:
      return Colors.tile.aisle;
    default:
      return Colors.tile.unknown;
  }
}

function showTooltip(event: MouseEvent, tile: WarehouseTile, g: d3.Selection<SVGGElement, unknown, any, any>, structure: WarehouseStructure, strategy: string, d3Styles: typeof import('./warehouse-visualization').d3Styles) {
  if (!currentTooltip) return;
  let content = '';
  switch (tile.type) {
    case TILE_TYPES.RACK:
      content = showRackTooltip(tile);
      break;
    case TILE_TYPES.DOCK:
      content = showDockTooltip(tile);
      break;
    case TILE_TYPES.AISLE:
      content = showAisleTooltip(tile);
      break;
  }
  // Add X icon to close tooltip
  // use flexbox and move the button to the right
  content = `
<div style="
  display: flex;
  align-items: flex-start;
  width: 100%;
  color: #fff;
  box-sizing: border-box;
">
  <!-- Content column -->
  <div style="flex: 1 1 0; min-width: 0;">
    <div style="">
      ${content}
    </div>
  </div>
  <!-- Icon column -->
  <div style="flex: 0 0 auto; display: flex; align-items: flex-start;">
    <button id="warehouse-tooltip-close"
      style="
        background: none;
        border: none;
        color: #fff;
        font-size: 18px;
        cursor: pointer;
        line-height: 1;
        display: flex;
        align-items: center;
        justify-content: center;
      "
      aria-label="Close"
    >❌</button>
  </div>
</div>

  `;
  currentTooltip.html(content).style('visibility', 'visible');
  updateTooltipPosition(event);
  // Add close handler
  setTimeout(() => {
    const closeBtn = document.getElementById('warehouse-tooltip-close');
    if (closeBtn) {
      closeBtn.onclick = (e) => {
        e.stopPropagation();
        unpinTile(g, structure, strategy, d3Styles);
      };
    }
  }, 0);
}

function showRackTooltip(tile: WarehouseTile): string {
  const usedPercent = tile.capacity ? Math.round((tile.capacity.used / tile.capacity.total) * 100) : 0;
  return `
    <div><strong>Rack - Zone ${tile.zone}</strong></div>
    <div>Position: Row ${tile.row + 1}, Col ${tile.col + 1}</div>
    <div>Capacity: ${tile.capacity?.used || 0}/${tile.capacity?.total || 0} units</div>
    <div>Utilization: ${usedPercent}%</div>
    <div>Available: ${(tile.capacity?.total || 0) - (tile.capacity?.used || 0)} units</div>
    <div style="margin-top:8px"><a href="https://en.wikipedia.org/wiki/Pallet_rack" target="_blank" style="color:#60a5fa">Learn more about racks</a></div>
  `;
}

function showDockTooltip(tile: WarehouseTile): string {
  return `
    <div><strong>Loading Dock ${tile.col + 1}</strong></div>
    <div>Status: ${tile.status === 'OCCUPIED' ? 'Occupied' : 'Available'}</div>
    <div>Position: Row ${tile.row + 1}, Col ${tile.col + 1}</div>
    ${tile.truck ? `<div>Cargo: ${tile.truck.cargo}</div><div>Driver: ${tile.truck.driver}</div>` : ''}
    <div style="margin-top:8px"><a href="https://en.wikipedia.org/wiki/Loading_dock" target="_blank" style="color:#60a5fa">Learn more about loading docks</a></div>
  `;
}

function showAisleTooltip(tile: WarehouseTile): string {
  return `
    <div><strong>Navigation Aisle ${tile.aisleId || ''}</strong></div>
    <div>Position: Row ${tile.row + 1}, Col ${tile.col + 1}</div>
    <div>Type: Main pathway</div>
    <div style="margin-top:8px"><a href="https://en.wikipedia.org/wiki/Aisle" target="_blank" style="color:#60a5fa">Learn more about aisles</a></div>
  `;
}

function updateTooltipPosition(event: MouseEvent) {
  if (!currentTooltip) return;
  
  currentTooltip
    .style("left", (event.pageX + 15) + "px")
    .style("top", (event.pageY - 10) + "px");
}

function hideTooltip() {
  if (currentTooltip && !isTooltipPinned) {
    currentTooltip.style("visibility", "hidden");
  }
}

// Helper function to check low availability
function isLowAvailabilityRack(tile: WarehouseTile, strategy: string): boolean {
  if (tile.type !== TILE_TYPES.RACK || strategy !== 'strategy1' || !tile.capacity) return false;
  const availability = 1 - (tile.capacity.used / tile.capacity.total);
  return availability < 0.1;
}

// Add a helper function to restore all tile borders
function restoreAllTileBorders(g: d3.Selection<SVGGElement, unknown, any, any>, structure: WarehouseStructure, strategy: string, d3Styles: typeof import('./warehouse-visualization').d3Styles) {
  const gridWidth = structure.width;
  g.selectAll("g").each(function(d: any, i: number) {
    const rowIndex = Math.floor(i / gridWidth);
    const colIndex = i % gridWidth;
    const tile = structure.grid[rowIndex]?.[colIndex];
    if (isLowAvailabilityRack(tile, strategy)) {
      d3.select(this as any).selectAll("rect")
        .attr("stroke-width", d3Styles.tileLowAvailability.strokeWidth)
        .attr("stroke", d3Styles.tileLowAvailability.border);
    } else {
      d3.select(this as any).selectAll("rect")
        .attr("stroke-width", d3Styles.tileRegular.strokeWidth)
        .attr("stroke", d3Styles.tileRegular.border);
    }
  });
}

// Add unpinTile function
function unpinTile(g: d3.Selection<SVGGElement, unknown, any, any>, structure: WarehouseStructure, strategy: string, d3Styles: typeof import('./warehouse-visualization').d3Styles) {
  pinnedTooltip = null;
  isTooltipPinned = false;
  restoreAllTileBorders(g, structure, strategy, d3Styles);
  hideTooltip();
}
