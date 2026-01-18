
import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { useVehiclesList } from '../hooks/queries';
import { LoadingPage, ErrorMessage } from '../components';
import { Vehicle } from '../model/vehicles';
import { LayoutGrid, List } from 'lucide-react';
import { VehicleFilters } from './vehicles/VehicleFilters';
import { VehiclesList } from './vehicles/VehiclesList';
import { VehiclesTable } from './vehicles/VehiclesTable';
import LiveFleetMap from './vehicles/LiveFleetMap';


const VehiclesPage = () => {
  const { data: vehicles = [], isLoading, error, refetch } = useVehiclesList();
  const [view, setView] = useState<'grid' | 'table'>('grid');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Vehicle['status']>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | Vehicle['type']>('all');
  const [ownershipFilter, setOwnershipFilter] = useState<'all' | Vehicle['ownership']['type']>('all');
  
  const handleRetry = () => {
    refetch();
  };
  
  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = 
    vehicle.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.currentDriver?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter;
    const matchesType = typeFilter === 'all' || vehicle.type === typeFilter;
    const matchesOwnership = ownershipFilter === 'all' || vehicle.ownership.type === ownershipFilter;
    
    return matchesSearch && matchesStatus && matchesType && matchesOwnership;
  });
  
  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setTypeFilter('all');
    setOwnershipFilter('all');
  };
  
  const hasActiveFilters = searchTerm !== '' || statusFilter !== 'all' || typeFilter !== 'all' || ownershipFilter !== 'all';
  
  
  if (isLoading) {
    return <LoadingPage />;
  }
  
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <ErrorMessage 
      error={error instanceof Error ? error.message : 'Failed to load vehicles'} 
      onRetry={handleRetry} 
      />
      </div>
      );
    }
    
    return (
      <div className="space-y-6">
      <div>
      <h1 className="text-2xl font-bold text-gray-900">Fleet Management</h1>
      <p className="text-gray-600">Manage vehicles, maintenance, and documentation</p>
      </div>
      
      <LiveFleetMap vehicles={vehicles} />
      
      <div className="space-y-4">
      <VehicleFilters
      searchTerm={searchTerm}
      statusFilter={statusFilter}
      typeFilter={typeFilter}
      ownershipFilter={ownershipFilter}
      view={view}
      onSearchChange={setSearchTerm}
      onStatusChange={setStatusFilter}
      onTypeChange={setTypeFilter}
      onOwnershipChange={setOwnershipFilter}
      onViewChange={setView}
      onClearFilters={handleClearFilters}
      hasActiveFilters={hasActiveFilters}
      resultCount={filteredVehicles.length}
      />
      
      {view === 'grid' ? (
        <VehiclesList vehicles={filteredVehicles} />
        ) : (
          <VehiclesTable vehicles={filteredVehicles} />
          )}
          </div>
          </div>
          );
        };
        
        export default VehiclesPage;
