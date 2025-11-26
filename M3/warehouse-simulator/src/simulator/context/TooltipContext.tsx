import React, { createContext, useContext, useState, ReactNode } from 'react';

interface RackInfo {
  zone: string;
  occupation: number;
  heightPercentage: number;
}

interface TooltipContextType {
  isVisible: boolean;
  position: { x: number; y: number };
  rackInfo: RackInfo | null;
  showTooltip: (position: { x: number; y: number }, rackInfo: RackInfo) => void;
  hideTooltip: () => void;
  updatePosition: (position: { x: number; y: number }) => void;
}

const TooltipContext = createContext<TooltipContextType | undefined>(undefined);

export const useTooltip = () => {
  const context = useContext(TooltipContext);
  if (!context) {
    throw new Error('useTooltip must be used within a TooltipProvider');
  }
  return context;
};

interface TooltipProviderProps {
  children: ReactNode;
}

export const TooltipProvider: React.FC<TooltipProviderProps> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rackInfo, setRackInfo] = useState<RackInfo | null>(null);

  const showTooltip = (pos: { x: number; y: number }, info: RackInfo) => {
    setPosition(pos);
    setRackInfo(info);
    setIsVisible(true);
  };

  const hideTooltip = () => {
    setIsVisible(false);
    setRackInfo(null);
  };

  const updatePosition = (pos: { x: number; y: number }) => {
    setPosition(pos);
  };

  return (
    <TooltipContext.Provider
      value={{
        isVisible,
        position,
        rackInfo,
        showTooltip,
        hideTooltip,
        updatePosition,
      }}
    >
      {children}
    </TooltipContext.Provider>
  );
}; 