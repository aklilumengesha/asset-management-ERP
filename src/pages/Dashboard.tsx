import { useRole } from "@/hooks/useRole";
import SuperAdminDashboard from "./dashboards/SuperAdminDashboard";
import EmployeeDashboard from "./dashboards/EmployeeDashboard";

export default function Dashboard() {
  const { role, loading } = useRole();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="h-8 w-8 border-t-2 border-r-2 border-primary rounded-full animate-spin" />
      </div>
    );
  }

  // Route to appropriate dashboard based on role
  if (role === 'super_admin') return <SuperAdminDashboard />;
  if (role === 'admin') return <SuperAdminDashboard />; // Temporary: use same as super_admin
  if (role === 'finance_manager') return <SuperAdminDashboard />; // Temporary
  if (role === 'asset_manager') return <SuperAdminDashboard />; // Temporary
  if (role === 'procurement_manager') return <SuperAdminDashboard />; // Temporary
  if (role === 'department_head') return <SuperAdminDashboard />; // Temporary
  if (role === 'employee') return <EmployeeDashboard />;

  // Fallback for unknown roles
  return <EmployeeDashboard />;
}
