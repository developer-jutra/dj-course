import React from 'react';

interface ActionTileProps {
  label: React.ReactNode;
  variant?: 'blue' | 'green' | 'purple' | 'yellow' | 'orange';
  size?: 'NORMAL' | 'SMALL';
  onClick: () => void;
}

type VariantType = {
  bg: string;
  text: string;
  hover: string;
}

const variantStyles: Record<ActionTileProps['variant'], VariantType> = {
  blue: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    hover: 'hover:bg-blue-100',
  },
  green: {
    bg: 'bg-green-50',
    text: 'text-green-700',
    hover: 'hover:bg-green-100',
  },
  purple: {
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    hover: 'hover:bg-purple-100',
  },
  yellow: {
    bg: 'bg-yellow-50',
    text: 'text-yellow-700',
    hover: 'hover:bg-yellow-100',
  },
  orange: {
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    hover: 'hover:bg-orange-100',
  },
};

const sizeStyles = {
  NORMAL: 'px-3 py-2 text-sm',
  SMALL: 'px-3 py-1 text-sm',
};

export const ActionTile: React.FC<ActionTileProps> = ({
  label,
  variant = 'blue',
  size = 'NORMAL',
  onClick,
}) => {
  const styles = variantStyles[variant];
  const sizeClass = sizeStyles[size];
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-1 ${sizeClass} ${styles.bg} ${styles.text} rounded-lg ${styles.hover} transition-colors`}
    >
      {label}
    </button>
  );
};
