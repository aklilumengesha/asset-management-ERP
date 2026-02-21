import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface MaintenanceAlert {
  id: string;
  asset: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
}

export function useMaintenanceAlerts(limit: number = 5) {
  const [alerts, setAlerts] = useState<MaintenanceAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchAlerts();
  }, [limit]);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      setError(null);

      // TODO: Replace with actual maintenance table query when available
      // For now, return empty array as placeholder
      // const { data, error: fetchError } = await supabase
      //   .from('maintenance_schedules')
      //   .select('id, asset_id, due_date, priority, assets(name)')
      //   .lte('due_date', new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString())
      //   .order('due_date', { ascending: true })
      //   .limit(limit);

      // if (fetchError) throw fetchError;

      // const formattedAlerts: MaintenanceAlert[] = data?.map(item => ({
      //   id: item.id,
      //   asset: item.assets?.name || 'Unknown Asset',
      //   dueDate: new Date(item.due_date).toLocaleDateString(),
      //   priority: item.priority as 'high' | 'medium' | 'low'
      // })) || [];

      setAlerts([]);
    } catch (err) {
      console.error('Error fetching maintenance alerts:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return {
    alerts,
    loading,
    error,
    refetch: fetchAlerts
  };
}
