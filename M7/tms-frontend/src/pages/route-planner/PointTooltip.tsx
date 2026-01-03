import React from 'react';
import { RoutePoint } from '../../model/shipments';
import { formatDateTime } from '../../lib/date/dateUtils';
import { Clock, MapPin, FileText, Timer, X } from 'lucide-react';

interface PointTooltipProps {
  point: RoutePoint;
  onEdit?: (point: RoutePoint) => void;
  onDelete?: (point: RoutePoint) => void;
  onClose?: () => void;
}

export const PointTooltip: React.FC<PointTooltipProps> = ({ point, onEdit, onDelete, onClose }) => {
  const getTypeLabel = (type: RoutePoint['type']): string => {
    const labels = {
      pickup: 'Pickup Location',
      delivery: 'Delivery Location',
      rest: 'Rest Stop',
      fuel: 'Fuel Station',
      border: 'Border Crossing'
    };
    return labels[type];
  };

  const getTypeColor = (type: RoutePoint['type']): string => {
    const colors = {
      pickup: 'text-green-600',
      delivery: 'text-amber-600',
      rest: 'text-purple-600',
      fuel: 'text-red-600',
      border: 'text-gray-600'
    };
    return colors[type];
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border p-4 min-w-[280px] max-w-[320px] relative">
      {/* Close button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      <div className="flex items-center justify-between mb-3 pr-6">
        <span className={`text-sm font-medium ${getTypeColor(point.type)}`}>
          {getTypeLabel(point.type)}
        </span>
      </div>
      
      <h3 className="font-semibold text-gray-900 mb-2">{point.name}</h3>
      
      {point.address && (
        <div className="flex items-start gap-2 mb-2">
          <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
          <span className="text-sm text-gray-600">{point.address}</span>
        </div>
      )}
      
      <div className="space-y-2">
        {point.estimatedArrival && (
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-500" />
            <span className="text-sm">
              <span className="font-medium">ETA:</span> {formatDateTime(point.estimatedArrival)}
            </span>
          </div>
        )}
        
        {point.estimatedDeparture && (
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-orange-500" />
            <span className="text-sm">
              <span className="font-medium">ETD:</span> {formatDateTime(point.estimatedDeparture)}
            </span>
          </div>
        )}
        
        {point.duration && (
          <div className="flex items-center gap-2">
            <Timer className="w-4 h-4 text-purple-500" />
            <span className="text-sm">
              <span className="font-medium">Duration:</span> {point.duration} minutes
            </span>
          </div>
        )}
        
        {point.notes && (
          <div className="flex items-start gap-2">
            <FileText className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
            <span className="text-sm text-gray-600">{point.notes}</span>
          </div>
        )}
      </div>
      
      {(onEdit || onDelete) && (
        <div className="flex gap-2 mt-3 pt-3 border-t">
          {onEdit && (
            <button
              onClick={() => onEdit(point)}
              className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(point)}
              className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
            >
              Remove
            </button>
          )}
        </div>
      )}
    </div>
  );
};