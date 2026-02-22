import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface DeliveryTerm {
  id: string;
  code: string;
  name: string;
  description: string | null;
  isDefault: boolean;
  isActive: boolean;
  displayOrder: number;
}

const FALLBACK_DELIVERY_TERMS: DeliveryTerm[] = [
  { id: 'fallback-1', code: 'STANDARD', name: 'Standard Shipping', description: 'Standard delivery service', isDefault: true, isActive: true, displayOrder: 1 },
  { id: 'fallback-2', code: 'EXPRESS', name: 'Express Shipping', description: 'Fast delivery within 1-2 business days', isDefault: false, isActive: true, displayOrder: 2 },
  { id: 'fallback-3', code: 'OVERNIGHT', name: 'Overnight Shipping', description: 'Next business day delivery', isDefault: false, isActive: true, displayOrder: 3 },
  { id: 'fallback-4', code: 'TWO_DAY', name: 'Two-Day Shipping', description: 'Delivery within 2 business days', isDefault: false, isActive: true, displayOrder: 4 },
  { id: 'fallback-5', code: 'GROUND', name: 'Ground Shipping', description: 'Economy ground transportation', isDefault: false, isActive: true, displayOrder: 5 },
  { id: 'fallback-6', code: 'FREIGHT', name: 'Freight Shipping', description: 'Large item freight delivery', isDefault: false, isActive: true, displayOrder: 6 },
  { id: 'fallback-7', code: 'PICKUP', name: 'Customer Pickup', description: 'Customer will pick up from location', isDefault: false, isActive: true, displayOrder: 7 },
  { id: 'fallback-8', code: 'FOB_ORIGIN', name: 'FOB Origin', description: 'Free on Board - buyer pays shipping from origin', isDefault: false, isActive: true, displayOrder: 8 },
  { id: 'fallback-9', code: 'FOB_DESTINATION', name: 'FOB Destination', description: 'Free on Board - seller pays shipping to destination', isDefault: false, isActive: true, displayOrder: 9 },
  { id: 'fallback-10', code: 'CIF', name: 'CIF (Cost, Insurance, Freight)', description: 'Seller pays cost, insurance, and freight', isDefault: false, isActive: true, displayOrder: 10 },
];

export function useDeliveryTerms() {
  const [terms, setTerms] = useState<DeliveryTerm[]>(FALLBACK_DELIVERY_TERMS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchDeliveryTerms();
  }, []);

  const fetchDeliveryTerms = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('delivery_terms')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (fetchError) throw fetchError;

      if (data && data.length > 0) {
        const transformedData: DeliveryTerm[] = data.map((item) => ({
          id: item.id,
          code: item.code,
          name: item.name,
          description: item.description,
          isDefault: item.is_default,
          isActive: item.is_active,
          displayOrder: item.display_order,
        }));
        setTerms(transformedData);
      } else {
        setTerms(FALLBACK_DELIVERY_TERMS);
      }
    } catch (err) {
      console.error('Error fetching delivery terms:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch delivery terms'));
      setTerms(FALLBACK_DELIVERY_TERMS);
    } finally {
      setLoading(false);
    }
  };

  const getTermByCode = (code: string): DeliveryTerm | undefined => {
    return terms.find(term => term.code === code);
  };

  const getTermByName = (name: string): DeliveryTerm | undefined => {
    return terms.find(term => term.name === name);
  };

  const getDefaultTerm = (): DeliveryTerm | undefined => {
    return terms.find(term => term.isDefault);
  };

  return {
    terms,
    loading,
    error,
    refetch: fetchDeliveryTerms,
    getTermByCode,
    getTermByName,
    getDefaultTerm,
  };
}
