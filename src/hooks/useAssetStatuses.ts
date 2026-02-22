import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AssetStatus {
  id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  is_active: boolean;
  is_available: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export function useAssetStatuses() {
  const [statuses, setStatuses] = useState<AssetStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchStatuses();
  }, []);

  const fetchStatuses = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('asset_statuses')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (fetchError) throw fetchError;

      setStatuses(data || []);
    } catch (err) {
      console.error('Error fetching asset statuses:', err);
      setError(err as Error);
      // Fallback to hardcoded statuses if database fetch fails
      setStatuses([
        { id: '1', name: 'In Service', description: 'Asset is currently in active use', color: 'green', icon: 'CheckCircle', is_active: true, is_available: true, display_order: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: '2', name: 'Under Repair', description: 'Asset is being repaired', color: 'yellow', icon: 'Wrench', is_active: true, is_available: false, display_order: 2, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: '3', name: 'Retired', description: 'Asset has been retired', color: 'gray', icon: 'Archive', is_active: true, is_available: false, display_order: 3, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: '4', name: 'Stored', description: 'Asset is in storage', color: 'blue', icon: 'Package', is_active: true, is_available: false, display_order: 4, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: '5', name: 'With Worker', description: 'Asset is assigned to a worker', color: 'green', icon: 'User', is_active: true, is_available: true, display_order: 5, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: '6', name: 'In Transit', description: 'Asset is being moved', color: 'orange', icon: 'Truck', is_active: true, is_available: false, display_order: 6, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return {
    statuses,
    loading,
    error,
    refetch: fetchStatuses
  };
}
