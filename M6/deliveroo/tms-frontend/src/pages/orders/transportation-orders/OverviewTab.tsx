import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Order } from '@/http/orders.model';

export interface OrdersByStatus {
  processing: Order[];
  shipped: Order[];
  delivered: Order[];
  canceled: Order[];
}

interface OverviewTabProps {
  ordersByStatus: OrdersByStatus;
  getStatusColor: (status: string) => string;
  getColumnColor: (status: string) => string;
  handleViewDetails: (orderId: number) => void;
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  ordersByStatus,
  getStatusColor,
  getColumnColor,
  handleViewDetails,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Transportation Overview</CardTitle>
        <CardDescription>Kanban board view of all orders by status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Object.entries(ordersByStatus).map(([status, statusOrders]) => (
            <div key={status} className={`p-4 rounded-lg border-2 ${getColumnColor(status)}`}>
              <h3 className="font-semibold mb-4 capitalize flex items-center justify-between">
                {status}
                <span className="text-sm bg-white px-2 py-1 rounded-full">
                  {statusOrders.length}
                </span>
              </h3>
              <div className="space-y-3">
                {statusOrders.map((order) => (
                  <Card key={order.id} className="p-3 hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleViewDetails(order.id)}>
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <p className="font-medium text-sm">#{order.id.toString().padStart(5, '0')}</p>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium">{order.customer}</p>
                      <p className="text-xs text-gray-600">{order.date}</p>
                      <p className="text-sm font-semibold text-blue-600">{order.amount}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default OverviewTab;
