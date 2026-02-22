import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ITAssetCategory {
  id: string;
  code: string;
  name: string;
  description: string | null;
  icon: string | null;
  requiresSpecs: boolean;
  isActive: boolean;
  displayOrder: number;
}

// Fallback data for offline scenarios
const FALLBACK_IT_ASSET_CATEGORIES: ITAssetCategory[] = [
  {
    id: 'fallback-1',
    code: 'LAPTOP',
    name: 'Laptop',
    description: 'Portable computers including notebooks and ultrabooks',
    icon: 'laptop',
    requiresSpecs: true,
    isActive: true,
    displayOrder: 1,
  },
  {
    id: 'fallback-2',
    code: 'DESKTOP',
    name: 'Desktop',
    description: 'Desktop computers and workstations',
    icon: 'monitor',
    requiresSpecs: true,
    isActive: true,
    displayOrder: 2,
  },
  {
    id: 'fallback-3',
    code: 'SMARTPHONE',
    name: 'Smartphone',
    description: 'Mobile phones and smartphones',
    icon: 'smartphone',
    requiresSpecs: true,
    isActive: true,
    displayOrder: 3,
  },
  {
    id: 'fallback-4',
    code: 'TABLET',
    name: 'Tablet',
    description: 'Tablet devices and iPads',
    icon: 'tablet',
    requiresSpecs: true,
    isActive: true,
    displayOrder: 4,
  },
  {
    id: 'fallback-5',
    code: 'MONITOR',
    name: 'Monitor',
    description: 'Display monitors and screens',
    icon: 'screen',
    requiresSpecs: false,
    isActive: true,
    displayOrder: 5,
  },
  {
    id: 'fallback-6',
    code: 'PRINTER',
    name: 'Printer',
    description: 'Printers, scanners, and multifunction devices',
    icon: 'printer',
    requiresSpecs: false,
    isActive: true,
    displayOrder: 6,
  },
  {
    id: 'fallback-7',
    code: 'OTHER',
    name: 'Other',
    description: 'Other IT equipment not listed above',
    icon: 'box',
    requiresSpecs: false,
    isActive: true,
    displayOrder: 7,
  },
];

export function useITAssetCategories() {
  const [categories, setCategories] = useState<ITAssetCategory[]>(FALLBACK_IT_ASSET_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchITAssetCategories();
  }, []);

  const fetchITAssetCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('it_asset_categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (fetchError) {
        throw fetchError;
      }

      if (data && data.length > 0) {
        // Transform snake_case to camelCase
        const transformedData: ITAssetCategory[] = data.map((item) => ({
          id: item.id,
          code: item.code,
          name: item.name,
          description: item.description,
          icon: item.icon,
          requiresSpecs: item.requires_specs,
          isActive: item.is_active,
          displayOrder: item.display_order,
        }));

        setCategories(transformedData);
      } else {
        // Use fallback if no data
        setCategories(FALLBACK_IT_ASSET_CATEGORIES);
      }
    } catch (err) {
      console.error('Error fetching IT asset categories:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch IT asset categories'));
      // Keep fallback data on error
      setCategories(FALLBACK_IT_ASSET_CATEGORIES);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get category by code
  const getCategoryByCode = (code: string): ITAssetCategory | undefined => {
    return categories.find(category => category.code === code);
  };

  // Helper function to get category by name
  const getCategoryByName = (name: string): ITAssetCategory | undefined => {
    return categories.find(category => category.name === name);
  };

  // Helper function to check if category requires specs
  const categoryRequiresSpecs = (categoryCode: string): boolean => {
    const category = getCategoryByCode(categoryCode);
    return category?.requiresSpecs ?? true; // Default to true for safety
  };

  return {
    categories,
    loading,
    error,
    refetch: fetchITAssetCategories,
    getCategoryByCode,
    getCategoryByName,
    categoryRequiresSpecs,
  };
}
