import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { 
  IFRSClassification as ComponentIFRSClassification,
  IFRSCategory as ComponentIFRSCategory,
  TaxCategory as ComponentTaxCategory
} from '@/components/finance/depreciation/types';

// Database types (snake_case from Supabase)
interface DBIFRSClassification {
  id: string;
  class_code: string;
  name: string;
  description?: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

interface DBIFRSCategory {
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

interface DBTaxCategory {
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
  const [ifrsClassifications, setIFRSClassifications] = useState<ComponentIFRSClassification[]>([]);
  const [ifrsCategories, setIFRSCategories] = useState<ComponentIFRSCategory[]>([]);
  const [taxCategories, setTaxCategories] = useState<ComponentTaxCategory[]>([]);
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

      // Transform database types to component types (snake_case to camelCase)
      const transformedClassifications: ComponentIFRSClassification[] = (classificationsResult.data || []).map((item: DBIFRSClassification) => ({
        class: item.class_code,
        name: item.name,
        description: item.description || ''
      }));

      const transformedCategories: ComponentIFRSCategory[] = (categoriesResult.data || []).map((item: DBIFRSCategory) => ({
        code: item.code,
        name: item.name,
        class: item.class_code,
        description: item.description || ''
      }));

      const transformedTaxCategories: ComponentTaxCategory[] = (taxResult.data || []).map((item: DBTaxCategory) => ({
        code: item.code,
        name: item.name,
        description: item.description || '',
        depreciationRate: item.depreciation_rate,
        isCustom: item.is_custom
      }));

      setIFRSClassifications(transformedClassifications);
      setIFRSCategories(transformedCategories);
      setTaxCategories(transformedTaxCategories);
    } catch (err) {
      console.error('Error fetching depreciation categories:', err);
      setError(err as Error);
      
      // Fallback to hardcoded data if database fetch fails (transformed to component types)
      setIFRSClassifications([
        { class: 'PPE', name: 'Property, Plant & Equipment', description: 'Tangible assets used in operations' },
        { class: 'INT', name: 'Intangible Assets', description: 'Non-physical assets like software and licenses' },
        { class: 'INV', name: 'Investment Property', description: 'Property held for rental income or capital appreciation' },
      ]);
      
      setIFRSCategories([
        { code: 'COMP_HARD', name: 'Computer Hardware', class: 'PPE', description: 'Computing equipment and accessories' },
        { code: 'COMP_SOFT', name: 'Computer Software', class: 'INT', description: 'Software licenses and applications' },
        { code: 'OFF_EQUIP', name: 'Office Equipment', class: 'PPE', description: 'General office equipment' },
        { code: 'BLDG', name: 'Buildings', class: 'PPE', description: 'Commercial buildings and structures' },
      ]);
      
      setTaxCategories([
        { code: 'COMP_EQUIP', name: 'Computer Equipment', description: 'Computers and related equipment', depreciationRate: 0.25, isCustom: false },
        { code: 'OFF_EQUIP', name: 'Office Equipment', description: 'General office equipment', depreciationRate: 0.20, isCustom: false },
        { code: 'BLDG', name: 'Buildings', description: 'Commercial buildings', depreciationRate: 0.05, isCustom: false },
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
