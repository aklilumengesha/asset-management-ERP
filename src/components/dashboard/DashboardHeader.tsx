interface DashboardHeaderProps {
  timeRange: string;
  setTimeRange: (value: string) => void;
  compareWith: string;
  setCompareWith: (value: string) => void;
  frequency: string;
  setFrequency: (value: string) => void;
  onAddRequest: () => void;
  onExport: () => void;
}

export function DashboardHeader({
  timeRange,
  setTimeRange,
  compareWith,
  setCompareWith,
  frequency,
  setFrequency,
  onAddRequest,
  onExport,
}: DashboardHeaderProps) {
  return (
    <div className="flex items-center gap-4">
      <p className="text-sm text-muted-foreground">
        Dashboard controls will go here
      </p>
    </div>
  );
}
