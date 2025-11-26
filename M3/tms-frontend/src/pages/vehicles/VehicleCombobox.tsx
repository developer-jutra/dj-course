import React, { useState } from 'react';
import { ChevronsUpDown, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../../components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../components/ui/popover';
import { vehicles as allVehicles } from '../../model/vehicles/vehicles.mocks';
import { Vehicle } from '../../model/vehicles/vehicle.types';

interface VehicleComboboxProps {
  currentVehicleId?: string;
}

export const VehicleCombobox: React.FC<VehicleComboboxProps> = ({ currentVehicleId }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleSelectVehicle = (vehicle?: Vehicle) => {
    setOpen(false);
    if (vehicle) {
      navigate(`/maintenance/${vehicle.id}`);
    } else {
      navigate('/maintenance');
    }
  };

  const currentVehicle = allVehicles.find(v => v.id === currentVehicleId);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[350px] justify-between"
        >
          {currentVehicle ? `${currentVehicle.plateNumber} (${currentVehicle.make} ${currentVehicle.model})` : "Select a vehicle..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search by plate number..." />
          <CommandList>
            <CommandEmpty>No vehicle found.</CommandEmpty>
            <CommandGroup>
              <CommandItem onSelect={() => handleSelectVehicle()}>
                <Check
                  className={`mr-2 h-4 w-4 ${!currentVehicleId ? 'opacity-100' : 'opacity-0'}`}
                />
                All Vehicles
              </CommandItem>
              {allVehicles.map((vehicle) => (
                <CommandItem
                  key={vehicle.id}
                  value={vehicle.plateNumber}
                  onSelect={() => handleSelectVehicle(vehicle)}
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${
                      currentVehicleId === vehicle.id ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                  {vehicle.plateNumber} - {vehicle.make} {vehicle.model}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}; 