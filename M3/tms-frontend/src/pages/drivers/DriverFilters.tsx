import React from 'react';
import { Driver } from '../../model/drivers';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';

interface DriverFiltersProps {
  searchTerm: string;
  statusFilter: 'all' | Driver['status'];
  contractTypeFilter: 'all' | Driver['contractType'];
  onSearchChange: (value: string) => void;
  onStatusChange: (value: 'all' | Driver['status']) => void;
  onContractTypeChange: (value: 'all' | Driver['contractType']) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  resultCount: number;
}

export const DriverFilters: React.FC<DriverFiltersProps> = ({
  searchTerm,
  statusFilter,
  contractTypeFilter,
  onSearchChange,
  onStatusChange,
  onContractTypeChange,
  onClearFilters,
  hasActiveFilters,
  resultCount
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Search */}
        <div className="relative">
          <Input
            type="text"
            placeholder="Search drivers..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        {/* Status Filter */}
        <div className="relative">
          <Select onValueChange={onStatusChange} defaultValue="all">
            <SelectTrigger className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="on-route">On Route</SelectItem>
              <SelectItem value="resting">Resting</SelectItem>
              <SelectItem value="off-duty">Off Duty</SelectItem>
              <SelectItem value="sick-leave">Sick Leave</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Contract Type Filter */}
        <div className="relative">
          <Select onValueChange={onContractTypeChange} defaultValue="all">
            <SelectTrigger className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none">
              <SelectValue placeholder="Select contract type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Contract Types</SelectItem>
              <SelectItem value="full-time">Full Time</SelectItem>
              <SelectItem value="contractor">Contractor</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Results Count and Clear */}
        <div className="md:col-span-2 flex items-center justify-between gap-4">
          <div className="text-sm text-gray-600 flex items-center">
            <span className="font-medium">{resultCount}</span>
            <span className="ml-1">drivers found</span>
          </div>
          {hasActiveFilters && (
            <Button
              onClick={onClearFilters}
              className="flex items-center gap-1 px-3 py-2 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
              title="Clear all filters"
            >
              Clear
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};