import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Package, AlertTriangle, TrendingUp } from "lucide-react";

const Dashboard = () => {
  const stats = [
    {
      title: "Pojazdy Dostępne",
      value: "42",
      total: "z 50",
      icon: Truck,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Aktywne Zgłoszenia",
      value: "18",
      subtitle: "Oczekujące: 5",
      icon: Package,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      title: "Otwarte Incydenty",
      value: "3",
      subtitle: "Priorytet wysoki: 1",
      icon: AlertTriangle,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      title: "Efektywność",
      value: "94%",
      subtitle: "+2.5% vs. poprzedni tydzień",
      icon: TrendingUp,
      color: "text-success",
      bgColor: "bg-success/10",
    },
  ];

  const recentActivities = [
    { id: 1, type: "Pojazd", message: "TK-12345 wrócił z trasy", time: "5 min temu" },
    { id: 2, type: "Zgłoszenie", message: "Nowe zgłoszenie #ZT-2024-089", time: "12 min temu" },
    { id: 3, type: "Incydent", message: "Incydent #INC-045 rozwiązany", time: "1 godz. temu" },
    { id: 4, type: "Umowa", message: "Negocjacje z Klient XYZ zakończone", time: "2 godz. temu" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Dashboard</h2>
        <p className="text-muted-foreground">Przegląd kluczowych wskaźników operacyjnych</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`${stat.bgColor} p-2 rounded-lg`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.total || stat.subtitle}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Ostatnia Aktywność</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start justify-between border-b border-border pb-3 last:border-0">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded">
                        {activity.type}
                      </span>
                    </div>
                    <p className="text-sm text-foreground mt-1">{activity.message}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Pojazdy w Trasie</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { id: "TK-12345", route: "Warszawa → Gdańsk", progress: 75 },
                { id: "TK-67890", route: "Kraków → Wrocław", progress: 45 },
                { id: "TK-11223", route: "Poznań → Łódź", progress: 90 },
              ].map((vehicle) => (
                <div key={vehicle.id} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">{vehicle.id}</span>
                    <span className="text-muted-foreground">{vehicle.route}</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${vehicle.progress}%` }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground text-right">
                    {vehicle.progress}% ukończone
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
