import React from 'react';
import { createPortal } from 'react-dom';

interface RackTooltipProps {
  isVisible: boolean;
  position: { x: number; y: number };
  rackInfo: {
    zone: string;
    occupation: number;
    heightPercentage: number;
  } | null;
}

export const RackTooltip: React.FC<RackTooltipProps> = ({ isVisible, position, rackInfo }) => {
  if (!isVisible || !rackInfo) return null;

  const tooltipContent = (
    <div
      className="fixed pointer-events-none z-[9999] bg-black text-white p-3 rounded-lg shadow-lg border border-gray-600"
      style={{
        left: position.x + 10,
        top: position.y - 10,
        transform: 'translateY(-100%)',
        minWidth: '200px',
      }}
    >
      <div className="text-sm font-semibold mb-1">Rack Information</div>
      <div className="text-xs space-y-1">
        <div>Zone: <span className="text-yellow-300">{rackInfo.zone}</span></div>
        <div>Occupation: <span className="text-green-300">{Math.round(rackInfo.occupation * 100)}%</span></div>
        <div className="text-gray-300 mt-2">
          {rackInfo.occupation > 0.8 ? 'Nearly Full' : 
           rackInfo.occupation > 0.5 ? 'Moderate Load' : 
           'Light Load'}
        </div>
      </div>
    </div>
  );

  // Create portal to render outside the Canvas
  const tooltipContainer = document.getElementById('tooltip-root');
  if (!tooltipContainer) return null;
  
  return createPortal(tooltipContent, tooltipContainer);
}; 