import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type TruckStatus = "w trasie" | "dostępna" | "serwis";

interface Truck {
  id: string;
  brand: string;
  model: string;
  registrationNumber: string;
  status: TruckStatus;
  lastService: string;
  mileage: number;
  driver: string;
}

const Fleet = () => {
  // FR.FLEET.01 - Static list of 20 trucks
  const [trucks] = useState<Truck[]>([
    { id: "T001", brand: "Volvo", model: "FH16", registrationNumber: "WW 12345", status: "w trasie", lastService: "2025-10-15", mileage: 245000, driver: "Jan Kowalski" },
    { id: "T002", brand: "Scania", model: "R450", registrationNumber: "KR 23456", status: "dostępna", lastService: "2025-11-01", mileage: 180000, driver: "" },
    { id: "T003", brand: "MAN", model: "TGX", registrationNumber: "GD 34567", status: "serwis", lastService: "2025-09-20", mileage: 320000, driver: "" },
    { id: "T004", brand: "Mercedes", model: "Actros", registrationNumber: "PO 45678", status: "w trasie", lastService: "2025-10-28", mileage: 210000, driver: "Anna Nowak" },
    { id: "T005", brand: "Volvo", model: "FH13", registrationNumber: "WA 56789", status: "dostępna", lastService: "2025-11-05", mileage: 165000, driver: "" },
    { id: "T006", brand: "DAF", model: "XF", registrationNumber: "WR 67890", status: "w trasie", lastService: "2025-10-10", mileage: 290000, driver: "Piotr Wiśniewski" },
    { id: "T007", brand: "Scania", model: "S500", registrationNumber: "KA 78901", status: "serwis", lastService: "2025-08-15", mileage: 410000, driver: "" },
    { id: "T008", brand: "Iveco", model: "Stralis", registrationNumber: "LU 89012", status: "dostępna", lastService: "2025-11-02", mileage: 145000, driver: "" },
    { id: "T009", brand: "Volvo", model: "FH16", registrationNumber: "LD 90123", status: "w trasie", lastService: "2025-10-25", mileage: 235000, driver: "Marek Zieliński" },
    { id: "T010", brand: "MAN", model: "TGS", registrationNumber: "RZ 01234", status: "dostępna", lastService: "2025-11-08", mileage: 125000, driver: "" },
    { id: "T011", brand: "Mercedes", model: "Arocs", registrationNumber: "SZ 12345", status: "w trasie", lastService: "2025-10-18", mileage: 198000, driver: "Tomasz Lewandowski" },
    { id: "T012", brand: "Scania", model: "R580", registrationNumber: "OP 23456", status: "serwis", lastService: "2025-09-05", mileage: 385000, driver: "" },
    { id: "T013", brand: "DAF", model: "CF", registrationNumber: "BY 34567", status: "dostępna", lastService: "2025-11-10", mileage: 112000, driver: "" },
    { id: "T014", brand: "Volvo", model: "FM", registrationNumber: "KI 45678", status: "w trasie", lastService: "2025-10-22", mileage: 267000, driver: "Katarzyna Mazur" },
    { id: "T015", brand: "MAN", model: "TGX", registrationNumber: "GW 56789", status: "dostępna", lastService: "2025-11-03", mileage: 156000, driver: "" },
    { id: "T016", brand: "Iveco", model: "S-Way", registrationNumber: "SL 67890", status: "w trasie", lastService: "2025-10-12", mileage: 223000, driver: "Michał Krawczyk" },
    { id: "T017", brand: "Scania", model: "G410", registrationNumber: "EL 78901", status: "serwis", lastService: "2025-08-28", mileage: 445000, driver: "" },
    { id: "T018", brand: "Mercedes", model: "Actros", registrationNumber: "OL 89012", status: "dostępna", lastService: "2025-11-07", mileage: 134000, driver: "" },
    { id: "T019", brand: "Volvo", model: "FH", registrationNumber: "WM 90123", status: "w trasie", lastService: "2025-10-30", mileage: 189000, driver: "Agnieszka Piotrowska" },
    { id: "T020", brand: "DAF", model: "XF", registrationNumber: "ZG 01234", status: "dostępna", lastService: "2025-11-11", mileage: 98000, driver: "" },
  ]);

  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedTruck, setSelectedTruck] = useState<Truck | null>(null);

  // FR.FLEET.02 - Filter by status
  const filteredTrucks = trucks.filter(truck => 
    filterStatus === "all" ? true : truck.status === filterStatus
  );

  const getStatusBadge = (status: TruckStatus) => {
    const variants = {
      "w trasie": "default",
      "dostępna": "outline",
      "serwis": "secondary",
    };
    return <Badge variant={variants[status] as any}>{status}</Badge>;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Zarządzanie Flotą</h1>
            <p className="text-muted-foreground mt-1">Przegląd wszystkich ciężarówek</p>
          </div>
          
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtruj według statusu" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Wszystkie</SelectItem>
              <SelectItem value="w trasie">W trasie</SelectItem>
              <SelectItem value="dostępna">Dostępne</SelectItem>
              <SelectItem value="serwis">W serwisie</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredTrucks.map((truck) => (
            <Card 
              key={truck.id} 
              className="p-4 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedTruck(truck)}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-lg">{truck.brand} {truck.model}</h3>
                  <p className="text-sm text-muted-foreground">{truck.registrationNumber}</p>
                </div>
                {getStatusBadge(truck.status)}
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Przebieg:</span>
                  <p className="font-medium">{truck.mileage.toLocaleString()} km</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Ostatni serwis:</span>
                  <p className="font-medium">{truck.lastService}</p>
                </div>
              </div>
              
              {truck.driver && (
                <div className="mt-2 pt-2 border-t">
                  <span className="text-muted-foreground text-sm">Kierowca: </span>
                  <span className="font-medium text-sm">{truck.driver}</span>
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* FR.FLEET.03 - Detail View */}
        {selectedTruck && (
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Szczegóły ciężarówki</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">ID</p>
                <p className="font-semibold">{selectedTruck.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Marka i Model</p>
                <p className="font-semibold">{selectedTruck.brand} {selectedTruck.model}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Numer rejestracyjny</p>
                <p className="font-semibold">{selectedTruck.registrationNumber}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                {getStatusBadge(selectedTruck.status)}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Przebieg</p>
                <p className="font-semibold">{selectedTruck.mileage.toLocaleString()} km</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ostatni serwis</p>
                <p className="font-semibold">{selectedTruck.lastService}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground">Przypisany kierowca</p>
                <p className="font-semibold">{selectedTruck.driver || "Brak"}</p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Fleet;
