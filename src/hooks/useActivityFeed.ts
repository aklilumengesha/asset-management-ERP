import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ActivityLog, ActivityFilters } from '@/types/activity';

export function useActivityFeed(filters?: ActivityFilters) {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchActivities();
  }, [filters]);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('activity_logs')
        .select(`
          *,
          user:profiles(first_name, last_name, email)
        `)
        .order('created_at', { ascending: false })
        .limit(filters?.limit || 10);

      // Apply filters
      if (filters?.module) {
        query = query.eq('module', filters.module);
      }

      if (filters?.action) {
        query = query.eq('action', filters.action);
      }

      if (filters?.userId) {
        query = query.eq('user_id', filters.userId);
      }

      if (filters?.startDate) {
        query = query.gte('created_at', filters.startDate);
      }

      if (filters?.endDate) {
        query = query.lte('created_at', filters.endDate);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setActivities(data || []);
    } catch (err) {
      console.error('Error fetching activities:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return {
    activities,
    loading,
    error,
    refetch: fetchActivities
  };
}
