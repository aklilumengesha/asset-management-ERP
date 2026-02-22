import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface DepreciationMethod {
  id: string;
  code: string;
  name: string;
  description: string | null;
  formulaType: string | null;
  calculationParams: Record<string, any> | null;
  applicableTo: string;
  isActive: boolean;
  displayOrder: number;
}

const FALLBACK_METHODS: DepreciationMethod[] = [
  { id: 'fallback-1', code: 'STRAIGHT_LINE', name: 'Straight Line', description: 'Depreciates evenly over useful life', formulaType: 'linear', calculationParams: null, applicableTo: 'both', isActive: true, displayOrder: 1 },
  { id: 'fallback-2', code: 'DECLINING_BALANCE', name: 'Declining Balance', description: 'Accelerated depreciation method', formulaType: 'accelerated', calculationParams: { rate_multiplier: 1.5 }, applicableTo: 'both', isActive: true, displayOrder: 2 },
  { id: 'fallback-3', code: 'SUM_OF_YEARS', name: 'Sum of Years Digits', description: 'Accelerated method based on remaining life', formulaType: 'accelerated', calculationParams: null, applicableTo: 'tax', isActive: true, displayOrder: 4 },
  { id: 'fallback-4', code: 'UNITS_OF_PRODUCTION', name: 'Units of Production', description: 'Based on actual usage', formulaType: 'production_based', calculationParams: null, applicableTo: 'both', isActive: true, displayOrder: 8 },
];

export function useDepreciationMethods() {
  const [methods, setMethods] = useState<DepreciationMethod[]>(FALLBACK_METHODS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchMethods();
  }, []);

  const fetchMethods = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('depreciation_methods')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (fetchError) throw fetchError;

      if (data && data.length > 0) {
        const transformedData: DepreciationMethod[] = data.map((item) => ({
          id: item.id,
          code: item.code,
          name: item.name,
          description: item.description,
          formulaType: item.formula_type,
          calculationParams: item.calculation_params,
          applicableTo: item.applicable_to,
          isActive: item.is_active,
          displayOrder: item.display_order,
        }));
        setMethods(transformedData);
      } else {
        setMethods(FALLBACK_METHODS);
      }
    } catch (err) {
      console.error('Error fetching depreciation methods:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch depreciation methods'));
      setMethods(FALLBACK_METHODS);
    } finally {
      setLoading(false);
    }
  };

  const getMethodByCode = (code: string): DepreciationMethod | undefined => {
    return methods.find(method => method.code === code);
  };

  const getMethodByName = (name: string): DepreciationMethod | undefined => {
    return methods.find(method => method.name === name);
  };

  const getMethodsByApplicability = (applicableTo: 'ifrs' | 'tax' | 'both'): DepreciationMethod[] => {
    return methods.filter(method => 
      method.applicableTo === applicableTo || method.applicableTo === 'both'
    );
  };

  const getIFRSMethods = (): DepreciationMethod[] => {
    return methods.filter(method => 
      method.applicableTo === 'ifrs' || method.applicableTo === 'both'
    );
  };

  const getTaxMethods = (): DepreciationMethod[] => {
    return methods.filter(method => 
      method.applicableTo === 'tax' || method.applicableTo === 'both'
    );
  };

  // Convert to Option format for Select components
  const getMethodsAsOptions = (filterBy?: 'ifrs' | 'tax' | 'both') => {
    let filteredMethods = methods;
    
    if (filterBy === 'ifrs') {
      filteredMethods = getIFRSMethods();
    } else if (filterBy === 'tax') {
      filteredMethods = getTaxMethods();
    }

    return filteredMethods.map(method => ({
      value: method.code.toLowerCase().replace(/_/g, '-'),
      label: method.name
    }));
  };

  return {
    methods,
    loading,
    error,
    refetch: fetchMethods,
    getMethodByCode,
    getMethodByName,
    getMethodsByApplicability,
    getIFRSMethods,
    getTaxMethods,
    getMethodsAsOptions,
  };
}
