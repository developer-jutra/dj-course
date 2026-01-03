import React, { useState } from 'react';
import { RoutePoint } from '../../model/shipments';
import { DraggableRoutePoint } from './DraggableRoutePoint';
import { MapPin, ArrowUpDown } from 'lucide-react';

interface DraggableRouteListProps {
  points: RoutePoint[];
  onReorderPoints: (newPoints: RoutePoint[]) => void;
}

export const DraggableRouteList: React.FC<DraggableRouteListProps> = ({
  points,
  onReorderPoints
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.currentTarget.outerHTML);
    e.dataTransfer.setDragImage(e.currentTarget as Element, 0, 0);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Only clear drag over if we're leaving the entire component
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setDragOverIndex(null);
    }
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      return;
    }

    const newPoints = [...points];
    const draggedPoint = newPoints[draggedIndex];
    
    // Remove the dragged item
    newPoints.splice(draggedIndex, 1);
    
    // Insert at the new position
    const insertIndex = draggedIndex < dropIndex ? dropIndex - 1 : dropIndex;
    newPoints.splice(insertIndex, 0, draggedPoint);
    
    onReorderPoints(newPoints);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  if (points.length === 0) {
    return (
      <div className="text-center py-8">
        <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h4 className="text-lg font-medium text-gray-900 mb-2">No Route Points</h4>
        <p className="text-gray-500">
          Start adding points to your route using the controls on the left
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <ArrowUpDown className="w-4 h-4 text-gray-500" />
        <span className="text-sm text-gray-600">Drag and drop to reorder route points</span>
      </div>
      
      <div className="space-y-2">
        {points.map((point, index) => (
          <div
            key={point.id}
            onDragEnter={(e) => handleDragEnter(e, index)}
            onDragLeave={handleDragLeave}
            className={`relative ${
              dragOverIndex === index && draggedIndex !== index
                ? 'border-t-2 border-blue-500 pt-2'
                : ''
            }`}
          >
            <DraggableRoutePoint
              point={point}
              index={index}
              isDragging={draggedIndex === index}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            />
          </div>
        ))}
      </div>
      
      {/* Drop zone at the end */}
      <div
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, points.length)}
        onDragEnter={(e) => handleDragEnter(e, points.length)}
        onDragLeave={handleDragLeave}
        className={`h-8 border-2 border-dashed rounded-lg transition-colors ${
          dragOverIndex === points.length && draggedIndex !== null
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300'
        }`}
      >
        {dragOverIndex === points.length && draggedIndex !== null && (
          <div className="flex items-center justify-center h-full text-sm text-blue-600 font-medium">
            Drop here to move to end
          </div>
        )}
      </div>
    </div>
  );
};