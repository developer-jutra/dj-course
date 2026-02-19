import React from 'react';
import { Document, DocumentEntity } from '../../model/documents';
import { Search, Filter, FileText, X } from 'lucide-react';

interface DocumentFiltersProps {
  searchTerm: string;
  filterEntityType: 'all' | Document['entityType'];
  filterEntityId: 'all' | string;
  filterDocumentType: 'all' | Document['type'];
  availableEntities: DocumentEntity[];
  onSearchChange: (value: string) => void;
  onEntityTypeChange: (value: 'all' | Document['entityType']) => void;
  onEntityIdChange: (value: 'all' | string) => void;
  onDocumentTypeChange: (value: 'all' | Document['type']) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  resultCount: number;
}

export const DocumentFilters: React.FC<DocumentFiltersProps> = ({
  searchTerm,
  filterEntityType,
  filterEntityId,
  filterDocumentType,
  availableEntities,
  onSearchChange,
  onEntityTypeChange,
  onEntityIdChange,
  onDocumentTypeChange,
  onClearFilters,
  hasActiveFilters,
  resultCount
}) => {
  const getEntityTypeLabel = (type: Document['entityType']) => {
    const labels = {
      'vehicle': 'Vehicle',
      'customer': 'Customer',
      'supplier': 'Supplier',
      'driver': 'Driver',
      'company': 'Company',
      'other': 'Other'
    };
    return labels[type];
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="relative">
          <Filter className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <select
            value={filterEntityType}
            onChange={(e) => {
              onEntityTypeChange(e.target.value as any);
              onEntityIdChange('all'); // Reset entity filter when type changes
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
          >
            <option value="all">All Entity Types</option>
            <option value="vehicle">Vehicles</option>
            <option value="customer">Customers</option>
            <option value="supplier">Suppliers</option>
            <option value="driver">Drivers</option>
            <option value="company">Company</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div>
          <select
            value={filterEntityId}
            onChange={(e) => onEntityIdChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            disabled={filterEntityType === 'all'}
          >
            <option value="all">All {filterEntityType === 'all' ? 'Entities' : getEntityTypeLabel(filterEntityType) + 's'}</option>
            {availableEntities.map(entity => (
              <option key={entity.id} value={entity.id}>
                {entity.name}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <select
            value={filterDocumentType}
            onChange={(e) => onDocumentTypeChange(e.target.value as any)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
          >
            <option value="all">All Document Types</option>
            <option value="contract">Contracts</option>
            <option value="invoice">Invoices</option>
            <option value="registration">Registration</option>
            <option value="insurance">Insurance</option>
            <option value="inspection">Technical Inspection</option>
            <option value="tir-carnet">TIR Carnet</option>
            <option value="adr">ADR Certificate</option>
            <option value="hazmat-permit">Hazmat Permit</option>
            <option value="license">License</option>
            <option value="certificate">Certificate</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-600 flex items-center">
            <span className="font-medium">{resultCount}</span>
            <span className="ml-1">documents found</span>
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
    </div>
  );
};