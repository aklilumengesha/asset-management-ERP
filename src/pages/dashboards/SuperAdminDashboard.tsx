import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Package, FileText, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { useRole } from "@/hooks/useRole";

export default function SuperAdminDashboard() {
  const navigate = useNavigate();
  const { role, profile } = useRole();
  const { stats, loading, error } = useDashboardStats(role, profile?.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Full system access and control</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
            ) : error ? (
              <div className="text-sm text-destructive">Error loading data</div>
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
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-4 w-32" />
              </>
            ) : error ? (
              <div className="text-sm text-destructive">Error loading data</div>
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
            ) : error ? (
              <div className="text-sm text-destructive">Error loading data</div>
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
            <CardTitle className="text-sm font-medium">System Alerts</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-4 w-32" />
              </>
            ) : error ? (
              <div className="text-sm text-destructive">Error loading data</div>
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.systemAlerts || 0}</div>
                <p className="text-xs text-muted-foreground">Require attention</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => navigate('/admin/users')}
            >
              <Users className="mr-2 h-4 w-4" />
              Manage Users
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => navigate('/assets')}
            >
              <Package className="mr-2 h-4 w-4" />
              View All Assets
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => navigate('/admin/audit-logs')}
            >
              <FileText className="mr-2 h-4 w-4" />
              View Audit Logs
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 mt-2 rounded-full bg-blue-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">John created asset "Dell Laptop"</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 mt-2 rounded-full bg-green-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Sarah approved request REQ-001</p>
                  <p className="text-xs text-muted-foreground">4 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 mt-2 rounded-full bg-purple-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Mike created PO-2024-045</p>
                  <p className="text-xs text-muted-foreground">6 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
