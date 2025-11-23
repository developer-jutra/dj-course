import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Fleet from "./pages/Fleet";
import Shipments from "./pages/Shipments";
import Incidents from "./pages/Incidents";
import Contracts from "./pages/Contracts";
import NotFound from "./pages/NotFound";
import DashboardLayout from "./components/DashboardLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
          <Route path="/fleet" element={<DashboardLayout><Fleet /></DashboardLayout>} />
          <Route path="/shipments" element={<DashboardLayout><Shipments /></DashboardLayout>} />
          <Route path="/incidents" element={<DashboardLayout><Incidents /></DashboardLayout>} />
          <Route path="/contracts" element={<DashboardLayout><Contracts /></DashboardLayout>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
