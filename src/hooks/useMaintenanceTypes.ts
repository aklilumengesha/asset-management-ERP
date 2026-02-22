import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface MaintenanceType {
  id: string;
  code: string;
  name: string;
  description: string | null;
  requiresVendor: boolean;
  isActive: boolean;
  displayOrder: number;
}

// Fallback data for offline scenarios
const FALLBACK_MAINTENANCE_TYPES: MaintenanceType[] = [
  {
    id: 'fallback-1',
    code: 'INTERNAL',
    name: 'Internal Maintenance',
    description: 'Maintenance performed by internal staff',
    requiresVendor: false,
    isActive: true,
    displayOrder: 1,
  },
  {
    id: 'fallback-2',
    code: 'EXTERNAL',
    name: 'External Maintenance (Vendor)',
    description: 'Maintenance performed by external vendors',
    requiresVendor: true,
    isActive: true,
    displayOrder: 2,
  },
];

export function useMaintenanceTypes() {
  const [types, setTypes] = useState<MaintenanceType[]>(FALLBACK_MAINTENANCE_TYPES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchMaintenanceTypes();
  }, []);

  const fetchMaintenanceTypes = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('maintenance_types')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (fetchError) {
        throw fetchError;
      }

      if (data && data.length > 0) {
        // Transform snake_case to camelCase
        const transformedData: MaintenanceType[] = data.map((item) => ({
          id: item.id,
          code: item.code,
          name: item.name,
          description: item.description,
          requiresVendor: item.requires_vendor,
          isActive: item.is_active,
          displayOrder: item.display_order,
        }));

        setTypes(transformedData);
      } else {
        // Use fallback if no data
        setTypes(FALLBACK_MAINTENANCE_TYPES);
      }
    } catch (err) {
      console.error('Error fetching maintenance types:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch maintenance types'));
      // Keep fallback data on error
      setTypes(FALLBACK_MAINTENANCE_TYPES);
    } finally {
      setLoading(false);
    }
  };

  return {
    types,
    loading,
    error,
    refetch: fetchMaintenanceTypes,
  };
}
