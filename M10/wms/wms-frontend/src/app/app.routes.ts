import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: '',
    loadComponent: () => import('./layout.component').then(m => m.LayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'cargo-management',
        loadComponent: () => import('./features/cargo-management/cargo-management.component').then(m => m.CargoManagementComponent)
      },
      {
        path: 'cargo-management/:id',
        loadComponent: () => import('./features/cargo-management/cargo-detail.component').then(m => m.CargoDetailComponent)
      },
      {
        
        path: 'warehouse-operations',
        loadComponent: () => import('./features/warehouse-operations/warehouse-operations.component').then(m => m.WarehouseOperationsComponent)
      },
      {
        path: 'storage-requests',
        loadComponent: () => import('./features/storage-requests/storage-requests.component').then(m => m.StorageRequestsComponent)
      },
      {
        path: 'storage-requests/:id',
        loadComponent: () => import('./features/storage-requests/storage-request-detail.component').then(m => m.StorageRequestDetailComponent)
      },
      {
        path: 'reservations',
        loadComponent: () => import('./features/reservations/reservations.component').then(m => m.ReservationsComponent)
      },
      {
        path: 'warehouse-map',
        loadComponent: () => import('./features/warehouse-map/warehouse-map.component').then(m => m.WarehouseMapComponent)
      },
      {
        path: 'dock-management',
        loadComponent: () => import('./features/dock-management/dock-management.component').then(m => m.DockManagementComponent)
      },
      {
        path: 'dock-management/:id',
        loadComponent: () => import('./features/dock-management/dock-detail.component').then(m => m.DockDetailComponent)
      },
      {
        path: 'billing-payments',
        loadComponent: () => import('./features/billing-payments/billing-payments.component').then(m => m.BillingPaymentsComponent)
      },
      {
        path: 'billing-payments/invoice/:id',
        loadComponent: () => import('./features/billing-payments/invoice-detail.component').then(m => m.InvoiceDetailComponent)
      },
      {
        path: 'contractors',
        loadComponent: () => import('./features/contractors/contractor-listing/contractors.component').then(m => m.ContractorsComponent)
      },
      {
        path: 'contractors/:id',
        loadComponent: () => import('./features/contractors/contractor-details/contractor-details.component').then(m => m.ContractorDetailComponent)
      },
      {
        path: 'employees',
        loadComponent: () => import('./features/employees/employees.component').then(m => m.EmployeesComponent),
        data: { role: 'Warehouse Manager' }
      },
      {
        path: 'employees/:id',
        loadComponent: () => import('./features/employees/employee-detail.component').then(m => m.EmployeeDetailComponent),
        data: { role: 'Warehouse Manager' }
      },
      
      {
        path: 'role-management',
        loadComponent: () => import('./features/role-management/role-management.component').then(m => m.RoleManagementComponent),
        data: { role: 'Warehouse Manager' }
      },
      {
        path: 'settings',
        loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent)
      },
      {
        path: 'reports',
        loadComponent: () => import('./features/reports/reports.component').then(m => m.ReportsComponent),
        data: { role: 'Warehouse Manager' }
      },
      // Legacy route redirect
      {
        path: 'inventory',
        redirectTo: '/cargo-management',
        pathMatch: 'full'
      },
      // Legacy users route redirect
      {
        path: 'users',
        redirectTo: '/employees',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];