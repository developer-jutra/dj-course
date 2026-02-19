import React, { useState } from 'react';
import { RouteData, RoutePoint } from '../../model/shipments';
import { Plus, Route, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import { calculateRouteDistance } from './routeUtils';

interface RouteControlsProps {
  route: RouteData;
  onAddPoint: (type: RoutePoint['type']) => void;
  onOptimizeRoute: () => void;
  onAddRestStops: () => void;
}

export const RouteControls: React.FC<RouteControlsProps> = ({
  route,
  onAddPoint,
  onOptimizeRoute,
  onAddRestStops
}) => {
  const [showAddOptions, setShowAddOptions] = useState(false);

  const pointTypes: { type: RoutePoint['type']; label: string; icon: string; color: string }[] = [
    { type: 'pickup', label: 'Pickup Point', icon: '📦', color: 'bg-green-50 hover:bg-green-100 border-green-200' },
    { type: 'delivery', label: 'Delivery Point', icon: '🏭', color: 'bg-amber-50 hover:bg-amber-100 border-amber-200' },
    { type: 'rest', label: 'Rest Stop', icon: '🛏️', color: 'bg-purple-50 hover:bg-purple-100 border-purple-200' },
    { type: 'fuel', label: 'Fuel Station', icon: '⛽', color: 'bg-red-50  hover:bg-red-100 border-red-200' },
    { type: 'border', label: 'Border Crossing', icon: '🛂', color: 'bg-gray-50 hover:bg-gray-100 border-gray-200' }
  ];

  const handleAddPoint = (type: RoutePoint['type']) => {
    onAddPoint(type);
    setShowAddOptions(false);
  };

  // Check if route requires mandatory rest stops
  const requiresRestStops = () => {
    const totalDistance = route.totalDistance;
    const estimatedDrivingTime = route.estimatedDuration;
    const restStops = route.points.filter(p => p.type === 'rest').length;
    
    // EU regulation: 45min break after 4.5h driving, or every ~360km
    const requiredRestStops = Math.floor(Math.max(estimatedDrivingTime / 270, totalDistance / 360));
    
    return requiredRestStops > restStops;
  };

  const getRestStopWarning = () => {
    const totalDistance = route.totalDistance;
    const estimatedDrivingTime = route.estimatedDuration;
    const restStops = route.points.filter(p => p.type === 'rest').length;
    
    const requiredByTime = Math.floor(estimatedDrivingTime / 270);
    const requiredByDistance = Math.floor(totalDistance / 360);
    const requiredRestStops = Math.max(requiredByTime, requiredByDistance);
    
    if (requiredRestStops > restStops) {
      const missing = requiredRestStops - restStops;
      return `This route requires ${missing} additional mandatory rest stop${missing > 1 ? 's' : ''} (EU regulation: 45min break every 4.5h driving)`;
    }
    
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Route className="w-5 h-5 text-blue-600" />
          Route Planning
        </h2>
        
        {!showAddOptions ? (
          <button
            onClick={() => setShowAddOptions(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Route Point
            <ChevronDown className="w-4 h-4" />
          </button>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Select point type:</span>
              <button
                onClick={() => setShowAddOptions(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              {pointTypes.map(({ type, label, icon, color }) => (
                <button
                  key={type}
                  onClick={() => handleAddPoint(type)}
                  className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors border ${color}`}
                >
                  <span className="text-lg">{icon}</span>
                  <span className="font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-4 space-y-2">
          <button
            onClick={onOptimizeRoute}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Route className="w-4 h-4" />
            Optimize Route
          </button>
        </div>

        {/* Mandatory Rest Stops Warning */}
        {route.points.length > 0 && requiresRestStops() && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-red-800 text-sm mb-1">
                  Mandatory Rest Stops Required
                </h4>
                <p className="text-red-700 text-xs">
                  {getRestStopWarning()}
                </p>
                <button
                  onClick={onAddRestStops}
                  className="mt-2 text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition-colors"
                >
                  Add Required Rest Stops
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};