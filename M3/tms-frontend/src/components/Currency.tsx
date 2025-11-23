import React from 'react';

interface CurrencyProps {
  value: number;
  className?: string;
}

const Currency: React.FC<CurrencyProps> = ({ value, className }) => {
  const formattedValue = new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
  }).format(value);

  return <span className={className}>{formattedValue}</span>;
};

export default Currency; 