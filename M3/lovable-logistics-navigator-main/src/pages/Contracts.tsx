import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Contracts = () => {
  const [contracts] = useState([
    {
      id: "NEG-2024-012",
      status: "W Trakcie",
      client: "Transport ABC Sp. z o.o.",
      startDate: "2025-11-10",
      expectedValue: "150,000 PLN",
    },
    {
      id: "NEG-2024-011",
      status: "Oczekuje Akceptacji",
      client: "Logistyka XYZ S.A.",
      startDate: "2025-11-08",
      expectedValue: "250,000 PLN",
    },
    {
      id: "NEG-2024-010",
      status: "Zakończona",
      client: "Handel DEF",
      startDate: "2025-11-05",
      expectedValue: "180,000 PLN",
    },
    {
      id: "NEG-2024-009",
      status: "Propozycja",
      client: "Firma GHI Logistics",
      startDate: "2025-11-12",
      expectedValue: "320,000 PLN",
    },
  ]);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { className: string }> = {
      "Propozycja": { className: "bg-secondary text-secondary-foreground" },
      "W Trakcie": { className: "bg-info text-info-foreground" },
      "Oczekuje Akceptacji": { className: "bg-warning text-warning-foreground" },
      "Zakończona": { className: "bg-success text-success-foreground" },
    };
    return variants[status] || variants["Propozycja"];
  };

  const activeContracts = contracts.filter(c => c.status !== "Zakończona");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Negocjacje Umów</h2>
          <p className="text-muted-foreground">Zarządzaj procesem negocjacji kontraktów</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nowa Negocjacja
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Aktywne
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-info">{activeContracts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Oczekujące
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {contracts.filter(c => c.status === "Oczekuje Akceptacji").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Zakończone (miesiąc)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">8</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Łączna Wartość
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">900K PLN</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista Negocjacji</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Negocjacji</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Klient</TableHead>
                <TableHead>Data Rozpoczęcia</TableHead>
                <TableHead>Wartość Oczekiwana</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contracts.map((contract) => (
                <TableRow key={contract.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-medium">{contract.id}</TableCell>
                  <TableCell>
                    <Badge {...getStatusBadge(contract.status)}>
                      {contract.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{contract.client}</TableCell>
                  <TableCell>{contract.startDate}</TableCell>
                  <TableCell className="font-semibold">{contract.expectedValue}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Contracts;
