import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FleetMap } from './FleetMap';
import { Vehicle } from '@/model/vehicles';
import { sampleShipments } from '@/model/shipments/shipments.mocks';
import { Link } from 'react-router-dom';

interface LiveFleetMapProps {
  vehicles: Vehicle[];
}

const statusConfig: Record<Vehicle['status'], { label: string; color: string }> = {
  'in-transit': { label: 'In Transit', color: 'text-blue-600' },
  available: { label: 'Available', color: 'text-green-600' },
  maintenance: { label: 'Maintenance', color: 'text-orange-600' },
  'out-of-service': { label: 'Out of Service', color: 'text-red-600' },
};

const LiveFleetMap: React.FC<LiveFleetMapProps> = ({ vehicles }) => {
  const statusCounts = vehicles.reduce((acc, vehicle) => {
    acc[vehicle.status] = (acc[vehicle.status] || 0) + 1;
    return acc;
  }, {} as Record<Vehicle['status'], number>);

  return (
    <Card>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
        {(Object.keys(statusConfig) as Array<Vehicle['status']>).map(status => (
          <div key={status}>
            <p className="text-sm text-gray-600">{statusConfig[status].label}</p>
            <p className={`text-2xl font-bold ${statusConfig[status].color}`}>
              {statusCounts[status] || 0}
            </p>
          </div>
        ))}
      </div>
      <CardContent className="h-96 rounded-lg overflow-hidden p-0">
        <FleetMap items={vehicles.map(vehicle => {
          const activeShipment = sampleShipments.find(s => s.route.vehicle.id === vehicle.id && s.route.status === 'active');
          return {
            coordinates: [vehicle.currentLocation?.lat ?? 0, vehicle.currentLocation?.lng ?? 0],
            description: {
              title: vehicle.model,
              content: <>
                <span className="block">
                  <strong>Driver</strong>: {vehicle.currentDriver || 'N/A'}
                </span>
                <span className="block">
                  <strong>Status</strong>: {statusConfig[vehicle.status].label}
                </span>
                {activeShipment && (
                  <Link to={`/shipments/${activeShipment.id}/track`} className="text-blue-500 hover:underline">
                    View Route
                  </Link>
                )}
              </>,
            }
          }
        })} />
      </CardContent>
    </Card>
  );
};

export default LiveFleetMap;
