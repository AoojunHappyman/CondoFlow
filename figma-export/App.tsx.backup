import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';

// Layout Components
import { DemoRoleBar } from './components/layout/DemoRoleBar';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { SessionTimeoutModal } from './components/layout/SessionTimeoutModal';
import { ToastContainer } from './components/common/ToastContainer';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';

// Dashboard Pages
import { AdminDashboard } from './pages/dashboards/AdminDashboard';
import { TenantDashboard } from './pages/dashboards/TenantDashboard';
import { OwnerDashboard } from './pages/dashboards/OwnerDashboard';
import { UserDashboard } from './pages/dashboards/UserDashboard';

// Units Pages
import { UnitsPage } from './pages/units/UnitsPage';
import { UnitDetailPage } from './pages/units/UnitDetailPage';

// Operational & Management Pages
import { OwnersTenantsPage } from './pages/admin/OwnersTenantsPage';
import { ContractsPage } from './pages/contracts/ContractsPage';
import { InvoicesPage } from './pages/invoices/InvoicesPage';
import { PaymentsQueuePage } from './pages/invoices/PaymentsQueuePage';
import { RepairsPage } from './pages/repairs/RepairsPage';
import { ParcelsPage } from './pages/parcels/ParcelsPage';
import { AnnouncementsPage } from './pages/announcements/AnnouncementsPage';
import { NotificationsPage } from './pages/notifications/NotificationsPage';
import { TransactionHistoryPage } from './pages/history/TransactionHistoryPage';
import { ProfilePage } from './pages/profile/ProfilePage';

// Admin Governance & Analytics Pages
import { RolesPage } from './pages/admin/RolesPage';
import { ReportsPage } from './pages/admin/ReportsPage';
import { AuditLogPage } from './pages/admin/AuditLogPage';
import { SystemCoveragePage } from './pages/admin/SystemCoveragePage';
import { SettingsPage } from './pages/admin/SettingsPage';
import { DeveloperTeamPage } from './pages/team/DeveloperTeamPage';

// Error & Maintenance Pages
import { Error403 } from './pages/errors/Error403';
import { Error404 } from './pages/errors/Error404';
import { Error500 } from './pages/errors/Error500';
import { MaintenancePage } from './pages/errors/MaintenancePage';

