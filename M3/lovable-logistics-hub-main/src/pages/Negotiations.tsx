import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CheckCircle, XCircle, Clock } from "lucide-react";

type NegotiationStatus = "Propozycja" | "Weryfikacja" | "Zamknięta (Sukces)" | "Zamknięta (Porażka)";

interface Negotiation {
  id: string;
  client: string;
  status: NegotiationStatus;
  proposedRate: number;
  currentRate?: number;
  route: string;
  volume: string;
  startDate: string;
  history: Array<{
    date: string;
    action: string;
    details: string;
  }>;
}

const Negotiations = () => {
  // FR.NEG.01 - Static list of negotiations
  const [negotiations, setNegotiations] = useState<Negotiation[]>([
    {
      id: "NEG001",
      client: "TransLog Sp. z o.o.",
      status: "Propozycja",
      proposedRate: 2.50,
      route: "Warszawa - Berlin",
      volume: "20 tras/miesiąc",
      startDate: "2025-12-01",
      history: [
        { date: "2025-11-10", action: "Propozycja wysłana", details: "Stawka: 2.50 EUR/km" },
      ]
    },
    {
      id: "NEG002",
      client: "EuroFreight GmbH",
      status: "Weryfikacja",
      proposedRate: 2.80,
      currentRate: 2.65,
      route: "Gdańsk - Hamburg",
      volume: "15 tras/miesiąc",
      startDate: "2025-11-20",
      history: [
        { date: "2025-11-05", action: "Propozycja wysłana", details: "Stawka: 2.80 EUR/km" },
        { date: "2025-11-12", action: "Kontrpropozycja", details: "Klient zaproponował: 2.65 EUR/km" },
      ]
    },
    {
      id: "NEG003",
      client: "SpeedCargo International",
      status: "Zamknięta (Sukces)",
      proposedRate: 2.45,
      currentRate: 2.45,
      route: "Kraków - Wiedeń",
      volume: "30 tras/miesiąc",
      startDate: "2025-11-15",
      history: [
        { date: "2025-10-20", action: "Propozycja wysłana", details: "Stawka: 2.45 EUR/km" },
        { date: "2025-10-25", action: "Negocjacje", details: "Uzgodniono warunki płatności" },
        { date: "2025-11-01", action: "Umowa podpisana", details: "Sukces - rozpoczęcie 15.11.2025" },
      ]
    },
    {
      id: "NEG004",
      client: "NordTransport AS",
      status: "Propozycja",
      proposedRate: 3.20,
      route: "Szczecin - Oslo",
      volume: "10 tras/miesiąc",
      startDate: "2025-12-10",
      history: [
        { date: "2025-11-12", action: "Propozycja wysłana", details: "Stawka: 3.20 EUR/km" },
      ]
    },
    {
      id: "NEG005",
      client: "ChemLogistics Polska",
      status: "Zamknięta (Porażka)",
      proposedRate: 3.50,
      currentRate: 2.90,
      route: "Wrocław - Rotterdam",
      volume: "25 tras/miesiąc",
      startDate: "2025-11-01",
      history: [
        { date: "2025-10-15", action: "Propozycja wysłana", details: "Stawka: 3.50 EUR/km (ADR)" },
        { date: "2025-10-22", action: "Kontrpropozycja", details: "Klient zaproponował: 2.90 EUR/km" },
        { date: "2025-10-28", action: "Odrzucono", details: "Różnica cenowa zbyt duża" },
      ]
    },
  ]);

  const [selectedNegotiation, setSelectedNegotiation] = useState<Negotiation | null>(null);

  // FR.NEG.03 - Mark as closed (local only)
  const closeNegotiation = (id: string, success: boolean) => {
    const newStatus: NegotiationStatus = success ? "Zamknięta (Sukces)" : "Zamknięta (Porażka)";
    setNegotiations(negotiations.map(neg =>
      neg.id === id ? { ...neg, status: newStatus } : neg
    ));
    toast.success(`Negocjacja ${id} zamknięta jako ${success ? "sukces" : "porażka"}`);
    setSelectedNegotiation(null);
  };

  const getStatusBadge = (status: NegotiationStatus) => {
    const variants: Record<NegotiationStatus, { className: string }> = {
      "Propozycja": { className: "bg-accent text-accent-foreground" },
      "Weryfikacja": { className: "bg-warning text-warning-foreground" },
      "Zamknięta (Sukces)": { className: "bg-success text-success-foreground" },
      "Zamknięta (Porażka)": { className: "bg-muted text-muted-foreground" },
    };
    return <Badge className={variants[status].className}>{status}</Badge>;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Negocjacje Umów</h1>
          <p className="text-muted-foreground mt-1">Zarządzanie procesem negocjacji</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* List of negotiations */}
          <div className="lg:col-span-1 space-y-3">
            {negotiations.map((negotiation) => (
              <Card
                key={negotiation.id}
                className={`p-4 cursor-pointer hover:shadow-md transition-shadow ${
                  selectedNegotiation?.id === negotiation.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setSelectedNegotiation(negotiation)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-sm">{negotiation.id}</h3>
                  {getStatusBadge(negotiation.status)}
                </div>
                <p className="text-sm font-medium mb-1">{negotiation.client}</p>
                <p className="text-xs text-muted-foreground">{negotiation.route}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Stawka: {negotiation.proposedRate} EUR/km
                </p>
              </Card>
            ))}
          </div>

          {/* FR.NEG.02 - Detail view with history */}
          <div className="lg:col-span-2">
            {selectedNegotiation ? (
              <div className="space-y-4">
                <Card className="p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold">{selectedNegotiation.id}</h2>
                      <p className="text-lg text-muted-foreground">{selectedNegotiation.client}</p>
                    </div>
                    {getStatusBadge(selectedNegotiation.status)}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-muted-foreground">Trasa</p>
                      <p className="font-semibold">{selectedNegotiation.route}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Wolumen</p>
                      <p className="font-semibold">{selectedNegotiation.volume}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Proponowana stawka</p>
                      <p className="font-semibold">{selectedNegotiation.proposedRate} EUR/km</p>
                    </div>
                    {selectedNegotiation.currentRate && (
                      <div>
                        <p className="text-sm text-muted-foreground">Aktualna stawka</p>
                        <p className="font-semibold">{selectedNegotiation.currentRate} EUR/km</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-muted-foreground">Planowany start</p>
                      <p className="font-semibold">{selectedNegotiation.startDate}</p>
                    </div>
                  </div>

                  {/* FR.NEG.03 - Action buttons for open negotiations */}
                  {(selectedNegotiation.status === "Propozycja" || selectedNegotiation.status === "Weryfikacja") && (
                    <div className="flex gap-4 pt-4 border-t">
                      <Button
                        onClick={() => closeNegotiation(selectedNegotiation.id, true)}
                        className="flex-1 bg-success hover:bg-success/90 text-success-foreground"
                      >
                        <CheckCircle className="mr-2 h-5 w-5" />
                        Zamknij jako Sukces
                      </Button>
                      <Button
                        onClick={() => closeNegotiation(selectedNegotiation.id, false)}
                        variant="outline"
                        className="flex-1"
                      >
                        <XCircle className="mr-2 h-5 w-5" />
                        Zamknij jako Porażka
                      </Button>
                    </div>
                  )}
                </Card>

                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Historia Negocjacji</h3>
                  <div className="space-y-4">
                    {selectedNegotiation.history.map((entry, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="h-3 w-3 rounded-full bg-primary" />
                          {index < selectedNegotiation.history.length - 1 && (
                            <div className="h-full w-0.5 bg-border mt-1" />
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="flex items-center gap-2 mb-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{entry.date}</span>
                          </div>
                          <p className="font-semibold">{entry.action}</p>
                          <p className="text-sm text-muted-foreground">{entry.details}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            ) : (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">Wybierz negocjację z listy, aby zobaczyć szczegóły</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Negotiations;
