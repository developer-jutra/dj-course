import React from 'react';
import { Driver } from '../../model/drivers';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  AlertTriangle,
  MapPin,
  ExternalLink,
  Route,
  CalendarDays
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../components/ui/tooltip';
import { ActionTile } from '../../components/ui/action-tile';
import { formatDateTime } from '../../lib/date/dateUtils';

interface DriverTileProps {
  driver: Driver;
  onDriverSelect: (driver: Driver) => void;
  onDriverRoutes: (driver: Driver) => void;
  onDriverCalendar: (driver: Driver) => void;
}

export const DriverTile: React.FC<DriverTileProps> = ({ 
  driver, 
  onDriverSelect, 
  onDriverRoutes, 
  onDriverCalendar 
}) => {
  const getStatusColor = (status: Driver['status']) => {
    const colors = {
      'active': 'bg-green-100 text-green-800',
      'on-route': 'bg-blue-100 text-blue-800',
      'resting': 'bg-yellow-100 text-yellow-800',
      'off-duty': 'bg-gray-100 text-gray-800',
      'sick-leave': 'bg-red-100 text-red-800'
    };
    return colors[status];
  };

  const getContractTypeColor = (type: Driver['contractType']) => {
    const colors = {
      'full-time': 'bg-blue-50 text-blue-700',
      'contractor': 'bg-orange-50 text-orange-700'
    };
    return colors[type];
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border hover:shadow-xl transition-shadow">
      <div className="p-6">
        <TooltipProvider>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{driver.name}</h3>
                <p className="text-sm text-gray-500">ID: {driver.id}</p>
              </div>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(driver.status)}`}>
              {driver.status.replace('-', ' ').toUpperCase()}
            </span>
          </div>

          <div className="space-y-3 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">{driver.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">{driver.phone}</span>
            </div>
            {driver.currentLocation && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{driver.currentLocation.address}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mb-4">
            <span className={`px-2 py-1 rounded text-xs font-medium ${getContractTypeColor(driver.contractType)}`}>
              {driver.contractType.replace('-', ' ').toUpperCase()}
            </span>
            <span className="text-sm font-medium text-gray-900">
              {driver.salary.toLocaleString()} {driver.currency}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
            <div>
              <span className="text-gray-500">Active Routes:</span>
              <span className="ml-1 font-medium">{driver.routes.filter(r => r.status === 'active').length}</span>
            </div>
            <div>
              <span className="text-gray-500">Total Routes:</span>
              <span className="ml-1 font-medium">{driver.routes.length}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <ActionTile
                  label={
                    <>
                      <ExternalLink className="w-4 h-4" />
                      <span className="hidden sm:inline">Details</span>
                    </>
                  }
                  variant="blue"
                  onClick={() => onDriverSelect(driver)}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>Driver Details</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <ActionTile
                  label={
                    <>
                      <Route className="w-4 h-4" />
                      <span className="hidden sm:inline">Routes</span>
                    </>
                  }
                  variant="green"
                  onClick={() => onDriverRoutes(driver)}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>Driver Routes</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <ActionTile
                  label={
                    <>
                      <CalendarDays className="w-4 h-4" />
                      <span className="hidden sm:inline">Calendar</span>
                    </>
                  }
                  variant="purple"
                  onClick={() => onDriverCalendar(driver)}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>Driver Calendar</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>
    </div>
  );
};