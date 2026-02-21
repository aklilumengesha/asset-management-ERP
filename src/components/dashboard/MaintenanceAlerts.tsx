
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { useMaintenanceAlerts } from "@/hooks/useMaintenanceAlerts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function MaintenanceAlerts() {
  const navigate = useNavigate();
  const { alerts, loading, error } = useMaintenanceAlerts(5);
  
  return (
    <Card className="border rounded-lg">
      <CardHeader className="border-b pb-3 p-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Maintenance Alerts
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-primary" 
            onClick={() => navigate("/maintenance")}
          >
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="p-4 space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : error ? (
          <div className="p-4 text-sm text-destructive">Error loading maintenance alerts</div>
        ) : alerts.length === 0 ? (
          <div className="p-4 text-sm text-muted-foreground text-center">
            No upcoming maintenance scheduled
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Priority</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alerts.map((alert) => (
                <TableRow key={alert.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>{alert.asset}</TableCell>
                  <TableCell>{alert.dueDate}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      alert.priority === 'high' 
                        ? 'bg-red-100 text-red-800' 
                        : alert.priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                    }`}>
                      {alert.priority}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
