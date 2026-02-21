import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Settings, FileText, Activity } from "lucide-react";
import { useRole } from "@/hooks/useRole";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { RecentActivityFeed } from "@/components/dashboard/RecentActivityFeed";

export default function AdminDashboard() {
  const { profile, role } = useRole();
  const { stats, loading, error } = useDashboardStats(role, profile?.id);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {profile?.first_name}! Manage system operations and users.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-4 w-32" />
              </>
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.totalUsers || 0}</div>
                <p className="text-xs text-muted-foreground">Registered in system</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-4 w-32" />
              </>
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.totalAssets || 0}</div>
                <p className="text-xs text-muted-foreground">In inventory</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Requests</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-4 w-32" />
              </>
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.activeRequests || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.pendingApprovals || 0} pending approval
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-4 w-32" />
              </>
            ) : (
              <>
                <div className="text-2xl font-bold">98%</div>
                <p className="text-xs text-muted-foreground">All systems operational</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <button className="w-full text-left p-3 rounded-lg hover:bg-accent transition-colors flex items-center gap-3">
              <Users className="h-5 w-5" />
              <span>Manage Users</span>
            </button>
            <button className="w-full text-left p-3 rounded-lg hover:bg-accent transition-colors flex items-center gap-3">
              <Settings className="h-5 w-5" />
              <span>System Settings</span>
            </button>
            <button className="w-full text-left p-3 rounded-lg hover:bg-accent transition-colors flex items-center gap-3">
              <FileText className="h-5 w-5" />
              <span>View Audit Logs</span>
            </button>
          </CardContent>
        </Card>

        <RecentActivityFeed limit={5} />
      </div>
    </div>
  );
}
