import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter, Truck as TruckIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const Fleet = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [vehicles] = useState([
    {
      id: 1,
      regNumber: "TK-12345",
      type: "Ciężarówka",
      model: "Mercedes Actros",
      status: "Dostępny",
      driver: "Jan Kowalski",
      nextService: "2025-12-15",
    },
    {
      id: 2,
      regNumber: "TK-67890",
      type: "Ciężarówka",
      model: "Volvo FH16",
      status: "W trasie",
      driver: "Anna Nowak",
      nextService: "2025-11-28",
    },
    {
      id: 3,
      regNumber: "TK-11223",
      type: "Dostawczy",
      model: "Ford Transit",
      status: "Dostępny",
      driver: "Piotr Wiśniewski",
      nextService: "2026-01-10",
    },
    {
      id: 4,
      regNumber: "TK-44556",
      type: "Ciężarówka",
      model: "Scania R500",
      status: "Serwis",
      driver: "-",
      nextService: "2025-11-20",
    },
  ]);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", className: string }> = {
      "Dostępny": { variant: "default", className: "bg-success text-success-foreground" },
      "W trasie": { variant: "default", className: "bg-info text-info-foreground" },
      "Serwis": { variant: "default", className: "bg-warning text-warning-foreground" },
      "Wycofany": { variant: "destructive", className: "" },
    };
    return variants[status] || variants["Dostępny"];
  };

  const handleAddVehicle = () => {
    toast.success("Pojazd został dodany pomyślnie");
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Zarządzanie Flotą</h2>
          <p className="text-muted-foreground">Zarządzaj pojazdami i ich statusem</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Dodaj Pojazd
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Dodaj Nowy Pojazd</DialogTitle>
              <DialogDescription>
                Wprowadź dane nowego pojazdu do systemu
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="regNumber">Numer Rejestracyjny *</Label>
                <Input id="regNumber" placeholder="TK-12345" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="vin">VIN *</Label>
                <Input id="vin" placeholder="WDB9634051L123456" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="model">Model</Label>
                <Input id="model" placeholder="Mercedes Actros" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Typ Pojazdu</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Wybierz typ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="truck">Ciężarówka</SelectItem>
                    <SelectItem value="trailer">Naczepa</SelectItem>
                    <SelectItem value="van">Dostawczy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select defaultValue="available">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Dostępny</SelectItem>
                    <SelectItem value="in-route">W trasie</SelectItem>
                    <SelectItem value="service">Serwis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Anuluj
              </Button>
              <Button onClick={handleAddVehicle}>Zapisz</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Wszystkie Pojazdy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">50</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Dostępne
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">42</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              W Trasie
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-info">5</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              W Serwisie
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">3</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Lista Pojazdów</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Szukaj pojazdu..." className="pl-8 w-64" />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nr Rejestracyjny</TableHead>
                <TableHead>Typ</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Przypisany Kierowca</TableHead>
                <TableHead>Następny Przegląd</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehicles.map((vehicle) => (
                <TableRow key={vehicle.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-medium">{vehicle.regNumber}</TableCell>
                  <TableCell>{vehicle.type}</TableCell>
                  <TableCell>{vehicle.model}</TableCell>
                  <TableCell>
                    <Badge {...getStatusBadge(vehicle.status)}>
                      {vehicle.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{vehicle.driver}</TableCell>
                  <TableCell>{vehicle.nextService}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Fleet;
