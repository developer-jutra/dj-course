import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DriverCalendar } from './drivers/DriverCalendar';
import { LoadingPage, ErrorMessage } from '../components';
import { useDriverDetails } from '../hooks/queries';

export const DriverCalendarPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: driver, isLoading, error, refetch } = useDriverDetails(id!);

  const handleBack = () => {
    navigate(`/drivers/${id}/details`);
  };

  if (!id) {
    navigate('/drivers');
    return null;
  }

  if (isLoading) {
    return <LoadingPage />;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ErrorMessage 
          error={error instanceof Error ? error.message : 'Failed to load driver calendar'} 
          onRetry={() => refetch()} 
        />
      </div>
    );
  }

  if (!driver) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ErrorMessage 
          error="Driver not found" 
          onRetry={() => navigate('/drivers')} 
        />
      </div>
    );
  }

  return <DriverCalendar driver={driver} onBack={handleBack} />;
};