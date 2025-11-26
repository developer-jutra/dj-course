import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/layout/Layout";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import { RoutePlanner } from '@/pages/RoutePlanner';
import Orders from "@/pages/orders/Orders";
import OrderDetails from "@/pages/orders/OrderDetails";
import NewOrderForm from "@/pages/orders/NewOrderForm";
import IncidentReportForm from "@/pages/Incident-new";
import CustomerClaimForm from "@/pages/Claim-new";
import ShipmentTracking from "@/pages/shipments/ShipmentTracking";
import { DriversPage } from "@/pages/DriversPage";
import { DriverDetailsPage } from "@/pages/DriverDetailsPage";
import { DriverCalendarPage } from "@/pages/DriverCalendarPage";
import { MaintenancePage } from "@/pages/MaintenancePage";
import { DocumentsPage } from "@/pages/DocumentsPage";
import Payments from "@/pages/Payments";
import VehiclesPage from "@/pages/VehiclesPage";
import Incidents from "@/pages/Incidents";
import Claims from "@/pages/Claims";
import Expenses from "@/pages/Expenses";
import ExpenseDetails from "@/pages/Expense-Details";
import Urgent from "@/pages/Urgent";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";

const ProtectedLayout = () => (
    <ProtectedRoute>
      <Layout>
        <Outlet />
      </Layout>
    </ProtectedRoute>
  );

export const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route element={<ProtectedLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/routes" element={<RoutePlanner />} />
                <Route path="/routes/:id" element={<RoutePlanner />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/orders/new" element={<NewOrderForm />} />
                <Route path="/orders/:id" element={<OrderDetails />} />
                <Route path="/documents" element={<DocumentsPage />} />
                <Route path="/drivers" element={<DriversPage />} />
                <Route path="/drivers/:id/details" element={<DriverDetailsPage />} />
                <Route path="/drivers/:id/calendar" element={<DriverCalendarPage />} />
                <Route path="/vehicles" element={<VehiclesPage />} />
                <Route path="/maintenance" element={<MaintenancePage />} />
                <Route path="/maintenance/:id" element={<MaintenancePage />} />
                <Route path="/claims/new" element={<CustomerClaimForm />} />
                <Route path="/incidents/new" element={<IncidentReportForm />} />
                <Route path="/expenses" element={<Expenses />} />
                <Route path="/expenses/:id" element={<ExpenseDetails />} />
                <Route path="/payments" element={<Payments />} />
                <Route path="/incidents" element={<Incidents />} />
                <Route path="/claims" element={<Claims />} />
                <Route path="/urgent" element={<Urgent />} />
                <Route path="/profile" element={<Profile />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
    )
}
