import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface UnitOfMeasure {
  id: string;
  code: string;
  name: string;
  abbreviation: string | null;
  category: string | null;
  isDefault: boolean;
  isActive: boolean;
  displayOrder: number;
}

const FALLBACK_UNITS: UnitOfMeasure[] = [
  // Quantity/Count Units
  { id: 'fallback-1', code: 'UNITS', name: 'Units', abbreviation: 'units', category: 'quantity', isDefault: true, isActive: true, displayOrder: 1 },
  { id: 'fallback-2', code: 'PIECES', name: 'Pieces', abbreviation: 'pcs', category: 'quantity', isDefault: false, isActive: true, displayOrder: 2 },
  { id: 'fallback-3', code: 'EACH', name: 'Each', abbreviation: 'ea', category: 'quantity', isDefault: false, isActive: true, displayOrder: 3 },
  { id: 'fallback-4', code: 'DOZEN', name: 'Dozen', abbreviation: 'doz', category: 'quantity', isDefault: false, isActive: true, displayOrder: 4 },
  { id: 'fallback-5', code: 'PAIR', name: 'Pair', abbreviation: 'pr', category: 'quantity', isDefault: false, isActive: true, displayOrder: 5 },
  { id: 'fallback-6', code: 'SET', name: 'Set', abbreviation: 'set', category: 'quantity', isDefault: false, isActive: true, displayOrder: 6 },
  { id: 'fallback-7', code: 'BOX', name: 'Box', abbreviation: 'box', category: 'quantity', isDefault: false, isActive: true, displayOrder: 7 },
  { id: 'fallback-8', code: 'PACK', name: 'Pack', abbreviation: 'pk', category: 'quantity', isDefault: false, isActive: true, displayOrder: 8 },
  
  // Weight Units
  { id: 'fallback-9', code: 'KILOGRAM', name: 'Kilogram', abbreviation: 'kg', category: 'weight', isDefault: false, isActive: true, displayOrder: 11 },
  { id: 'fallback-10', code: 'GRAM', name: 'Gram', abbreviation: 'g', category: 'weight', isDefault: false, isActive: true, displayOrder: 12 },
  { id: 'fallback-11', code: 'POUND', name: 'Pound', abbreviation: 'lb', category: 'weight', isDefault: false, isActive: true, displayOrder: 13 },
  
  // Volume Units
  { id: 'fallback-12', code: 'LITER', name: 'Liter', abbreviation: 'L', category: 'volume', isDefault: false, isActive: true, displayOrder: 16 },
  { id: 'fallback-13', code: 'GALLON', name: 'Gallon', abbreviation: 'gal', category: 'volume', isDefault: false, isActive: true, displayOrder: 18 },
  
  // Length Units
  { id: 'fallback-14', code: 'METER', name: 'Meter', abbreviation: 'm', category: 'length', isDefault: false, isActive: true, displayOrder: 20 },
  { id: 'fallback-15', code: 'FOOT', name: 'Foot', abbreviation: 'ft', category: 'length', isDefault: false, isActive: true, displayOrder: 22 },
];

export function useUnitsOfMeasure() {
  const [units, setUnits] = useState<UnitOfMeasure[]>(FALLBACK_UNITS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchUnits();
  }, []);

  const fetchUnits = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('units_of_measure')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (fetchError) throw fetchError;

      if (data && data.length > 0) {
        const transformedData: UnitOfMeasure[] = data.map((item) => ({
          id: item.id,
          code: item.code,
          name: item.name,
          abbreviation: item.abbreviation,
          category: item.category,
          isDefault: item.is_default,
          isActive: item.is_active,
          displayOrder: item.display_order,
        }));
        setUnits(transformedData);
      } else {
        setUnits(FALLBACK_UNITS);
      }
    } catch (err) {
      console.error('Error fetching units of measure:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch units of measure'));
      setUnits(FALLBACK_UNITS);
    } finally {
      setLoading(false);
    }
  };

  const getUnitByCode = (code: string): UnitOfMeasure | undefined => {
    return units.find(unit => unit.code === code);
  };

  const getUnitByName = (name: string): UnitOfMeasure | undefined => {
    return units.find(unit => unit.name === name);
  };

  const getDefaultUnit = (): UnitOfMeasure | undefined => {
    return units.find(unit => unit.isDefault);
  };

  const getUnitsByCategory = (category: string): UnitOfMeasure[] => {
    return units.filter(unit => unit.category === category);
  };

  return {
    units,
    loading,
    error,
    refetch: fetchUnits,
    getUnitByCode,
    getUnitByName,
    getDefaultUnit,
    getUnitsByCategory,
  };
}
