import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface DisposalReason {
  id: string;
  code: string;
  name: string;
  description: string | null;
  requiresApproval: boolean;
  isActive: boolean;
  displayOrder: number | null;
}

// Fallback data for offline scenarios
const FALLBACK_DISPOSAL_REASONS: DisposalReason[] = [
  {
    id: '1',
    code: 'END_OF_LIFE',
    name: 'End of Life',
    description: 'Asset has reached the end of its useful life',
    requiresApproval: false,
    isActive: true,
    displayOrder: 1,
  },
  {
    id: '2',
    code: 'DAMAGED_BEYOND_REPAIR',
    name: 'Damaged Beyond Repair',
    description: 'Asset is damaged and cannot be economically repaired',
    requiresApproval: false,
    isActive: true,
    displayOrder: 2,
  },
  {
    id: '3',
    code: 'OBSOLETE',
    name: 'Obsolete',
    description: 'Asset is outdated or no longer needed',
    requiresApproval: false,
    isActive: true,
    displayOrder: 3,
  },
  {
    id: '4',
    code: 'SALE',
    name: 'Sale',
    description: 'Asset is being sold to a third party',
    requiresApproval: true,
    isActive: true,
    displayOrder: 4,
  },
  {
    id: '5',
    code: 'DONATION',
    name: 'Donation',
    description: 'Asset is being donated to an organization or individual',
    requiresApproval: true,
    isActive: true,
    displayOrder: 5,
  },
  {
    id: '6',
    code: 'THEFT_LOSS',
    name: 'Theft/Loss',
    description: 'Asset was stolen or lost',
    requiresApproval: true,
    isActive: true,
    displayOrder: 6,
  },
  {
    id: '7',
    code: 'UPGRADE_REPLACEMENT',
    name: 'Upgrade/Replacement',
    description: 'Asset is being replaced with a newer model',
    requiresApproval: false,
    isActive: true,
    displayOrder: 7,
  },
  {
    id: '8',
    code: 'OTHER',
    name: 'Other',
    description: 'Other reason not listed above',
    requiresApproval: false,
    isActive: true,
    displayOrder: 8,
  },
];

export function useDisposalReasons() {
  const [reasons, setReasons] = useState<DisposalReason[]>(FALLBACK_DISPOSAL_REASONS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchDisposalReasons();
  }, []);

  const fetchDisposalReasons = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('disposal_reasons')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true, nullsFirst: false });

      if (fetchError) throw fetchError;

      if (data && data.length > 0) {
        const mappedReasons: DisposalReason[] = data.map((reason) => ({
          id: reason.id,
          code: reason.code,
          name: reason.name,
          description: reason.description,
          requiresApproval: reason.requires_approval,
          isActive: reason.is_active,
          displayOrder: reason.display_order,
        }));
        setReasons(mappedReasons);
      } else {
        // Use fallback if no data
        setReasons(FALLBACK_DISPOSAL_REASONS);
      }
    } catch (err) {
      console.error('Error fetching disposal reasons:', err);
      setError(err as Error);
      // Use fallback data on error
      setReasons(FALLBACK_DISPOSAL_REASONS);
    } finally {
      setLoading(false);
    }
  };

  return {
    reasons,
    loading,
    error,
    refetch: fetchDisposalReasons,
  };
}
