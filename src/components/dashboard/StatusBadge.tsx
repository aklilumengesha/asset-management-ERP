
import { Badge } from "@/components/ui/badge";
import { RequestStatus, requestStatuses } from "./types";
import { useRequestStatuses } from "@/hooks/useRequestStatuses";

interface StatusBadgeProps {
  status: RequestStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const { statuses, getStatusColor } = useRequestStatuses();
  
  // Find the status from database
  const statusData = statuses.find(s => s.code === status);
  
  // Use database data if available, otherwise fall back to static mapping
  const label = statusData?.name || requestStatuses[status]?.label || status;
  const colorClass = statusData?.colorClass || requestStatuses[status]?.color || 'bg-gray-100 text-gray-700 border border-gray-200';
  
  return (
    <Badge 
      variant="secondary" 
      className={colorClass}
    >
      {label}
    </Badge>
  );
}
