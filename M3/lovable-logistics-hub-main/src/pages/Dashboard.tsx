import { Card } from "@/components/ui/card";
import { Truck, AlertCircle, FileText, TrendingUp } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

const Dashboard = () => {
  // FR.DASH - Static data for dashboard
  const stats = [
    {
      title: "Aktywne Ciężarówki",
      value: "120/150",
      icon: Truck,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Oczekujące Zgłoszenia",
      value: "5",
      icon: FileText,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      title: "Aktywne Incydenty",
      value: "2",
      icon: AlertCircle,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
    {
      title: "Zamknięte Negocjacje (miesiąc)",
      value: "85%",
      icon: TrendingUp,
      color: "text-success",
      bgColor: "bg-success/10",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Przegląd operacji logistycznych</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold text-foreground mt-2">{stat.value}</p>
                </div>
                <div className={`h-12 w-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Status Floty</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">W trasie</span>
                <span className="font-semibold">85 ciężarówek</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Dostępne</span>
                <span className="font-semibold">35 ciężarówek</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">W serwisie</span>
                <span className="font-semibold">30 ciężarówek</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Ostatnie Aktywności</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-success mt-2" />
                <div>
                  <p className="text-sm font-medium">Zaakceptowano zgłoszenie #1234</p>
                  <p className="text-xs text-muted-foreground">15 minut temu</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-warning mt-2" />
                <div>
                  <p className="text-sm font-medium">Nowy incydent: Opóźnienie dostawa</p>
                  <p className="text-xs text-muted-foreground">1 godzinę temu</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                <div>
                  <p className="text-sm font-medium">Zamknięto negocjację z TransLog Sp. z o.o.</p>
                  <p className="text-xs text-muted-foreground">2 godziny temu</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
