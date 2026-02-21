import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ActivityLog, ActivityFilters } from '@/types/activity';

export function useActivityFeed(filters?: ActivityFilters) {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchActivities = async () => {
      try {
        setLoading(true);
        setError(null);

        let query = supabase
          .from('activity_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(filters?.limit || 50);

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

        const { data: activityData, error: fetchError } = await query;

        if (fetchError) {
          throw fetchError;
        }

        if (!isMounted) return;

        // Fetch user profiles separately
        if (activityData && activityData.length > 0) {
          const userIds = [...new Set(activityData.map(a => a.user_id).filter(Boolean))];
          
          const { data: profiles, error: profileError } = await supabase
            .from('profiles')
            .select('id, first_name, last_name, email')
            .in('id', userIds);

          if (!isMounted) return;

          if (!profileError && profiles) {
            const profileMap = new Map(profiles.map(p => [p.id, p]));
            
            const enrichedActivities = activityData.map(activity => ({
              ...activity,
              user: activity.user_id ? profileMap.get(activity.user_id) : undefined
            }));

            setActivities(enrichedActivities);
          } else {
            setActivities(activityData);
          }
        } else {
          setActivities([]);
        }
      } catch (err) {
        console.error('Error fetching activity feed:', err);
        if (isMounted) {
          setError(err as Error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchActivities();

    return () => {
      isMounted = false;
    };
  }, [filters?.module, filters?.action, filters?.userId, filters?.startDate, filters?.endDate, filters?.limit]);

  const refetch = () => {
    // Trigger re-fetch by updating a dependency
    setLoading(true);
  };

  return {
    activities,
    loading,
    error,
    refetch
  };
}
