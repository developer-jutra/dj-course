import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Driver } from '../../model/drivers';
import { DriverFilters } from './DriverFilters';
import { DriverTile } from './DriverTile';
import { Truck } from 'lucide-react';

interface DriversListProps {
  drivers: Driver[];
}

export const DriversList: React.FC<DriversListProps> = ({ drivers }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Driver['status']>('all');
  const [contractTypeFilter, setContractTypeFilter] = useState<'all' | Driver['contractType']>('all');

  const handleDriverSelect = (driver: Driver) => {
    navigate(`/drivers/${driver.id}/details`);
  };

  const handleDriverRoutes = (driver: Driver) => {
    navigate(`/routes?context=driver-routes&entityId=${driver.id}`);
  };

  const handleDriverCalendar = (driver: Driver) => {
    navigate(`/drivers/${driver.id}/calendar`);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setContractTypeFilter('all');
  };

  // Filter drivers based on search and filters
  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = 
      driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.phone.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || driver.status === statusFilter;
    const matchesContractType = contractTypeFilter === 'all' || driver.contractType === contractTypeFilter;
    
    return matchesSearch && matchesStatus && matchesContractType;
  });

  const hasActiveFilters = searchTerm !== '' || statusFilter !== 'all' || contractTypeFilter !== 'all';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Driver Management</h2>
        <p className="text-gray-600">Manage driver information, routes, and schedules</p>
      </div>

      {/* Search and Filters */}
      <DriverFilters
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        contractTypeFilter={contractTypeFilter}
        onSearchChange={setSearchTerm}
        onStatusChange={setStatusFilter}
        onContractTypeChange={setContractTypeFilter}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
        resultCount={filteredDrivers.length}
      />

      {/* Drivers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredDrivers.map((driver) => (
          <DriverTile
            key={driver.id}
            driver={driver}
            onDriverSelect={handleDriverSelect}
            onDriverRoutes={handleDriverRoutes}
            onDriverCalendar={handleDriverCalendar}
          />
        ))}
      </div>

      {filteredDrivers.length === 0 && (
        <div className="text-center py-12">
          <Truck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No drivers found</h3>
          <p className="text-gray-500">Try adjusting your search criteria or filters.</p>
        </div>
      )}
    </div>
  );
};