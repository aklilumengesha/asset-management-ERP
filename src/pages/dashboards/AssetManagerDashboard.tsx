import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Wrench, TrendingDown, AlertTriangle } from "lucide-react";
import { useRole } from "@/hooks/useRole";
import { RecentActivityFeed } from "@/components/dashboard/RecentActivityFeed";

export default function AssetManagerDashboard() {
  const { profile } = useRole();

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Asset Manager Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {profile?.first_name}! Manage and track all company assets.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+12 this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance Due</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">Next 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assets in Use</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">987</div>
            <p className="text-xs text-muted-foreground">80% utilization</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
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
              <Package className="h-5 w-5" />
              <span>Add New Asset</span>
            </button>
            <button className="w-full text-left p-3 rounded-lg hover:bg-accent transition-colors flex items-center gap-3">
              <Wrench className="h-5 w-5" />
              <span>Schedule Maintenance</span>
            </button>
            <button className="w-full text-left p-3 rounded-lg hover:bg-accent transition-colors flex items-center gap-3">
              <TrendingDown className="h-5 w-5" />
              <span>View Asset Reports</span>
            </button>
          </CardContent>
        </Card>

        <RecentActivityFeed limit={5} module="assets" />
      </div>
    </div>
  );
}
