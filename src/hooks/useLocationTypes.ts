import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface LocationType {
  id: string;
  code: string;
  name: string;
  description: string | null;
  icon: string | null;
  isActive: boolean;
  displayOrder: number;
}

// Fallback data for offline scenarios
const FALLBACK_LOCATION_TYPES: LocationType[] = [
  {
    id: 'fallback-1',
    code: 'HEAD_OFFICE',
    name: 'Head Office',
    description: 'Main headquarters location',
    icon: 'building-2',
    isActive: true,
    displayOrder: 1,
  },
  {
    id: 'fallback-2',
    code: 'REGIONAL_OFFICE',
    name: 'Regional Office',
    description: 'Regional office location',
    icon: 'building',
    isActive: true,
    displayOrder: 2,
  },
  {
    id: 'fallback-3',
    code: 'BRANCH',
    name: 'Branch',
    description: 'Branch office location',
    icon: 'map-pin',
    isActive: true,
    displayOrder: 3,
  },
  {
    id: 'fallback-4',
    code: 'WAREHOUSE',
    name: 'Warehouse',
    description: 'Storage and distribution facility',
    icon: 'warehouse',
    isActive: true,
    displayOrder: 4,
  },
  {
    id: 'fallback-5',
    code: 'STORE',
    name: 'Store',
    description: 'Retail store location',
    icon: 'store',
    isActive: true,
    displayOrder: 5,
  },
];

export function useLocationTypes() {
  const [types, setTypes] = useState<LocationType[]>(FALLBACK_LOCATION_TYPES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchLocationTypes();
  }, []);

  const fetchLocationTypes = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('location_types')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (fetchError) {
        throw fetchError;
      }

      if (data && data.length > 0) {
        // Transform snake_case to camelCase
        const transformedData: LocationType[] = data.map((item) => ({
          id: item.id,
          code: item.code,
          name: item.name,
          description: item.description,
          icon: item.icon,
          isActive: item.is_active,
          displayOrder: item.display_order,
        }));

        setTypes(transformedData);
      } else {
        // Use fallback if no data
        setTypes(FALLBACK_LOCATION_TYPES);
      }
    } catch (err) {
      console.error('Error fetching location types:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch location types'));
      // Keep fallback data on error
      setTypes(FALLBACK_LOCATION_TYPES);
    } finally {
      setLoading(false);
    }
  };

  return {
    types,
    loading,
    error,
    refetch: fetchLocationTypes,
  };
}
