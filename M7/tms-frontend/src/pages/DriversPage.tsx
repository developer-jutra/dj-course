import React from 'react';
import { DriversList } from './drivers';
import { LoadingPage, ErrorMessage } from '../components';
import { useDriversList } from '../hooks/queries';

export const DriversPage: React.FC = () => {
  const { data: drivers = [], isLoading, error, refetch } = useDriversList();

  const handleRetry = () => {
    refetch();
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ErrorMessage 
          error={error instanceof Error ? error.message : 'Failed to load drivers'} 
          onRetry={handleRetry} 
        />
      </div>
    );
  }

  return <DriversList drivers={drivers} />;
};