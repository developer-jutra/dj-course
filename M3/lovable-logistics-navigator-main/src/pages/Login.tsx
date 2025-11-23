import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck } from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Symulacja logowania - w przyszłości integracja z Lovable Cloud
    setTimeout(() => {
      if (email && password) {
        localStorage.setItem("isAuthenticated", "true");
        toast.success("Zalogowano pomyślnie");
        navigate("/dashboard");
      } else {
        toast.error("Proszę wypełnić wszystkie pola");
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-primary p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary rounded-full p-4">
              <Truck className="h-10 w-10 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Logistics Manager Portal</CardTitle>
          <CardDescription>
            Zaloguj się do systemu zarządzania logistyką
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="manager@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Hasło</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logowanie..." : "Zaloguj się"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => toast.info("Funkcja resetowania hasła zostanie wkrótce dodana")}
            >
              Nie pamiętam hasła
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
