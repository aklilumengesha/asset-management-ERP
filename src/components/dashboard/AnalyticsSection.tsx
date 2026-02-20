import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AnalyticsSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Request Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Analytics charts will go here</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Asset Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Asset statistics will go here</p>
        </CardContent>
      </Card>
    </div>
  );
}
