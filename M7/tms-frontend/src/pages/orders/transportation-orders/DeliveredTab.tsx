import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle } from 'lucide-react';
import { DeliveredOrder } from '@/http/orders.model';

interface DeliveredTabProps {
  deliveredOrders: DeliveredOrder[];
}

const DeliveredTab: React.FC<DeliveredTabProps> = ({ deliveredOrders }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Delivered Orders</CardTitle>
        <CardDescription>Successfully completed deliveries</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {deliveredOrders.map((order) => (
            <div key={order.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-lg">{order.id} - {order.customer}</h3>
                  <p className="text-gray-600">
                    <Clock className="h-4 w-4 inline mr-1" />
                    Delivered: {order.deliveredAt}
                  </p>
                </div>
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Delivered
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Recipient</p>
                  <p className="font-medium">{order.recipient}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Acceptance</p>
                  <p className="font-medium text-green-600">
                    {order.accepted ? 'Accepted' : 'Pending'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Digital Signature</p>
                  <a 
                    href={order.signatureLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View Signature
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DeliveredTab;
