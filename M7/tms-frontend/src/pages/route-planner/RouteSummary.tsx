import React from 'react';
import { RouteData } from '../../model/shipments';
import { Clock, MapPin, Calendar, AlertTriangle } from 'lucide-react';
import { formatDateTime, formatTime } from '../../lib/date/dateUtils';
import { DraggableRouteList } from './DraggableRouteList';

interface RouteSummaryProps {
  route: RouteData;
  onReorderPoints?: (newPoints: RouteData['points']) => void;
  allowReordering?: boolean;
}

export const RouteSummary: React.FC<RouteSummaryProps> = ({ 
  route, 
  onReorderPoints,
  allowReordering = false 
}) => {
  const getEarliestETA = () => {
    const etas = route.points
      .filter(p => p.estimatedArrival)
      .map(p => p.estimatedArrival!)
      .sort((a, b) => a.getTime() - b.getTime());
    return etas[0];
  };

  const getLatestETD = () => {
    const etds = route.points
      .filter(p => p.estimatedDeparture)
      .map(p => p.estimatedDeparture!)
      .sort((a, b) => b.getTime() - a.getTime());
    return etds[0];
  };

  const earliestETA = getEarliestETA();
  const latestETD = getLatestETD();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="font-semibold text-gray-900 mb-6 flex items-center gap-2">
        <MapPin className="w-5 h-5 text-blue-600" />
        Current Route Stops
      </h3>
      
      {route.points.length > 0 ? (
        <div className="space-y-4">
          {/* Route Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{route.points.length}</div>
              <div className="text-sm text-gray-600">Total Stops</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{route.totalDistance.toFixed(0)} km</div>
              <div className="text-sm text-gray-600">Distance</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{Math.floor(route.estimatedDuration / 60)}h {route.estimatedDuration % 60}m</div>
              <div className="text-sm text-gray-600">Duration</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold capitalize ${
                route.status === 'active' ? 'text-green-600' :
                route.status === 'delayed' ? 'text-red-600' :
                route.status === 'completed' ? 'text-blue-600' :
                'text-gray-600'
              }`}>
                {route.status}
              </div>
              <div className="text-sm text-gray-600">Status</div>
            </div>
          </div>

          {/* Schedule Information */}
          {(route.startTime || earliestETA || latestETD || route.estimatedCompletion) && (
            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Schedule Overview
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {route.startTime && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Start Time:</span>
                    <span className="font-medium">{formatDateTime(route.startTime)}</span>
                  </div>
                )}
                
                {earliestETA && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">First ETA:</span>
                    <span className="font-medium text-green-600">{formatDateTime(earliestETA)}</span>
                  </div>
                )}
                
                {latestETD && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Final ETD:</span>
                    <span className="font-medium text-orange-600">{formatDateTime(latestETD)}</span>
                  </div>
                )}
                
                {route.estimatedCompletion && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Est. Completion:</span>
                    <span className="font-medium text-blue-600">{formatDateTime(route.estimatedCompletion)}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Route Points Breakdown */}
          <div className="border-t pt-4">
            <h4 className="font-medium text-gray-900 mb-3">Points Breakdown</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {['pickup', 'delivery', 'rest', 'fuel', 'border'].map(type => {
                const count = route.points.filter(p => p.type === type).length;
                if (count === 0) return null;
                
                const colors = {
                  pickup: 'text-green-600',
                  delivery: 'text-amber-600',
                  rest: 'text-purple-600',
                  fuel: 'text-red-600',
                  border: 'text-gray-600'
                };
                
                return (
                  <div key={type} className="flex justify-between">
                    <span className="text-gray-600 capitalize">{type}:</span>
                    <span className={`font-medium ${colors[type as keyof typeof colors]}`}>{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Draggable Route Points List */}
          <div className="border-t pt-4">
            <h4 className="font-medium text-gray-900 mb-3">Route Points</h4>
            {allowReordering && onReorderPoints ? (
              <DraggableRouteList
                points={route.points}
                onReorderPoints={onReorderPoints}
              />
            ) : (
              <div className="space-y-2">
                {route.points.map((point, index) => (
                  <div key={point.id} className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg">
                    <div className="flex-shrink-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                        point.type === 'pickup' ? 'bg-green-500' :
                        point.type === 'delivery' ? 'bg-amber-500' :
                        point.type === 'rest' ? 'bg-purple-500' :
                        point.type === 'fuel' ? 'bg-red-500' :
                        'bg-gray-500'
                      }`}>
                        {index + 1}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="font-medium text-gray-900 truncate">{point.name}</h5>
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                          point.type === 'pickup' ? 'bg-green-100 text-green-800' :
                          point.type === 'delivery' ? 'bg-amber-100 text-amber-800' :
                          point.type === 'rest' ? 'bg-purple-100 text-purple-800' :
                          point.type === 'fuel' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {point.type.charAt(0).toUpperCase() + point.type.slice(1)}
                        </span>
                      </div>
                      {point.address && (
                        <p className="text-sm text-gray-600 truncate">{point.address}</p>
                      )}
                      <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                        {point.estimatedArrival && (
                          <span>ETA: {formatDateTime(point.estimatedArrival)}</span>
                        )}
                        {point.duration && (
                          <span>Duration: {point.duration}min</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex-shrink-0 text-right">
                      <div className="text-sm text-gray-600">
                        {point.coordinates.lat.toFixed(4)}, {point.coordinates.lng.toFixed(4)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">No Route Points</h4>
          <p className="text-gray-500">
            Start adding points to your route using the controls on the left
          </p>
        </div>
      )}
    </div>
  );
};