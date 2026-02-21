
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useDepartmentSpending } from "@/hooks/useDepartmentSpending";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function DepartmentSpending() {
  const { departments, loading, error } = useDepartmentSpending(5);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">Top Departments by Spend</h3>
        <Select defaultValue="allTime">
          <SelectTrigger className="w-[130px] border-0 shadow-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="allTime">All time</SelectItem>
            <SelectItem value="thisYear">This year</SelectItem>
            <SelectItem value="thisQuarter">This quarter</SelectItem>
            <SelectItem value="thisMonth">This month</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {loading ? (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-2 w-full" />
              <Skeleton className="h-3 w-32" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-sm text-destructive">Error loading department spending</div>
      ) : departments.length === 0 ? (
        <div className="text-sm text-muted-foreground text-center py-8">
          No department spending data available
        </div>
      ) : (
        <div className="space-y-6">
          {departments.map((dept) => (
            <div key={dept.name} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{dept.name}</span>
                <span className="text-muted-foreground">
                  {formatCurrency(dept.spent)} / {formatCurrency(dept.budget)}
                </span>
              </div>
              <div className="relative pt-1">
                <Progress 
                  value={dept.percentage} 
                  className="h-2 bg-gray-100" 
                  style={{
                    background: "linear-gradient(to right, rgba(240, 240, 240, 0.5), rgba(220, 220, 220, 0.8))"
                  }}
                />
                {dept.percentage >= 80 ? (
                  <div 
                    className="absolute inset-0 overflow-hidden rounded-full" 
                    style={{ 
                      background: "linear-gradient(to right, rgba(220, 38, 38, 0.2), rgba(220, 38, 38, 0.5))",
                      width: `${dept.percentage}%`,
                      height: "8px"
                    }}
                  />
                ) : dept.percentage >= 60 ? (
                  <div 
                    className="absolute inset-0 overflow-hidden rounded-full" 
                    style={{ 
                      background: "linear-gradient(to right, rgba(245, 158, 11, 0.2), rgba(245, 158, 11, 0.5))",
                      width: `${dept.percentage}%`,
                      height: "8px"
                    }}
                  />
                ) : (
                  <div 
                    className="absolute inset-0 overflow-hidden rounded-full" 
                    style={{ 
                      background: "linear-gradient(to right, rgba(5, 150, 105, 0.2), rgba(5, 150, 105, 0.5))",
                      width: `${dept.percentage}%`,
                      height: "8px"
                    }}
                  />
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {dept.percentage}% of budget utilized
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