const MainRouter: React.FC = () => {
  const { currentRoute, activeRole, isMaintenanceMode } = useApp();

  // Maintenance mode guard (Admin can always bypass to manage/turn off)
  if (isMaintenanceMode && activeRole !== 'admin') {
    return <MaintenancePage />;
  }

  // Explicit error testing routes
  if (currentRoute === '/error/403' || currentRoute === '/403') return <Error403 />;
  if (currentRoute === '/error/404' || currentRoute === '/404') return <Error404 />;
  if (currentRoute === '/error/500' || currentRoute === '/500') return <Error500 />;

  // Dynamic Route: Unit Details (/units/:id)
  if (currentRoute.startsWith('/units/')) {
    const unitId = currentRoute.replace('/units/', '');
    return <UnitDetailPage unitId={unitId} />;
  }

  // Route switchboard
  switch (currentRoute) {
    // Dashboards
    case '/':
    case '/dashboard':
      if (activeRole === 'admin') return <AdminDashboard />;
      if (activeRole === 'tenant') return <TenantDashboard />;
      if (activeRole === 'owner') return <OwnerDashboard />;
      return <UserDashboard />;

    case '/admin/dashboard':
      return activeRole === 'admin' ? <AdminDashboard /> : <Error403 />;

    // System Coverage 25 FR (Executive Matrix)
    case '/admin/system-coverage':
      return activeRole === 'admin' ? <SystemCoveragePage /> : <Error403 />;

    // Unit Management
    case '/admin/units':
      return activeRole === 'admin' ? <UnitsPage /> : <Error403 />;
    case '/owner/units':
      return (activeRole === 'owner' || activeRole === 'admin') ? <UnitsPage /> : <Error403 />;
    case '/units':
      return <UnitsPage />;

    // Owners & Tenants Management
    case '/admin/owners-tenants':
      return activeRole === 'admin' ? <OwnersTenantsPage /> : <Error403 />;

    // Contracts Management
    case '/admin/contracts':
      return activeRole === 'admin' ? <ContractsPage /> : <Error403 />;
    case '/owner/contracts':
      return (activeRole === 'owner' || activeRole === 'admin') ? <ContractsPage /> : <Error403 />;
    case '/contracts':
      return activeRole !== 'user' ? <ContractsPage /> : <Error403 />;

    // Invoices & Billing
    case '/admin/invoices':
      return activeRole === 'admin' ? <InvoicesPage /> : <Error403 />;
    case '/owner/expenses':
      return (activeRole === 'owner' || activeRole === 'admin') ? <InvoicesPage /> : <Error403 />;
    case '/payments':
    case '/invoices':
      return activeRole !== 'user' ? <InvoicesPage /> : <Error403 />;

    // Payment Verification Queue
    case '/admin/payments':
      return activeRole === 'admin' ? <PaymentsQueuePage /> : <Error403 />;

    // Repairs / Maintenance
    case '/admin/repairs':
      return activeRole === 'admin' ? <RepairsPage /> : <Error403 />;
    case '/repairs':
    case '/maintenance':
      return <RepairsPage />;

    // Parcels Management & Pickup
    case '/admin/parcels':
      return activeRole === 'admin' ? <ParcelsPage /> : <Error403 />;
    case '/parcels':
      return activeRole !== 'user' ? <ParcelsPage /> : <Error403 />;

    // Announcements
    case '/admin/announcements':
    case '/announcements':
      return <AnnouncementsPage />;

    // Reports & Analytics
    case '/admin/reports':
      return activeRole === 'admin' ? <ReportsPage /> : <Error403 />;

    // Roles & Permissions Matrix
    case '/admin/roles':
      return activeRole === 'admin' ? <RolesPage /> : <Error403 />;

    // Audit Log
    case '/admin/audit-log':
      return activeRole === 'admin' ? <AuditLogPage /> : <Error403 />;

    // Settings & Simulator Controls
    case '/admin/settings':
      return activeRole === 'admin' ? <SettingsPage /> : <Error403 />;

    // Developer Team Page
    case '/team':
    case '/developer-team':
      return <DeveloperTeamPage />;

    // Common Profile & Logs
    case '/profile':
      return <ProfilePage />;
    case '/notifications':
      return <NotificationsPage />;
    case '/history':
      return <TransactionHistoryPage />;

    default:
      return <Error404 />;
  }
};

const AuthRouter: React.FC = () => {
  const { currentRoute } = useApp();

  if (currentRoute === '/register') {
    return <RegisterPage />;
  }
  if (currentRoute === '/forgot-password') {
    return <ForgotPasswordPage />;
  }
  return <LoginPage />;
};

const AppContent: React.FC = () => {
  const { currentUser, currentRoute } = useApp();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Auth routing check
  const isAuthRoute =
    !currentUser ||
    currentRoute === '/login' ||
    currentRoute === '/register' ||
    currentRoute === '/forgot-password';

  if (isAuthRoute) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
        <DemoRoleBar />
        <AuthRouter />
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/70 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200 flex flex-col">
      {/* 1. Demo Mode Role Switcher Bar */}
      <DemoRoleBar />

      <div className="flex-1 flex w-full">
        {/* 2. Collapsible Desktop/Tablet Sidebar */}
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
        />

        {/* 3. Main Workspace */}
        <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-8">
          <Navbar onToggleSidebar={() => setIsSidebarCollapsed(prev => !prev)} />
          <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto">
            <MainRouter />
          </main>
        </div>
      </div>

      {/* 4. Responsive Bottom Navigation for Mobile */}
      <MobileNav />

      {/* 5. Modals & Alerts */}
      <SessionTimeoutModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
