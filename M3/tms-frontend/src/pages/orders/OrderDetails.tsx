
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, User } from 'lucide-react';
import { useOrderDetailsQuery } from '@/http/orders.queries';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: order, isLoading } = useOrderDetailsQuery(id || '');

  const orderEvents = [
    {
      id: 1,
      status: 'Order Created',
      timestamp: '2024-06-06 10:00:00',
      description: 'Order placed by customer',
      employee: 'System',
      details: 'Initial order creation and validation'
    },
    {
      id: 2,
      status: 'Payment Confirmed',
      timestamp: '2024-06-06 10:15:00',
      description: 'Payment successfully processed',
      employee: 'Payment System',
      details: 'Credit card payment of $1,250 processed'
    },
    {
      id: 3,
      status: 'Order Approved',
      timestamp: '2024-06-06 11:30:00',
      description: 'Order approved for processing',
      employee: 'Sarah Johnson',
      details: 'Order review completed and approved for shipment preparation'
    },
    {
      id: 4,
      status: 'Preparing Shipment',
      timestamp: '2024-06-06 14:20:00',
      description: 'Shipment preparation started',
      employee: 'Mike Wilson',
      details: 'Items picked from warehouse and packaging initiated'
    },
    {
      id: 5,
      status: 'Ready for Pickup',
      timestamp: '2024-06-06 16:45:00',
      description: 'Package ready for carrier pickup',
      employee: 'David Chen',
      details: 'Final quality check completed, package sealed and labeled'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-green-100 text-green-800';
      case 'delivered': return 'bg-emerald-100 text-emerald-800';
      case 'canceled': return 'bg-red-100 text-red-800';
      case 'returned': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading order details...</div>;
  }

  if (!order) {
    return <div className="flex items-center justify-center h-64">Order not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={() => navigate('/orders')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order #{order.id.toString().padStart(5, '0')}</h1>
          <p className="text-gray-600">Complete order information and timeline</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Order ID</p>
              <p className="font-medium">#{order.id.toString().padStart(5, '0')}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Customer</p>
              <p className="font-medium">{order.customer}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <Badge className={getStatusColor(order.status)}>
                {order.status}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-600">Amount</p>
              <p className="font-medium text-lg">{order.amount}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Order Date</p>
              <p className="font-medium">{order.date}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Expected Delivery</p>
              <p className="font-medium">2024-06-10</p>
            </div>
          </CardContent>
        </Card>

        {/* Order Timeline */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Order Timeline</CardTitle>
            <CardDescription>Complete history of order events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orderEvents.map((event, index) => (
                <div key={event.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{event.status}</h4>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        {new Date(event.timestamp).toLocaleString()}
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{event.description}</p>
                    <p className="text-xs text-gray-600 mb-1">{event.details}</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <User className="h-3 w-3 mr-1" />
                      Executed by: {event.employee}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Order Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Shipping Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Shipping Address</p>
              <p className="font-medium">123 Main Street<br />Boston, MA 02101</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Shipping Method</p>
              <p className="font-medium">Standard Delivery</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Tracking Number</p>
              <p className="font-medium">SH001</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Product A</span>
                <span>$800.00</span>
              </div>
              <div className="flex justify-between">
                <span>Product B</span>
                <span>$350.00</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>$50.00</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>$50.00</span>
              </div>
              <hr />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{order.amount}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrderDetails;
