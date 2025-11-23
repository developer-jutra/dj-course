import React, { useState } from 'react';

interface TooltipProps {
  title?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({ title, defaultOpen = false, children }) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      className={`bg-black bg-opacity-70 text-white rounded-lg shadow-lg transition-all duration-300 overflow-hidden select-none`}
      style={{ minWidth: 180 }}
    >
      <div className="flex items-center justify-between cursor-pointer p-2" onClick={() => setOpen((o) => !o)}>
        {title && <h3 className="font-bold text-base mb-0 ml-1">{title}</h3>}
        <button
          className="ml-2 text-white text-xs bg-gray-700 rounded px-2 py-1 focus:outline-none hover:bg-gray-600"
          aria-label={open ? 'Collapse' : 'Expand'}
          tabIndex={0}
        >
          {open ? '−' : '+'}
        </button>
      </div>
      <div
        className={`transition-all duration-300 ${open ? 'opacity-100 max-h-96 p-2' : 'opacity-0 max-h-0 p-0 pointer-events-none'}`}
        style={{ minHeight: open ? undefined : 0 }}
      >
        {open && children}
      </div>
    </div>
  );
};
