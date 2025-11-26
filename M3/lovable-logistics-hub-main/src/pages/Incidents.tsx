import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

type IncidentStatus = "otwarty" | "w trakcie" | "zamknięty";

interface Incident {
  id: string;
  type: string;
  location: string;
  status: IncidentStatus;
  description: string;
  reportedAt: string;
  truckId?: string;
}

const Incidents = () => {
  // FR.INC.01 - Static list of incidents
  const [incidents, setIncidents] = useState<Incident[]>([
    { id: "INC001", type: "Awaria", location: "A2 km 285", status: "otwarty", description: "Uszkodzenie opony", reportedAt: "2025-11-15 08:30", truckId: "T003" },
    { id: "INC002", type: "Opóźnienie", location: "Granica PL/DE", status: "w trakcie", description: "Kolejka na granicy - opóźnienie 2h", reportedAt: "2025-11-15 10:15", truckId: "T006" },
    { id: "INC003", type: "Awaria", location: "Warszawa - parking", status: "zamknięty", description: "Problem z chłodnią - naprawa wykonana", reportedAt: "2025-11-14 14:20", truckId: "T002" },
    { id: "INC004", type: "Wypadek", location: "S8 km 120", status: "otwarty", description: "Stłuczka - czekamy na policję", reportedAt: "2025-11-15 11:00", truckId: "T011" },
    { id: "INC005", type: "Opóźnienie", location: "Kraków", status: "w trakcie", description: "Opóźnienie w załadunku - klient", reportedAt: "2025-11-15 09:45", truckId: "T014" },
  ]);

  // FR.INC.02 - Change incident status (local only)
  const updateIncidentStatus = (id: string, newStatus: IncidentStatus) => {
    setIncidents(incidents.map(inc => 
      inc.id === id ? { ...inc, status: newStatus } : inc
    ));
    toast.success(`Status incydentu ${id} zmieniony na: ${newStatus}`);
  };

  const getStatusBadge = (status: IncidentStatus) => {
    const variants: Record<IncidentStatus, { className: string }> = {
      "otwarty": { className: "bg-destructive text-destructive-foreground" },
      "w trakcie": { className: "bg-warning text-warning-foreground" },
      "zamknięty": { className: "bg-success text-success-foreground" },
    };
    return <Badge className={variants[status].className}>{status}</Badge>;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      "Awaria": "text-destructive",
      "Opóźnienie": "text-warning",
      "Wypadek": "text-destructive",
    };
    return colors[type] || "text-foreground";
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Zarządzanie Incydentami</h1>
          <p className="text-muted-foreground mt-1">Przegląd i obsługa incydentów</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {incidents.map((incident) => (
            <Card key={incident.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{incident.id}</h3>
                  <p className={`text-sm font-medium ${getTypeColor(incident.type)}`}>
                    {incident.type}
                  </p>
                </div>
                {getStatusBadge(incident.status)}
              </div>

              <div className="space-y-2 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Lokalizacja</p>
                  <p className="font-medium">{incident.location}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Opis</p>
                  <p className="text-sm">{incident.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Zgłoszono</p>
                    <p className="text-sm font-medium">{incident.reportedAt}</p>
                  </div>
                  {incident.truckId && (
                    <div>
                      <p className="text-sm text-muted-foreground">Ciężarówka</p>
                      <p className="text-sm font-medium">{incident.truckId}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t">
                <label className="text-sm font-medium mb-2 block">Zmień status</label>
                <Select 
                  value={incident.status} 
                  onValueChange={(value) => updateIncidentStatus(incident.id, value as IncidentStatus)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="otwarty">Otwarty</SelectItem>
                    <SelectItem value="w trakcie">W trakcie</SelectItem>
                    <SelectItem value="zamknięty">Zamknięty</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Incidents;
