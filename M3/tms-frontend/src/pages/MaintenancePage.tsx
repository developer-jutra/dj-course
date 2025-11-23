import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { vehicles as allVehicles } from '@/model/vehicles/vehicles.mocks';
import { VehicleMaintenance } from '@/pages/vehicles/VehicleMaintenance';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Vehicle } from '@/model/vehicles/vehicle.types';

export const MaintenancePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery<Vehicle | Vehicle[], Error>({
    queryKey: ['maintenance', id || 'all'],
    queryFn: () => {
      if (id) {
        const vehicle = allVehicles.find(v => v.id === id);
        if (vehicle) return Promise.resolve(vehicle);
        return Promise.reject(new Error('Vehicle not found'));
      }
      return Promise.resolve(allVehicles);
    },
    enabled: true,
  });

  const handleBack = () => {
    if (id) {
      navigate('/maintenance');
    } else {
      navigate('/vehicles');
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><LoadingSpinner /></div>;
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ErrorBoundary>
          <p>Error loading maintenance data.</p>
        </ErrorBoundary>
      </div>
    );
  }

  return <VehicleMaintenance data={data as Vehicle | Vehicle[]} onBack={handleBack} />;
};