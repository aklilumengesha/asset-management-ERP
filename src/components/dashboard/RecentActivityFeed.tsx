import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useActivityFeed } from "@/hooks/useActivityFeed";
import { formatDistanceToNow } from "date-fns";
import { ActivityLog } from "@/types/activity";

interface RecentActivityFeedProps {
  limit?: number;
  module?: string;
  showTitle?: boolean;
}

export function RecentActivityFeed({ 
  limit = 5, 
  module,
  showTitle = true 
}: RecentActivityFeedProps) {
  const { activities, loading, error } = useActivityFeed({ 
    limit,
    module: module as any
  });

  const getActivityColor = (action: string) => {
    switch (action) {
      case 'create':
        return 'bg-blue-500';
      case 'update':
        return 'bg-yellow-500';
      case 'delete':
        return 'bg-red-500';
      case 'approve':
        return 'bg-green-500';
      case 'reject':
        return 'bg-red-500';
      case 'login':
        return 'bg-purple-500';
      case 'logout':
        return 'bg-gray-500';
      default:
        return 'bg-blue-500';
    }
  };

  const formatActivityDescription = (activity: ActivityLog) => {
    const userName = activity.user 
      ? `${activity.user.first_name} ${activity.user.last_name}`
      : 'Someone';
    
    return `${userName} ${activity.description}`;
  };

  if (loading) {
    return (
      <Card>
        {showTitle && (
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start space-x-3">
                <Skeleton className="w-2 h-2 mt-2 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        {showTitle && (
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <div className="text-sm text-destructive">
            Error loading recent activity
          </div>
        </CardContent>
      </Card>
    );
  }

  if (activities.length === 0) {
    return (
      <Card>
        {showTitle && (
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <div className="text-sm text-muted-foreground text-center py-4">
            No recent activity
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      {showTitle && (
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className={`w-2 h-2 mt-2 rounded-full ${getActivityColor(activity.action)}`} />
              <div className="flex-1">
                <p className="text-sm font-medium">
                  {formatActivityDescription(activity)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
