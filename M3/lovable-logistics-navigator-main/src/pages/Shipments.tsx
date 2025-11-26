import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

const Shipments = () => {
  const [shipments] = useState([
    {
      id: "ZT-2024-089",
      status: "Oczekujące",
      loadDate: "2025-11-18",
      destination: "Gdańsk",
      weight: "18.5t",
      proposedPrice: "4,500 PLN",
    },
    {
      id: "ZT-2024-088",
      status: "Oczekujące",
      loadDate: "2025-11-17",
      destination: "Wrocław",
      weight: "12.0t",
      proposedPrice: "3,200 PLN",
    },
    {
      id: "ZT-2024-087",
      status: "Zaakceptowane",
      loadDate: "2025-11-16",
      destination: "Kraków",
      weight: "15.0t",
      proposedPrice: "3,800 PLN",
    },
    {
      id: "ZT-2024-086",
      status: "Zaakceptowane",
      loadDate: "2025-11-16",
      destination: "Poznań",
      weight: "20.0t",
      proposedPrice: "4,200 PLN",
    },
  ]);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { className: string, icon?: React.ReactNode }> = {
      "Oczekujące": { className: "bg-warning text-warning-foreground", icon: <Clock className="h-3 w-3 mr-1" /> },
      "Zaakceptowane": { className: "bg-success text-success-foreground", icon: <CheckCircle className="h-3 w-3 mr-1" /> },
      "Odrzucone": { className: "bg-destructive text-destructive-foreground", icon: <XCircle className="h-3 w-3 mr-1" /> },
    };
    return variants[status] || variants["Oczekujące"];
  };

  const handleAccept = (id: string) => {
    toast.success(`Zgłoszenie ${id} zostało zaakceptowane`);
  };

  const handleReject = (id: string) => {
    toast.error(`Zgłoszenie ${id} zostało odrzucone`);
  };

  const pendingShipments = shipments.filter(s => s.status === "Oczekujące");
  const acceptedShipments = shipments.filter(s => s.status === "Zaakceptowane");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Zgłoszenia Transportowe</h2>
        <p className="text-muted-foreground">Zarządzaj zleceniami transportowymi</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Oczekujące
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{pendingShipments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Zaakceptowane
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{acceptedShipments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Zakończone (miesiąc)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">124</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="pending">
            Oczekujące ({pendingShipments.length})
          </TabsTrigger>
          <TabsTrigger value="accepted">
            Zaakceptowane ({acceptedShipments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Oczekujące Zgłoszenia</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID Zgłoszenia</TableHead>
                    <TableHead>Data Załadunku</TableHead>
                    <TableHead>Lokalizacja Docelowa</TableHead>
                    <TableHead>Waga</TableHead>
                    <TableHead>Proponowana Cena</TableHead>
                    <TableHead className="text-right">Akcje</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingShipments.map((shipment) => (
                    <TableRow key={shipment.id}>
                      <TableCell className="font-medium">{shipment.id}</TableCell>
                      <TableCell>{shipment.loadDate}</TableCell>
                      <TableCell>{shipment.destination}</TableCell>
                      <TableCell>{shipment.weight}</TableCell>
                      <TableCell>{shipment.proposedPrice}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleAccept(shipment.id)}
                          >
                            Akceptuj
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(shipment.id)}
                          >
                            Odrzuć
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accepted">
          <Card>
            <CardHeader>
              <CardTitle>Zaakceptowane Zgłoszenia</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID Zgłoszenia</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data Załadunku</TableHead>
                    <TableHead>Lokalizacja Docelowa</TableHead>
                    <TableHead>Waga</TableHead>
                    <TableHead>Cena</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {acceptedShipments.map((shipment) => (
                    <TableRow key={shipment.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="font-medium">{shipment.id}</TableCell>
                      <TableCell>
                        <Badge {...getStatusBadge(shipment.status)} className="flex items-center w-fit">
                          {getStatusBadge(shipment.status).icon}
                          {shipment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{shipment.loadDate}</TableCell>
                      <TableCell>{shipment.destination}</TableCell>
                      <TableCell>{shipment.weight}</TableCell>
                      <TableCell>{shipment.proposedPrice}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Shipments;
