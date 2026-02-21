import { useRole } from "@/hooks/useRole";
import SuperAdminDashboard from "./dashboards/SuperAdminDashboard";
import AdminDashboard from "./dashboards/AdminDashboard";
import FinanceManagerDashboard from "./dashboards/FinanceManagerDashboard";
import AssetManagerDashboard from "./dashboards/AssetManagerDashboard";
import ProcurementManagerDashboard from "./dashboards/ProcurementManagerDashboard";
import DepartmentHeadDashboard from "./dashboards/DepartmentHeadDashboard";
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
  if (role === 'admin') return <AdminDashboard />;
  if (role === 'finance_manager') return <FinanceManagerDashboard />;
  if (role === 'asset_manager') return <AssetManagerDashboard />;
  if (role === 'procurement_manager') return <ProcurementManagerDashboard />;
  if (role === 'department_head') return <DepartmentHeadDashboard />;
  if (role === 'employee') return <EmployeeDashboard />;

  // Fallback for unknown roles
  return <EmployeeDashboard />;
}
