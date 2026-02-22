import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface IFRSClassification {
  id: string;
  class_code: string;
  name: string;
  description?: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface IFRSCategory {
  id: string;
  code: string;
  name: string;
  class_code: string;
  description?: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface TaxCategory {
  id: string;
  code: string;
  name: string;
  description?: string;
  depreciation_rate: number;
  is_custom: boolean;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export function useDepreciationCategories() {
  const [ifrsClassifications, setIFRSClassifications] = useState<IFRSClassification[]>([]);
  const [ifrsCategories, setIFRSCategories] = useState<IFRSCategory[]>([]);
  const [taxCategories, setTaxCategories] = useState<TaxCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchAllCategories();
  }, []);

  const fetchAllCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all three types in parallel
      const [classificationsResult, categoriesResult, taxResult] = await Promise.all([
        supabase
          .from('ifrs_classifications')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true }),
        supabase
          .from('ifrs_categories')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true }),
        supabase
          .from('tax_categories')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true })
      ]);

      if (classificationsResult.error) throw classificationsResult.error;
      if (categoriesResult.error) throw categoriesResult.error;
      if (taxResult.error) throw taxResult.error;

      setIFRSClassifications(classificationsResult.data || []);
      setIFRSCategories(categoriesResult.data || []);
      setTaxCategories(taxResult.data || []);
    } catch (err) {
      console.error('Error fetching depreciation categories:', err);
      setError(err as Error);
      
      // Fallback to hardcoded data if database fetch fails
      setIFRSClassifications([
        { id: '1', class_code: 'PPE', name: 'Property, Plant & Equipment', description: 'Tangible assets used in operations', is_active: true, display_order: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: '2', class_code: 'INT', name: 'Intangible Assets', description: 'Non-physical assets like software and licenses', is_active: true, display_order: 2, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: '3', class_code: 'INV', name: 'Investment Property', description: 'Property held for rental income or capital appreciation', is_active: true, display_order: 3, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      ]);
      
      setIFRSCategories([
        { id: '1', code: 'COMP_HARD', name: 'Computer Hardware', class_code: 'PPE', description: 'Computing equipment and accessories', is_active: true, display_order: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: '2', code: 'COMP_SOFT', name: 'Computer Software', class_code: 'INT', description: 'Software licenses and applications', is_active: true, display_order: 2, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: '3', code: 'OFF_EQUIP', name: 'Office Equipment', class_code: 'PPE', description: 'General office equipment', is_active: true, display_order: 3, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: '4', code: 'BLDG', name: 'Buildings', class_code: 'PPE', description: 'Commercial buildings and structures', is_active: true, display_order: 4, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      ]);
      
      setTaxCategories([
        { id: '1', code: 'COMP_EQUIP', name: 'Computer Equipment', description: 'Computers and related equipment', depreciation_rate: 0.25, is_custom: false, is_active: true, display_order: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: '2', code: 'OFF_EQUIP', name: 'Office Equipment', description: 'General office equipment', depreciation_rate: 0.20, is_custom: false, is_active: true, display_order: 2, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: '3', code: 'BLDG', name: 'Buildings', description: 'Commercial buildings', depreciation_rate: 0.05, is_custom: false, is_active: true, display_order: 3, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return {
    ifrsClassifications,
    ifrsCategories,
    taxCategories,
    loading,
    error,
    refetch: fetchAllCategories
  };
}
