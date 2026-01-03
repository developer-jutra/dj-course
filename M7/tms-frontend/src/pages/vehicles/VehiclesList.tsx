import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Vehicle } from '../../model/vehicles';
import { Truck } from 'lucide-react';
import { VehicleTile } from './VehicleTile';

interface VehiclesListProps {
  vehicles: Vehicle[];
}

export const VehiclesList: React.FC<VehiclesListProps> = ({ vehicles }) => {
  const navigate = useNavigate();

  const handleVehicleSelect = (vehicle: Vehicle, view: 'routes' | 'maintenance' | 'documents') => {
    if (view === 'documents') {
      navigate(`/documents?entityType=vehicle&entityId=${vehicle.id}`);
    } else if (view === 'routes') {
      navigate(`/routes?context=vehicle-routes&entityId=${vehicle.id}`);
    } else {
      navigate(`/maintenance/${vehicle.id}`);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {vehicles.map((vehicle) => (
          <VehicleTile
            key={vehicle.id}
            vehicle={vehicle}
            onVehicleSelect={handleVehicleSelect}
          />
        ))}
      </div>

      {vehicles.length === 0 && (
        <div className="text-center py-12">
          <Truck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No vehicles found</h3>
          <p className="text-gray-500">Try adjusting your search criteria or filters.</p>
        </div>
      )}
    </>
  );
};