import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, Clock } from 'lucide-react';
import { useShipmentDetailsQuery } from '@/http/shipments.queries';
import { FleetMap } from '../vehicles/FleetMap';
import { vehicles } from '@/model/vehicles/vehicles.mocks';
import { sampleShipments } from '@/model/shipments/shipments.mocks';
import { generateShipmentRoutePDF } from '@/lib/pdf/shipmentRoutePdfGenerator'
import { useDriversQuery } from '@/http/drivers.queries';
import { Link } from 'react-router-dom';

const ShipmentTracking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: shipment, isLoading } = useShipmentDetailsQuery(id || '');
  const { data: drivers = [] } = useDriversQuery();

  const currentShipment = sampleShipments.find(s => s.id === id);
  const vehicleId = currentShipment?.route.vehicle.id;
  const vehicle = vehicles.find(v => v.id === vehicleId);

  const latitude = vehicle?.currentLocation?.lat ?? 52.2297; // Default to Warsaw
  const longitude = vehicle?.currentLocation?.lng ?? 21.0122;
  const driver = drivers.find(d => d.name === shipment?.driver);

  const trackingEvents = [
    {
      id: 1,
      status: 'Package Picked Up',
      location: shipment?.origin || 'New York, NY',
      timestamp: '2024-01-15 14:15:00',
      description: 'Package collected from sender'
    },
    {
      id: 2,
      status: 'In Transit',
      location: 'Newark, NJ',
      timestamp: '2024-01-15 16:30:00',
      description: 'Package in transit to destination'
    },
    {
      id: 3,
      status: 'In Transit',
      location: 'Hartford, CT',
      timestamp: '2024-01-16 09:45:00',
      description: 'Package continues journey'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'in transit': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'package picked up': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading shipment details...</div>;
  }

  if (!shipment) {
    return <div className="flex items-center justify-center h-64">Shipment not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={() => navigate('/shipments')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Shipments
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Track Shipment #{shipment.id}</h1>
          <p className="text-gray-600">Real-time shipment tracking and location</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Shipment Details Card */}
        <Card>
          <CardHeader>
            <CardTitle>Shipment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <Badge className={getStatusColor(shipment.status)}>
                {shipment.status}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-600">Driver</p>
              {driver ? (
                <Link to={`/drivers/${driver.id}/details`} className="font-medium text-blue-600 hover:underline">
                  {shipment.driver}
                </Link>
              ) : (
                <p className="font-medium">{shipment.driver}</p>
              )}
            </div>
            <div>
              <p className="text-sm text-gray-600">From</p>
              <p className="font-medium flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {shipment.origin}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">To</p>
              <p className="font-medium flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {shipment.destination}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">ETA</p>
              <p className="font-medium flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {shipment.eta}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Static Map Placeholder */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Live Tracking</CardTitle>
            <CardDescription>Current shipment location and route</CardDescription>
          </CardHeader>
          <CardContent className="h-96 rounded-lg overflow-hidden">
            <FleetMap items={[{
              coordinates: [latitude, longitude],
              description: {
                title: shipment.driver,
                content: <>
                  <span className="block">
                    <strong>From</strong>: {shipment.origin}
                  </span>
                  <span className="block">
                    <strong>To</strong>: {shipment.destination}
                  </span>
                  <span className="block">
                    <strong>ETA</strong>: {shipment.eta}
                  </span>
                </>,
              }
            }]} />
          </CardContent>
        </Card>
      </div>

      {/* Tracking Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Tracking Timeline</CardTitle>
          <CardDescription>Shipment progress and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {trackingEvents.map((event, index) => (
              <div key={event.id} className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className={`w-3 h-3 rounded-full ${
                    index === trackingEvents.length - 1 ? 'bg-blue-500' : 'bg-green-500'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">{event.status}</p>
                    <p className="text-sm text-gray-500">{event.timestamp}</p>
                  </div>
                  <p className="text-sm text-gray-600">{event.location}</p>
                  <p className="text-sm text-gray-500">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-6">
            <Button onClick={() => generateShipmentRoutePDF({
              id: shipment.id,
              origin: shipment.origin,
              destination: shipment.destination,
              driver: shipment.driver,
              eta: shipment.eta,
              status: shipment.status
            }, trackingEvents)}>
              Generate Route PDF
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShipmentTracking;
