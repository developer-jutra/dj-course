import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, AlertCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Incidents = () => {
  const [incidents] = useState([
    {
      id: "INC-045",
      date: "2025-11-15 14:30",
      status: "W Trakcie",
      type: "Awaria",
      vehicle: "TK-12345",
      priority: "Wysoki",
    },
    {
      id: "INC-044",
      date: "2025-11-15 09:15",
      status: "Nowy",
      type: "Opóźnienie",
      vehicle: "TK-67890",
      priority: "Średni",
    },
    {
      id: "INC-043",
      date: "2025-11-14 16:45",
      status: "Zakończony",
      type: "Wypadek",
      vehicle: "TK-11223",
      priority: "Wysoki",
    },
    {
      id: "INC-042",
      date: "2025-11-14 11:20",
      status: "Zakończony",
      type: "Opóźnienie",
      vehicle: "TK-44556",
      priority: "Niski",
    },
  ]);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { className: string }> = {
      "Nowy": { className: "bg-info text-info-foreground" },
      "W Trakcie": { className: "bg-warning text-warning-foreground" },
      "Zakończony": { className: "bg-success text-success-foreground" },
    };
    return variants[status] || variants["Nowy"];
  };

  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, { className: string }> = {
      "Wysoki": { className: "bg-destructive text-destructive-foreground" },
      "Średni": { className: "bg-warning text-warning-foreground" },
      "Niski": { className: "bg-secondary text-secondary-foreground" },
    };
    return variants[priority] || variants["Średni"];
  };

  const openIncidents = incidents.filter(i => i.status !== "Zakończony");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Incydenty</h2>
          <p className="text-muted-foreground">Monitoruj i zarządzaj incydentami operacyjnymi</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Zgłoś Incydent
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Wszystkie
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{incidents.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Otwarte
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{openIncidents.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Wysoki Priorytet
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {incidents.filter(i => i.priority === "Wysoki" && i.status !== "Zakończony").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Zakończone (dziś)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">2</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Lista Incydentów</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <AlertCircle className="h-4 w-4" />
              <span>Ostatnia aktualizacja: 5 min temu</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Incydentu</TableHead>
                <TableHead>Data Zgłoszenia</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Typ</TableHead>
                <TableHead>Pojazd</TableHead>
                <TableHead>Priorytet</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {incidents.map((incident) => (
                <TableRow key={incident.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-medium">{incident.id}</TableCell>
                  <TableCell>{incident.date}</TableCell>
                  <TableCell>
                    <Badge {...getStatusBadge(incident.status)}>
                      {incident.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{incident.type}</TableCell>
                  <TableCell>{incident.vehicle}</TableCell>
                  <TableCell>
                    <Badge {...getPriorityBadge(incident.priority)}>
                      {incident.priority}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Incidents;
