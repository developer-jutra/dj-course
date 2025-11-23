import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, CheckCircle, AlertCircle } from 'lucide-react';
import { IncomingRequest } from '@/http/orders.model';

interface IncomingRequestsTabProps {
  incomingRequests: IncomingRequest[];
}

const IncomingRequestsTab: React.FC<IncomingRequestsTabProps> = ({ incomingRequests }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Incoming Requests</CardTitle>
        <CardDescription>Customer-submitted orders awaiting approval</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {incomingRequests.map((request) => (
            <div key={request.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-lg">{request.id} - {request.customer}</h3>
                  <p className="text-gray-600 flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {request.address}
                  </p>
                </div>
                <div className="flex space-x-2">
                  {request.approved && (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Approved
                    </Badge>
                  )}
                  {request.conflicts && (
                    <Badge className="bg-red-100 text-red-800">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Conflict
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Preferred Date</p>
                  <p className="font-medium">{request.preferredDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Cargo Type</p>
                  <p className="font-medium">{request.cargoType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Mass/Volume</p>
                  <p className="font-medium">{request.mass} / {request.volume}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Estimated Cost</p>
                  <p className="font-medium text-green-600">{request.estimatedCost}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex space-x-4 text-sm text-gray-600">
                  <span>⏱️ {request.estimatedTime}</span>
                  <span>📍 {request.distance}</span>
                  <a href="#" className="text-blue-600 hover:underline">View Route</a>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">Assign Driver</Button>
                  <Button size="sm" disabled={request.approved}>
                    {request.approved ? 'Approved' : 'Approve Order'}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default IncomingRequestsTab;
