import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  className = '' 
}) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 className="w-16 h-16 animate-spin text-blue-600" />
    </div>
  );
};

export const LoadingPage: React.FC<{ text?: string }> = ({ text = "Loading..." }) => (
  <div className="min-h-screen flex flex-col items-center justify-center">
    <LoadingSpinner />
    <p className="mt-4 text-gray-600 font-medium">{text}</p>
  </div>
);

export const LoadingCard: React.FC<{ className?: string }> = ({ 
  className = '' 
}) => (
  <div className={`bg-white rounded-lg shadow-lg p-8 ${className}`}>
    <LoadingSpinner />
  </div>
);