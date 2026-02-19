import React from 'react';
import { RoutePoint } from '../../model/shipments';
import { formatDateTime } from '../../lib/date/dateUtils';
import { GripVertical, Clock, MapPin, Timer } from 'lucide-react';

interface DraggableRoutePointProps {
  point: RoutePoint;
  index: number;
  isDragging: boolean;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragEnd: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, dropIndex: number) => void;
}

export const DraggableRoutePoint: React.FC<DraggableRoutePointProps> = ({
  point,
  index,
  isDragging,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop
}) => {
  const getTypeColor = (type: RoutePoint['type']) => {
    const colors = {
      pickup: 'bg-green-500',
      delivery: 'bg-amber-500',
      rest: 'bg-purple-500',
      fuel: 'bg-red-500',
      border: 'bg-gray-500'
    };
    return colors[type];
  };

  const getTypeBadgeColor = (type: RoutePoint['type']) => {
    const colors = {
      pickup: 'bg-green-100 text-green-800',
      delivery: 'bg-amber-100 text-amber-800',
      rest: 'bg-purple-100 text-purple-800',
      fuel: 'bg-red-100 text-red-800',
      border: 'bg-gray-100 text-gray-800'
    };
    return colors[type];
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, index)}
      className={`flex items-center gap-4 p-3 border border-gray-200 rounded-lg transition-all cursor-move ${
        isDragging 
          ? 'opacity-50 scale-95 shadow-lg border-blue-300 bg-blue-50' 
          : 'hover:bg-gray-50 hover:border-gray-300 hover:shadow-md'
      }`}
    >
      {/* Drag Handle */}
      <div className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors">
        <GripVertical className="w-5 h-5" />
      </div>

      {/* Point Number */}
      <div className="flex-shrink-0">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${getTypeColor(point.type)}`}>
          {index + 1}
        </div>
      </div>
      
      {/* Point Information */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h5 className="font-medium text-gray-900 truncate">{point.name}</h5>
          <span className={`px-2 py-1 text-xs rounded-full font-medium ${getTypeBadgeColor(point.type)}`}>
            {point.type.charAt(0).toUpperCase() + point.type.slice(1)}
          </span>
        </div>
        {point.address && (
          <p className="text-sm text-gray-600 truncate">{point.address}</p>
        )}
        <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
          {point.estimatedArrival && (
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>ETA: {formatDateTime(point.estimatedArrival)}</span>
            </div>
          )}
          {point.duration && (
            <div className="flex items-center gap-1">
              <Timer className="w-3 h-3" />
              <span>Duration: {point.duration}min</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Coordinates */}
      <div className="flex-shrink-0 text-right">
        <div className="text-sm text-gray-600 flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          <span>{point.coordinates.lat.toFixed(4)}, {point.coordinates.lng.toFixed(4)}</span>
        </div>
      </div>
    </div>
  );
};