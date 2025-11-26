import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import type { ShipmentRequest, ShipmentStatus } from "./ShipmentRequests";

const ShipmentRequestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Mock data - in real app this would come from a data store
  const [request, setRequest] = useState<ShipmentRequest | null>(null);

  useEffect(() => {
    // Simulate fetching data
    const mockData: Record<string, ShipmentRequest> = {
      "ZG001": { id: "ZG001", clientName: "ABC Logistics", routeStart: "Warszawa", routeEnd: "Berlin", loadDate: "2025-11-20", truckType: "Plandeka", status: "Oczekujące", weight: 15000, volume: 80, adr: false, contact: "+48 123 456 789", specialRequirements: "Załadunek po godzinie 14:00" },
      "ZG002": { id: "ZG002", clientName: "TransEuro Sp. z o.o.", routeStart: "Kraków", routeEnd: "Praga", loadDate: "2025-11-22", truckType: "Chłodnia", status: "Zatwierdzone", weight: 18000, volume: 75, adr: false, contact: "+48 234 567 890", specialRequirements: "Temperatura -18°C" },
      "ZG003": { id: "ZG003", clientName: "SpeedCargo", routeStart: "Gdańsk", routeEnd: "Hamburg", loadDate: "2025-11-18", truckType: "Plandeka", status: "Realizowane", weight: 12000, volume: 65, adr: false, contact: "+48 345 678 901" },
      "ZG004": { id: "ZG004", clientName: "ChemTrans", routeStart: "Wrocław", routeEnd: "Amsterdam", loadDate: "2025-11-25", truckType: "Cysterna ADR", status: "Oczekujące", weight: 20000, volume: 90, adr: true, contact: "+48 456 789 012", specialRequirements: "Wymaga certyfikatu ADR klasa 3" },
      "ZG005": { id: "ZG005", clientName: "FreshFood Delivery", routeStart: "Poznań", routeEnd: "Kopenhaga", loadDate: "2025-11-19", truckType: "Chłodnia", status: "Odrzucone", weight: 14000, volume: 70, adr: false, contact: "+48 567 890 123", specialRequirements: "Temperatura -18°C" },
      "ZG006": { id: "ZG006", clientName: "BuildMaster", routeStart: "Łódź", routeEnd: "Wiedeń", loadDate: "2025-11-23", truckType: "Wywrotka", status: "Zatwierdzone", weight: 22000, volume: 85, adr: false, contact: "+48 678 901 234" },
      "ZG007": { id: "ZG007", clientName: "TechExport", routeStart: "Szczecin", routeEnd: "Sztokholm", loadDate: "2025-11-21", truckType: "Plandeka", status: "Oczekujące", weight: 11000, volume: 60, adr: false, contact: "+48 789 012 345" },
      "ZG008": { id: "ZG008", clientName: "PetroTrans", routeStart: "Katowice", routeEnd: "Bratysława", loadDate: "2025-11-24", truckType: "Cysterna", status: "Realizowane", weight: 25000, volume: 95, adr: false, contact: "+48 890 123 456" },
      "ZG009": { id: "ZG009", clientName: "MegaStore Supply", routeStart: "Lublin", routeEnd: "Budapeszt", loadDate: "2025-11-26", truckType: "Plandeka", status: "Oczekujące", weight: 16000, volume: 78, adr: false, contact: "+48 901 234 567" },
      "ZG010": { id: "ZG010", clientName: "IceCold Transport", routeStart: "Bydgoszcz", routeEnd: "Oslo", loadDate: "2025-11-27", truckType: "Chłodnia", status: "Oczekujące", weight: 13000, volume: 68, adr: false, contact: "+48 012 345 678", specialRequirements: "Temperatura +2°C do +6°C" },
    };
    
    if (id && mockData[id]) {
      setRequest(mockData[id]);
    }
  }, [id]);

  // FR.TRANS.06, FR.TRANS.07 - Local status change
  const handleAccept = () => {
    if (request) {
      setRequest({ ...request, status: "Zatwierdzone" });
      toast.success("Zgłoszenie zaakceptowane");
    }
  };

  const handleReject = () => {
    if (request) {
      setRequest({ ...request, status: "Odrzucone" });
      toast.error("Zgłoszenie odrzucone");
    }
  };

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

  if (!request) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Zgłoszenie nie znalezione</p>
          <Button onClick={() => navigate("/shipment-requests")} className="mt-4">
            Powrót do listy
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/shipment-requests")}>
            <ArrowLeft className="h-5 w-5 mr-2" />
            Powrót
          </Button>
        </div>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Zgłoszenie {request.id}</h1>
            <p className="text-muted-foreground mt-1">{request.clientName}</p>
          </div>
          {getStatusBadge(request.status)}
        </div>

        {/* FR.TRANS.04 - All details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Informacje podstawowe</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Numer zgłoszenia</p>
                <p className="font-semibold">{request.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Kontrahent</p>
                <p className="font-semibold">{request.clientName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Kontakt</p>
                <p className="font-semibold">{request.contact}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Data załadunku</p>
                <p className="font-semibold">{request.loadDate}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Szczegóły trasy</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Punkt załadunku</p>
                <p className="font-semibold">{request.routeStart}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Punkt rozładunku</p>
                <p className="font-semibold">{request.routeEnd}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Wymagany typ ciężarówki</p>
                <p className="font-semibold">{request.truckType}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Szczegóły ładunku</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Waga</p>
                <p className="font-semibold">{request.weight?.toLocaleString()} kg</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Objętość</p>
                <p className="font-semibold">{request.volume} m³</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">ADR</p>
                <p className="font-semibold">{request.adr ? "Tak" : "Nie"}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Wymagania specjalne</h2>
            <p className="text-foreground">
              {request.specialRequirements || "Brak wymagań specjalnych"}
            </p>
          </Card>
        </div>

        {/* FR.TRANS.05 - Action buttons (visible only for "Oczekujące") */}
        {request.status === "Oczekujące" && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Akcje</h2>
            <div className="flex gap-4">
              <Button 
                onClick={handleAccept}
                className="flex-1 bg-success hover:bg-success/90 text-success-foreground"
                size="lg"
              >
                <CheckCircle className="mr-2 h-5 w-5" />
                Akceptuj Zgłoszenie
              </Button>
              <Button 
                onClick={handleReject}
                variant="destructive"
                className="flex-1"
                size="lg"
              >
                <XCircle className="mr-2 h-5 w-5" />
                Odrzuć Zgłoszenie
              </Button>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ShipmentRequestDetail;
