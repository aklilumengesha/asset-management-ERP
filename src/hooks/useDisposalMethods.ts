import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface DisposalMethod {
  id: string;
  code: string;
  name: string;
  description: string | null;
  requiresDocumentation: boolean;
  allowsSalvageValue: boolean;
  isActive: boolean;
  displayOrder: number | null;
}

// Fallback data for offline scenarios
const FALLBACK_DISPOSAL_METHODS: DisposalMethod[] = [
  {
    id: '1',
    code: 'SCRAPPED',
    name: 'Scrapped',
    description: 'Asset is scrapped and disposed of as waste',
    requiresDocumentation: true,
    allowsSalvageValue: false,
    isActive: true,
    displayOrder: 1,
  },
  {
    id: '2',
    code: 'SOLD',
    name: 'Sold',
    description: 'Asset is sold to a third party',
    requiresDocumentation: true,
    allowsSalvageValue: true,
    isActive: true,
    displayOrder: 2,
  },
  {
    id: '3',
    code: 'DONATED',
    name: 'Donated',
    description: 'Asset is donated to an organization or individual',
    requiresDocumentation: true,
    allowsSalvageValue: false,
    isActive: true,
    displayOrder: 3,
  },
  {
    id: '4',
    code: 'TRANSFERRED',
    name: 'Transferred',
    description: 'Asset is transferred to another entity or location',
    requiresDocumentation: true,
    allowsSalvageValue: false,
    isActive: true,
    displayOrder: 4,
  },
  {
    id: '5',
    code: 'RECYCLED',
    name: 'Recycled',
    description: 'Asset is sent for recycling',
    requiresDocumentation: true,
    allowsSalvageValue: true,
    isActive: true,
    displayOrder: 5,
  },
  {
    id: '6',
    code: 'RETURNED_TO_VENDOR',
    name: 'Returned to Vendor',
    description: 'Asset is returned to the original vendor',
    requiresDocumentation: true,
    allowsSalvageValue: false,
    isActive: true,
    displayOrder: 6,
  },
  {
    id: '7',
    code: 'OTHER',
    name: 'Other',
    description: 'Other disposal method not listed above',
    requiresDocumentation: false,
    allowsSalvageValue: false,
    isActive: true,
    displayOrder: 7,
  },
];

export function useDisposalMethods() {
  const [methods, setMethods] = useState<DisposalMethod[]>(FALLBACK_DISPOSAL_METHODS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchDisposalMethods();
  }, []);

  const fetchDisposalMethods = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('disposal_methods')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true, nullsFirst: false });

      if (fetchError) throw fetchError;

      if (data && data.length > 0) {
        const mappedMethods: DisposalMethod[] = data.map((method) => ({
          id: method.id,
          code: method.code,
          name: method.name,
          description: method.description,
          requiresDocumentation: method.requires_documentation,
          allowsSalvageValue: method.allows_salvage_value,
          isActive: method.is_active,
          displayOrder: method.display_order,
        }));
        setMethods(mappedMethods);
      } else {
        // Use fallback if no data
        setMethods(FALLBACK_DISPOSAL_METHODS);
      }
    } catch (err) {
      console.error('Error fetching disposal methods:', err);
      setError(err as Error);
      // Use fallback data on error
      setMethods(FALLBACK_DISPOSAL_METHODS);
    } finally {
      setLoading(false);
    }
  };

  return {
    methods,
    loading,
    error,
    refetch: fetchDisposalMethods,
  };
}
