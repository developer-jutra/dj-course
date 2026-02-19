import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { shipmentFiltersAtom } from '../shipments.store';
import { selectedDriverAtom } from '@/pages/drivers/drivers.store';
import { useShipmentsQuery } from '@/http/shipments.queries';
import { useDriversQuery } from '@/http/drivers.queries';
import { useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { List, LayoutGrid, Map, MapPin } from "lucide-react";

type ViewMode = "tiles" | "list";

const InTransitTab = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = React.useState<ViewMode>("tiles");
  const [filters, setFilters] = useAtom(shipmentFiltersAtom);
  const [selectedDriver, setSelectedDriver] = useAtom(selectedDriverAtom);
  const { data } = useDriversQuery();
  
  // Apply selected driver filter when coming from driver details
  useEffect(() => {
    if (selectedDriver) {
      setFilters(prev => ({ ...prev, driver: selectedDriver }));
      setSelectedDriver(''); // Clear after applying
    }
  }, [selectedDriver, setFilters, setSelectedDriver]);

  const { data: shipments = [], isLoading } = useShipmentsQuery(filters);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'in transit': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'loading': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleTrackShipment = (shipmentId: string) => {
    navigate(`/routes/${shipmentId}`);
  };

  const clearFilters = () => {
    setFilters({ driver: '', status: '', location: '' });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        Loading shipments...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium">Driver</label>
              <Select 
                value={filters.driver || undefined} 
                onValueChange={(value) => setFilters(prev => ({ ...prev, driver: value || '' }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All drivers" />
                </SelectTrigger>
                <SelectContent>
                  {drivers.map(driver => (
                    <SelectItem key={driver.id} value={driver.name}>{driver.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Status</label>
              <Select 
                value={filters.status || undefined} 
                onValueChange={(value) => setFilters(prev => ({ ...prev, status: value || '' }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="In Transit">In Transit</SelectItem>
                  <SelectItem value="Delivered">Delivered</SelectItem>
                  <SelectItem value="Loading">Loading</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Location</label>
              <Input
                placeholder="Search location..."
                value={filters.location}
                onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>
            
            <div className="flex items-end">
              <Button variant="outline" onClick={clearFilters} className="w-full">
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-end">
        <ToggleGroup
          type="single"
          defaultValue="tiles"
          value={viewMode}
          onValueChange={(value: ViewMode) => value && setViewMode(value)}
        >
          <ToggleGroupItem value="tiles" aria-label="Tiles view">
            <LayoutGrid className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="list" aria-label="List view">
            <List className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      {viewMode === "tiles" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shipments.map((shipment) => (
            <Card key={shipment.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">
                    Shipment {shipment.id}
                  </CardTitle>
                  <Badge className={getStatusColor(shipment.status)}>
                    {shipment.status}
                  </Badge>
                </div>
                <CardDescription>Driver: {shipment.driver}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">From</p>
                  <p className="font-medium">{shipment.origin}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">To</p>
                  <p className="font-medium">{shipment.destination}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">ETA</p>
                  <p className="font-medium">{shipment.eta}</p>
                </div>
                {shipment.status.toLowerCase() === "in transit" && (
                  <>
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div>
                        <p className="text-sm text-gray-600">Elapsed Time</p>
                        <p className="font-medium">
                          {shipment.elapsedTime || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">
                          Distance Covered
                        </p>
                        <p className="font-medium">
                          {shipment.distanceCovered || "N/A"} /{" "}
                          {shipment.totalDistance || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Progress</p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${
                              shipment.distanceCovered && shipment.totalDistance
                                ? (parseInt(shipment.distanceCovered) /
                                    parseInt(shipment.totalDistance)) *
                                  100
                                : 0
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </>
                )}
                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() => handleTrackShipment(shipment.id)}
                >
                  <Map className="mr-2 h-4 w-4" />
                  Track Shipment
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Shipment ID</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Origin</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>ETA</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shipments.map((shipment) => (
                  <TableRow key={shipment.id}>
                    <TableCell className="font-medium">
                      {shipment.id}
                    </TableCell>
                    <TableCell>{shipment.driver}</TableCell>
                    <TableCell>{shipment.origin}</TableCell>
                    <TableCell>{shipment.destination}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(shipment.status)}>
                        {shipment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{shipment.eta}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleTrackShipment(shipment.id)}
                      >
                        <MapPin className="mr-2 h-4 w-4" />
                        Track
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {shipments.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500">No shipments match the current filters</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InTransitTab; 