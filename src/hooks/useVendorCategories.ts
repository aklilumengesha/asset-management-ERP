import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface VendorCategory {
  id: string;
  code: string;
  name: string;
  description: string | null;
  isActive: boolean;
  displayOrder: number;
}

// Fallback data for offline scenarios
const FALLBACK_VENDOR_CATEGORIES: VendorCategory[] = [
  {
    id: 'fallback-1',
    code: 'HVAC',
    name: 'HVAC',
    description: 'Heating, Ventilation, and Air Conditioning services',
    isActive: true,
    displayOrder: 1,
  },
  {
    id: 'fallback-2',
    code: 'ELECTRONICS',
    name: 'Electronics',
    description: 'Electronic equipment and repairs',
    isActive: true,
    displayOrder: 2,
  },
  {
    id: 'fallback-3',
    code: 'PRINTERS',
    name: 'Printers',
    description: 'Printer maintenance and supplies',
    isActive: true,
    displayOrder: 3,
  },
  {
    id: 'fallback-4',
    code: 'IT_EQUIPMENT',
    name: 'IT Equipment',
    description: 'Computer and IT hardware services',
    isActive: true,
    displayOrder: 4,
  },
  {
    id: 'fallback-5',
    code: 'ELECTRICAL',
    name: 'Electrical',
    description: 'Electrical systems and repairs',
    isActive: true,
    displayOrder: 5,
  },
  {
    id: 'fallback-6',
    code: 'PLUMBING',
    name: 'Plumbing',
    description: 'Plumbing services and repairs',
    isActive: true,
    displayOrder: 6,
  },
  {
    id: 'fallback-7',
    code: 'GENERAL_MAINTENANCE',
    name: 'General Maintenance',
    description: 'General facility maintenance',
    isActive: true,
    displayOrder: 7,
  },
];

export function useVendorCategories() {
  const [categories, setCategories] = useState<VendorCategory[]>(FALLBACK_VENDOR_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchVendorCategories();
  }, []);

  const fetchVendorCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('vendor_categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (fetchError) {
        throw fetchError;
      }

      if (data && data.length > 0) {
        // Transform snake_case to camelCase
        const transformedData: VendorCategory[] = data.map((item) => ({
          id: item.id,
          code: item.code,
          name: item.name,
          description: item.description,
          isActive: item.is_active,
          displayOrder: item.display_order,
        }));

        setCategories(transformedData);
      } else {
        // Use fallback if no data
        setCategories(FALLBACK_VENDOR_CATEGORIES);
      }
    } catch (err) {
      console.error('Error fetching vendor categories:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch vendor categories'));
      // Keep fallback data on error
      setCategories(FALLBACK_VENDOR_CATEGORIES);
    } finally {
      setLoading(false);
    }
  };

  return {
    categories,
    loading,
    error,
    refetch: fetchVendorCategories,
  };
}
