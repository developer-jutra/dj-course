import React from 'react';
import { Tooltip } from './Tooltip';

export const WarehouseNavigation: React.FC = () => {
  return (
    <Tooltip title="Warehouse Navigation" defaultOpen={false}>
      <div className="text-sm space-y-1">
        <div>↑ Arrow: Move Forward</div>
        <div>↓ Arrow: Move Backward</div>
        <div>← Arrow: Turn Left</div>
        <div>→ Arrow: Turn Right</div>
        <div className="text-yellow-300">Shift + ↑/↓: Move Faster</div>
        <div className="text-yellow-300">Shift + ←/→: Turn Faster</div>
        <div className="text-blue-300">Cmd + ←/→: Strafe Left/Right</div>
      </div>
    </Tooltip>
  );
};