import React from 'react';
import { Vehicle } from '../../model/vehicles';
import { Search, Filter, Truck, X, Home, LayoutGrid, List } from 'lucide-react';
import { Button } from '../../components/ui/button';

interface VehicleFiltersProps {
  searchTerm: string;
  statusFilter: 'all' | Vehicle['status'];
  typeFilter: 'all' | Vehicle['type'];
  ownershipFilter: 'all' | Vehicle['ownership']['type'];
  view: 'grid' | 'table';
  onSearchChange: (value: string) => void;
  onStatusChange: (value: 'all' | Vehicle['status']) => void;
  onTypeChange: (value: 'all' | Vehicle['type']) => void;
  onOwnershipChange: (value: 'all' | Vehicle['ownership']['type']) => void;
  onViewChange: (view: 'grid' | 'table') => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  resultCount: number;
}

export const VehicleFilters: React.FC<VehicleFiltersProps> = ({
  searchTerm,
  statusFilter,
  typeFilter,
  ownershipFilter,
  view,
  onSearchChange,
  onStatusChange,
  onTypeChange,
  onOwnershipChange,
  onViewChange,
  onClearFilters,
  hasActiveFilters,
  resultCount
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 flex-1">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search vehicles..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full md:w-48 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <Filter className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => onStatusChange(e.target.value as Vehicle['status'] | 'all')}
              className="w-full md:w-40 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="all">All Statuses</option>
              <option value="available">Available</option>
              <option value="in-transit">In Transit</option>
              <option value="maintenance">Maintenance</option>
              <option value="out-of-service">Out of Service</option>
            </select>
          </div>
          
          <div className="relative">
            <Truck className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={typeFilter}
              onChange={(e) => onTypeChange(e.target.value as Vehicle['type'] | 'all')}
              className="w-full md:w-40 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="all">All Types</option>
              <option value="standard">Standard</option>
              <option value="tir">TIR</option>
              <option value="refrigerated">Refrigerated</option>
              <option value="hazmat">Hazmat</option>
              <option value="container">Container</option>
              <option value="tanker">Tanker</option>
              <option value="flatbed">Flatbed</option>
              <option value="box-truck">Box Truck</option>
              <option value="heavy-haul">Heavy Haul</option>
            </select>
          </div>

          <div className="relative">
            <Home className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={ownershipFilter}
              onChange={(e) => onOwnershipChange(e.target.value as Vehicle['ownership']['type'] | 'all')}
              className="w-full md:w-40 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="all">All Ownerships</option>
              <option value="owned">Owned</option>
              <option value="leased">Leased</option>
              <option value="rented">Rented</option>
              <option value="financed">Financed</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="text-sm text-gray-600">
              <span className="font-medium">{resultCount}</span> vehicles found
            </div>
            {hasActiveFilters && (
              <button
                onClick={onClearFilters}
                className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors"
                title="Clear all filters"
              >
                <X className="w-3 h-3" />
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
            <Button variant={view === 'grid' ? 'default' : 'outline'} size="icon" onClick={() => onViewChange('grid')}>
                <LayoutGrid className="h-5 w-5" />
            </Button>
            <Button variant={view === 'table' ? 'default' : 'outline'} size="icon" onClick={() => onViewChange('table')}>
                <List className="h-5 w-5" />
            </Button>
        </div>
      </div>
    </div>
  );
};