import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AssetCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export function useAssetCategories() {
  const [categories, setCategories] = useState<AssetCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('asset_categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (fetchError) throw fetchError;

      setCategories(data || []);
    } catch (err) {
      console.error('Error fetching asset categories:', err);
      setError(err as Error);
      // Fallback to hardcoded categories if database fetch fails
      setCategories([
        { id: '1', name: 'IT Equipment', description: 'Computers and IT hardware', icon: 'Laptop', is_active: true, display_order: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: '2', name: 'Furniture', description: 'Office furniture', icon: 'Armchair', is_active: true, display_order: 2, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: '3', name: 'Vehicle', description: 'Company vehicles', icon: 'Car', is_active: true, display_order: 3, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: '4', name: 'Office Equipment', description: 'Office devices', icon: 'Printer', is_active: true, display_order: 4, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: '5', name: 'Machinery', description: 'Industrial machinery', icon: 'Settings', is_active: true, display_order: 5, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: '6', name: 'Building', description: 'Buildings and structures', icon: 'Building', is_active: true, display_order: 6, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: '7', name: 'Land', description: 'Land and real estate', icon: 'MapPin', is_active: true, display_order: 7, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories
  };
}
