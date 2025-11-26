import React from 'react';
import { Shipment } from '../../model/shipments';
import { Package, Clock, AlertTriangle, CheckCircle, Truck } from 'lucide-react';

interface ShipmentSelectorProps {
  shipments: Shipment[];
  selectedShipment: Shipment;
  onShipmentSelect: (shipment: Shipment) => void;
}

export const ShipmentSelector: React.FC<ShipmentSelectorProps> = ({
  shipments,
  selectedShipment,
  onShipmentSelect
}) => {
  const getPriorityColor = (priority: Shipment['priority']) => {
    const colors = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-blue-100 text-blue-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    };
    return colors[priority];
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Truck className="w-4 h-4 text-green-600" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-blue-600" />;
      case 'delayed':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Package className="w-5 h-5 text-blue-600" />
        Active Shipments
      </h2>
      
      <div className="grid grid-cols-1 gap-3">
        {shipments.map((shipment) => (
          <button
            key={shipment.id}
            onClick={() => onShipmentSelect(shipment)}
            className={`p-3 rounded-lg border-2 transition-all text-left ${
              selectedShipment.id === shipment.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-gray-900">{shipment.name}</h3>
              {getStatusIcon(shipment.route.status)}
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">{shipment.customer}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(shipment.priority)}`}>
                {shipment.priority.toUpperCase()}
              </span>
            </div>
            
            <div className="mt-2 text-xs text-gray-500">
              {shipment.route.points.length} stops • {shipment.route.totalDistance.toFixed(0)} km
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};