import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

export type ShipmentStatus = "Oczekujące" | "Zatwierdzone" | "Realizowane" | "Odrzucone";

export interface ShipmentRequest {
  id: string;
  clientName: string;
  routeStart: string;
  routeEnd: string;
  loadDate: string;
  truckType: string;
  status: ShipmentStatus;
  weight?: number;
  volume?: number;
  adr?: boolean;
  specialRequirements?: string;
  contact?: string;
}

const ShipmentRequests = () => {
  const navigate = useNavigate();
  
  // FR.TRANS.01 - Static list of 10 shipment requests
  const [requests, setRequests] = useState<ShipmentRequest[]>([
    { id: "ZG001", clientName: "ABC Logistics", routeStart: "Warszawa", routeEnd: "Berlin", loadDate: "2025-11-20", truckType: "Plandeka", status: "Oczekujące", weight: 15000, volume: 80, adr: false, contact: "+48 123 456 789" },
    { id: "ZG002", clientName: "TransEuro Sp. z o.o.", routeStart: "Kraków", routeEnd: "Praga", loadDate: "2025-11-22", truckType: "Chłodnia", status: "Zatwierdzone", weight: 18000, volume: 75, adr: false, contact: "+48 234 567 890" },
    { id: "ZG003", clientName: "SpeedCargo", routeStart: "Gdańsk", routeEnd: "Hamburg", loadDate: "2025-11-18", truckType: "Plandeka", status: "Realizowane", weight: 12000, volume: 65, adr: false, contact: "+48 345 678 901" },
    { id: "ZG004", clientName: "ChemTrans", routeStart: "Wrocław", routeEnd: "Amsterdam", loadDate: "2025-11-25", truckType: "Cysterna ADR", status: "Oczekujące", weight: 20000, volume: 90, adr: true, contact: "+48 456 789 012", specialRequirements: "Wymaga certyfikatu ADR klasa 3" },
    { id: "ZG005", clientName: "FreshFood Delivery", routeStart: "Poznań", routeEnd: "Kopenhaga", loadDate: "2025-11-19", truckType: "Chłodnia", status: "Odrzucone", weight: 14000, volume: 70, adr: false, contact: "+48 567 890 123", specialRequirements: "Temperatura -18°C" },
    { id: "ZG006", clientName: "BuildMaster", routeStart: "Łódź", routeEnd: "Wiedeń", loadDate: "2025-11-23", truckType: "Wywrotka", status: "Zatwierdzone", weight: 22000, volume: 85, adr: false, contact: "+48 678 901 234" },
    { id: "ZG007", clientName: "TechExport", routeStart: "Szczecin", routeEnd: "Sztokholm", loadDate: "2025-11-21", truckType: "Plandeka", status: "Oczekujące", weight: 11000, volume: 60, adr: false, contact: "+48 789 012 345" },
    { id: "ZG008", clientName: "PetroTrans", routeStart: "Katowice", routeEnd: "Bratysława", loadDate: "2025-11-24", truckType: "Cysterna", status: "Realizowane", weight: 25000, volume: 95, adr: false, contact: "+48 890 123 456" },
    { id: "ZG009", clientName: "MegaStore Supply", routeStart: "Lublin", routeEnd: "Budapeszt", loadDate: "2025-11-26", truckType: "Plandeka", status: "Oczekujące", weight: 16000, volume: 78, adr: false, contact: "+48 901 234 567" },
    { id: "ZG010", clientName: "IceCold Transport", routeStart: "Bydgoszcz", routeEnd: "Oslo", loadDate: "2025-11-27", truckType: "Chłodnia", status: "Oczekujące", weight: 13000, volume: 68, adr: false, contact: "+48 012 345 678", specialRequirements: "Temperatura +2°C do +6°C" },
  ]);

  // FR.TRANS.02 - Filter states
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [clientSearch, setClientSearch] = useState("");
  const [idSearch, setIdSearch] = useState("");
  const [sortBy, setSortBy] = useState<"id" | "date">("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Apply filters and sorting
  const filteredRequests = requests
    .filter(req => statusFilter === "all" ? true : req.status === statusFilter)
    .filter(req => req.clientName.toLowerCase().includes(clientSearch.toLowerCase()))
    .filter(req => req.id.toLowerCase().includes(idSearch.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "id") {
        return sortOrder === "asc" ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id);
      } else {
        return sortOrder === "asc" 
          ? new Date(a.loadDate).getTime() - new Date(b.loadDate).getTime()
          : new Date(b.loadDate).getTime() - new Date(a.loadDate).getTime();
      }
    });

  const getStatusBadge = (status: ShipmentStatus) => {
    const variants: Record<ShipmentStatus, { variant: any, className: string }> = {
      "Oczekujące": { variant: "default", className: "bg-warning text-warning-foreground" },
      "Zatwierdzone": { variant: "default", className: "bg-success text-success-foreground" },
      "Realizowane": { variant: "default", className: "bg-primary text-primary-foreground" },
      "Odrzucone": { variant: "default", className: "bg-destructive text-destructive-foreground" },
    };
    const config = variants[status];
    return <Badge variant={config.variant} className={config.className}>{status}</Badge>;
  };

  const toggleSort = (column: "id" | "date") => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Zgłoszenia Transportowe</h1>
          <p className="text-muted-foreground mt-1">Zarządzanie zapytaniami o transport</p>
        </div>

        {/* FR.TRANS.02 - Filters Panel */}
        <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Wszystkie</SelectItem>
                  <SelectItem value="Oczekujące">Oczekujące</SelectItem>
                  <SelectItem value="Zatwierdzone">Zatwierdzone</SelectItem>
                  <SelectItem value="Realizowane">Realizowane</SelectItem>
                  <SelectItem value="Odrzucone">Odrzucone</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Nazwa Kontrahenta</label>
              <Input 
                placeholder="Szukaj..." 
                value={clientSearch}
                onChange={(e) => setClientSearch(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Numer Zgłoszenia</label>
              <Input 
                placeholder="np. ZG001" 
                value={idSearch}
                onChange={(e) => setIdSearch(e.target.value)}
              />
            </div>

            <div className="flex items-end">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  setStatusFilter("all");
                  setClientSearch("");
                  setIdSearch("");
                }}
              >
                Wyczyść filtry
              </Button>
            </div>
          </div>
        </Card>

        {/* FR.TRANS.01 - Table with sortable columns */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    onClick={() => toggleSort("id")}
                    className="font-semibold"
                  >
                    ID <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Kontrahent</TableHead>
                <TableHead>Trasa</TableHead>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    onClick={() => toggleSort("date")}
                    className="font-semibold"
                  >
                    Data Załadunku <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Typ Ciężarówki</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Akcje</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((request) => (
                <TableRow key={request.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-medium">{request.id}</TableCell>
                  <TableCell>{request.clientName}</TableCell>
                  <TableCell>{request.routeStart} → {request.routeEnd}</TableCell>
                  <TableCell>{request.loadDate}</TableCell>
                  <TableCell>{request.truckType}</TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/shipment-requests/${request.id}`)}
                    >
                      Szczegóły
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ShipmentRequests;
