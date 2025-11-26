import React from 'react';
import { Vehicle } from '../../model/vehicles';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { Button } from '../../components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { useDriversList } from '@/hooks/queries';

interface VehiclesTableProps {
  vehicles: Vehicle[];
}

const statusVariantMap: Record<Vehicle['status'], 'default' | 'secondary' | 'destructive' | 'outline'> = {
  available: 'default',
  'in-transit': 'secondary',
  maintenance: 'destructive',
  'out-of-service': 'outline',
};

export const VehiclesTable: React.FC<VehiclesTableProps> = ({ vehicles }) => {
  const { data: drivers = [] } = useDriversList();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Vehicle Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium text-gray-500">Plate Number</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Make & Model</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Driver</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Location</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((vehicle) => {
                const driver = drivers.find(d => d.name === vehicle.currentDriver);
                return (
                <tr key={vehicle.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{vehicle.plateNumber}</td>
                  <td className="py-3 px-4">{vehicle.make} {vehicle.model}</td>
                  <td className="py-3 px-4">{vehicle.currentDriver || 'N/A'}</td>
                  <td className="py-3 px-4">
                    <Badge variant={statusVariantMap[vehicle.status] || 'default'}>
                      {vehicle.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">{vehicle.currentLocation?.address || 'N/A'}</td>
                  <td className="py-3 px-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Link to={`/drivers/${driver?.id}/details`} className="w-full">
                            View Driver
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Link to={`/maintenance/${vehicle.id}`} className="w-full">
                            Maintenance
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}; 