import React from 'react';
import { WarehouseScene } from './simulator/WarehouseScene';
import BackgroundAudio from './simulator/audio/BackgroundAudio';
import { AudioProvider } from './simulator/audio/AudioControls';
import { TooltipProvider } from './simulator/context/TooltipContext';
import { RackTooltip } from './simulator/tooltips/RackTooltip';
import { useTooltip } from './simulator/context/TooltipContext';

const AppContent: React.FC = () => {
  const { isVisible, position, rackInfo } = useTooltip();
  
  return (
    <div className="w-full h-screen bg-gray-900">
      <BackgroundAudio />
      <WarehouseScene />
      <div id="tooltip-root" />
      <RackTooltip isVisible={isVisible} position={position} rackInfo={rackInfo} />
    </div>
  );
};

function App() {
  return (
    <AudioProvider>
      <TooltipProvider>
        <AppContent />
      </TooltipProvider>
    </AudioProvider>
  );
}

export default App;