import React from 'react';
import { Vehicle } from '../../model/vehicles';
import { 
  Truck, MapPin, User, Calendar, 
  Wrench, FileText, AlertTriangle,
  Fuel, Shield, Snowflake, Route,
  Container, Box, Layers, Anchor, Globe2
} from 'lucide-react';
import { formatDateTime } from '../../lib/date/dateUtils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../components/ui/tooltip';
import { Link } from 'react-router-dom';
import { useDriversList } from '../../hooks/queries';
import Currency from '../../components/Currency';

interface VehicleTileProps {
  vehicle: Vehicle;
  onVehicleSelect: (vehicle: Vehicle, view: 'routes' | 'maintenance' | 'documents') => void;
}

export const VehicleTile: React.FC<VehicleTileProps> = ({ vehicle, onVehicleSelect }) => {
  const { data: drivers = [] } = useDriversList();
  const driver = drivers.find(d => d.name === vehicle.currentDriver);

  const getStatusColor = (status: Vehicle['status']) => {
    const colors = {
      'available': 'bg-green-100 text-green-800',
      'in-transit': 'bg-blue-100 text-blue-800',
      'maintenance': 'bg-orange-100 text-orange-800',
      'out-of-service': 'bg-red-100 text-red-800'
    };
    return colors[status];
  };

  const getOwnershipColor = (ownership: Vehicle['ownership']['type']) => {
    const colors = {
      'owned': 'bg-green-50 text-green-700',
      'leased': 'bg-blue-50 text-blue-700',
      'rented': 'bg-purple-50 text-purple-700',
      'financed': 'bg-orange-50 text-orange-700'
    };
    return colors[ownership];
  };

  const getVehicleTypeIcon = (type: Vehicle['type']) => {
    const icons = {
      'standard': <Truck className="w-5 h-5" />,
      'tir': <Globe2 className="w-5 h-5" />,
      'refrigerated': <Snowflake className="w-5 h-5" />,
      'hazmat': <Shield className="w-5 h-5" />,
      'container': <Container className="w-5 h-5" />,
      'tanker': <Fuel className="w-5 h-5" />,
      'flatbed': <Layers className="w-5 h-5" />,
      'box-truck': <Box className="w-5 h-5" />,
      'heavy-haul': <Anchor className="w-5 h-5" />
    };
    return icons[type];
  };

  const vehicleTypeDescriptions: Record<Vehicle['type'], string> = {
    'standard': 'Standard Truck',
    'tir': 'TIR Truck',
    'refrigerated': 'Refrigerated Truck',
    'hazmat': 'Hazmat Truck',
    'container': 'Container Truck',
    'tanker': 'Tanker Truck',
    'flatbed': 'Flatbed Truck',
    'box-truck': 'Box Truck',
    'heavy-haul': 'Heavy-Haul Truck'
  };

  const hasMaintenanceAlerts = (vehicle: Vehicle) => {
    const now = new Date();
    const threeMonthsFromNow = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
    
    const hasOverdueTasks = vehicle.maintenanceTasks.some(task => 
      task.status === 'pending' && new Date(task.dueDate) < now
    );
    
    const hasUrgentTasks = vehicle.maintenanceTasks.some(task => 
      task.priority === 'urgent' && task.status === 'pending'
    );
    
    const hasExpiringDocs = vehicle.documents.some(doc => 
      doc.expiryDate && new Date(doc.expiryDate) <= threeMonthsFromNow
    );
    
    return hasOverdueTasks || hasUrgentTasks || hasExpiringDocs;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border hover:shadow-xl transition-shadow">
      <div className="p-6">
        <TooltipProvider>
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Tooltip>
                <TooltipTrigger>
                  <div className="bg-blue-100 p-2 rounded-full">
                    {getVehicleTypeIcon(vehicle.type)}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{vehicleTypeDescriptions[vehicle.type]}</p>
                </TooltipContent>
              </Tooltip>
              <div>
                <h3 className="font-semibold text-gray-900">{vehicle.plateNumber}</h3>
                <p className="text-sm text-gray-500">{vehicle.make} {vehicle.model}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {hasMaintenanceAlerts(vehicle) && (
                <Tooltip>
                  <TooltipTrigger>
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>This vehicle has maintenance alerts.</p>
                  </TooltipContent>
                </Tooltip>
              )}
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(vehicle.status)}`}>
                {vehicle.status.replace('-', ' ').toUpperCase()}
              </span>
            </div>
          </div>

          {/* Vehicle Details */}
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Type:</span>
              <span className="font-medium capitalize">{vehicle.type.replace('-', ' ')}</span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Year:</span>
              <span className="font-medium">{vehicle.year}</span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Mileage:</span>
              <span className="font-medium">{vehicle.mileage.toLocaleString()} km</span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Capacity:</span>
              <span className="font-medium">{vehicle.capacity.weight}t / {vehicle.capacity.volume}m³</span>
            </div>
            
            {vehicle.currentDriver && (
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-gray-400" />
                {driver ? (
                  <Link to={`/drivers/${driver.id}/details`} className="text-blue-600 hover:underline">
                    {vehicle.currentDriver}
                  </Link>
                ) : (
                  <span className="text-gray-600">{vehicle.currentDriver}</span>
                )}
              </div>
            )}
            
            {vehicle.currentLocation && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{vehicle.currentLocation.address}</span>
              </div>
            )}
          </div>

          {/* Cargo Capabilities */}
          <div className="mb-4">
            <div className="text-sm text-gray-500 mb-2">Cargo Types:</div>
            <div className="flex flex-wrap gap-1">
              {vehicle.cargoTypes.slice(0, 3).map(type => (
                <span key={type} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                  {type.replace('-', ' ')}
                </span>
              ))}
              {vehicle.cargoTypes.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                  +{vehicle.cargoTypes.length - 3} more
                </span>
              )}
            </div>
          </div>

          {/* Ownership */}
          <div className="flex items-center justify-between mb-4">
            <span className={`px-2 py-1 rounded text-xs font-medium ${getOwnershipColor(vehicle.ownership.type)}`}>
              {vehicle.ownership.type.toUpperCase()}
            </span>
            {vehicle.ownership.monthlyPayment && (
              <div className="flex items-center">
                <span className="text-gray-500">Monthly Cost:</span>
                <div className="ml-2 font-semibold">
                  <Currency value={vehicle.ownership.monthlyPayment} />
                  /mo
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => onVehicleSelect(vehicle, 'routes')}
                  className="flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                >
                  <Route className="w-4 h-4" />
                  <span className="hidden sm:inline">Routes</span>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Vehicle Routes</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => onVehicleSelect(vehicle, 'maintenance')}
                  className="flex items-center justify-center gap-1 px-3 py-2 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors text-sm"
                >
                  <Wrench className="w-4 h-4" />
                  <span className="hidden sm:inline">Maintenance</span>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Vehicle Maintenance</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => onVehicleSelect(vehicle, 'documents')}
                  className="flex items-center justify-center gap-1 px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm"
                >
                  <FileText className="w-4 h-4" />
                  <span className="hidden sm:inline">Docs</span>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Vehicle Documents</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>
    </div>
  );
};