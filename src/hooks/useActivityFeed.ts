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

        console.log('=== ACTIVITY FEED DEBUG START ===');
        console.log('Filters:', filters);

        // Check current user
        const { data: { user } } = await supabase.auth.getUser();
        console.log('Current user:', user?.id, user?.email);

        let query = supabase
          .from('activity_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(filters?.limit || 50);

        // Apply filters
        if (filters?.module) {
          console.log('Applying module filter:', filters.module);
          query = query.eq('module', filters.module);
        }

        if (filters?.action) {
          console.log('Applying action filter:', filters.action);
          query = query.eq('action', filters.action);
        }

        if (filters?.userId) {
          console.log('Applying userId filter:', filters.userId);
          query = query.eq('user_id', filters.userId);
        }

        if (filters?.startDate) {
          query = query.gte('created_at', filters.startDate);
        }

        if (filters?.endDate) {
          query = query.lte('created_at', filters.endDate);
        }

        console.log('Executing activity logs query...');
        const { data: activityData, error: fetchError } = await query;

        console.log('Activity logs response:');
        console.log('  - Data count:', activityData?.length || 0);
        console.log('  - Data:', activityData);
        console.log('  - Error:', fetchError);

        if (fetchError) {
          console.error('Activity logs fetch error:', fetchError);
          throw fetchError;
        }

        if (!isMounted) return;

        // Fetch user profiles separately
        if (activityData && activityData.length > 0) {
          const userIds = [...new Set(activityData.map(a => a.user_id).filter(Boolean))];
          console.log('Fetching profiles for user IDs:', userIds);
          
          const { data: profiles, error: profileError } = await supabase
            .from('profiles')
            .select('id, first_name, last_name, email')
            .in('id', userIds);

          console.log('Profiles response:');
          console.log('  - Data count:', profiles?.length || 0);
          console.log('  - Data:', profiles);
          console.log('  - Error:', profileError);

          if (!isMounted) return;

          if (!profileError && profiles) {
            const profileMap = new Map(profiles.map(p => [p.id, p]));
            console.log('Profile map created with', profileMap.size, 'entries');
            
            const enrichedActivities = activityData.map(activity => ({
              ...activity,
              user: activity.user_id ? profileMap.get(activity.user_id) : undefined
            }));

            console.log('Enriched activities:', enrichedActivities);
            console.log('Setting activities state with', enrichedActivities.length, 'items');
            setActivities(enrichedActivities);
          } else {
            console.log('Using activities without profile enrichment');
            setActivities(activityData);
          }
        } else {
          console.log('No activity data found, setting empty array');
          setActivities([]);
        }
        
        console.log('=== ACTIVITY FEED DEBUG END ===');
      } catch (err) {
        console.error('=== ACTIVITY FEED ERROR ===');
        console.error('Error details:', err);
        console.error('Error message:', (err as Error).message);
        console.error('Error stack:', (err as Error).stack);
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
