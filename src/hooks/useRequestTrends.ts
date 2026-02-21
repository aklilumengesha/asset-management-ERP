import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface RequestTrendData {
  date: string;
  requests: number;
  previous: number;
}

export function useRequestTrends(days: number = 7) {
  const [data, setData] = useState<RequestTrendData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchRequestTrends();
  }, [days]);

  const fetchRequestTrends = async () => {
    try {
      setLoading(true);
      setError(null);

      // TODO: Replace with actual request trends query when available
      // For now, return empty array as placeholder
      // const endDate = new Date();
      // const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000);
      // const previousStartDate = new Date(startDate.getTime() - days * 24 * 60 * 60 * 1000);

      // // Fetch current period requests
      // const { data: currentData, error: currentError } = await supabase
      //   .from('requests')
      //   .select('created_at')
      //   .gte('created_at', startDate.toISOString())
      //   .lte('created_at', endDate.toISOString());

      // if (currentError) throw currentError;

      // // Fetch previous period requests
      // const { data: previousData, error: previousError } = await supabase
      //   .from('requests')
      //   .select('created_at')
      //   .gte('created_at', previousStartDate.toISOString())
      //   .lt('created_at', startDate.toISOString());

      // if (previousError) throw previousError;

      // // Group by date and format
      // const trendData: RequestTrendData[] = [];
      // for (let i = 0; i < days; i++) {
      //   const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
      //   const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      //   
      //   const currentCount = currentData?.filter(r => 
      //     new Date(r.created_at).toDateString() === date.toDateString()
      //   ).length || 0;
      //   
      //   const previousDate = new Date(date.getTime() - days * 24 * 60 * 60 * 1000);
      //   const previousCount = previousData?.filter(r => 
      //     new Date(r.created_at).toDateString() === previousDate.toDateString()
      //   ).length || 0;
      //   
      //   trendData.push({
      //     date: dateStr,
      //     requests: currentCount,
      //     previous: previousCount
      //   });
      // }

      setData([]);
    } catch (err) {
      console.error('Error fetching request trends:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    refetch: fetchRequestTrends
  };
}
