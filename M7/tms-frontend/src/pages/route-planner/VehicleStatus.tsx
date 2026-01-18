import React from 'react';
import { Vehicle } from '../../model/vehicles';
import { Truck, User, Hash, MapPin, Clock, ExternalLink } from 'lucide-react';
import { formatDateTime } from '../../lib/date/dateUtils';

interface VehicleStatusProps {
  vehicle: Vehicle;
}

export const VehicleStatus: React.FC<VehicleStatusProps> = ({ vehicle }) => {
  const handleDriverClick = () => {
    // In a real application, this would navigate to driver details
    console.log('Navigate to driver details:', vehicle.currentDriver);
  };

  const handleVehicleClick = () => {
    // In a real application, this would navigate to vehicle details
    console.log('Navigate to vehicle details:', vehicle.plateNumber);
  };

  const handleLocationClick = () => {
    // In a real application, this would show detailed location info
    console.log('Show location details:', vehicle.currentLocation);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Truck className="w-5 h-5 text-blue-600" />
        Vehicle Status
      </h3>
      
      <div className="space-y-4">
        {/* Driver Information */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">Driver:</span>
          </div>
          <button
            onClick={handleDriverClick}
            className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            {vehicle.currentDriver}
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        {/* Vehicle Information */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Hash className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">Vehicle:</span>
          </div>
          <button
            onClick={handleVehicleClick}
            className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            {vehicle.plateNumber}
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        {/* Location */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">Location:</span>
          </div>
          <button
            onClick={handleLocationClick}
            className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            {vehicle.currentLocation?.address || 'Location not available'}
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        {/* Status Indicator */}
        <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-800">Vehicle Online</span>
          </div>
          <p className="text-xs text-green-600 mt-1">GPS tracking active</p>
        </div>
      </div>
    </div>
  );
};