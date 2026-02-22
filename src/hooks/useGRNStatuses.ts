import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface GRNStatus {
  id: string;
  code: string;
  name: string;
  description: string | null;
  badgeClass: string | null;
  badgeVariant: string | null;
  icon: string | null;
  isTerminal: boolean;
  isActive: boolean;
  displayOrder: number;
}

const FALLBACK_STATUSES: GRNStatus[] = [
  { id: 'fallback-1', code: 'DRAFT', name: 'Draft', description: 'GRN is being prepared', badgeClass: 'bg-gray-500', badgeVariant: 'secondary', icon: 'FileEdit', isTerminal: false, isActive: true, displayOrder: 1 },
  { id: 'fallback-2', code: 'SUBMITTED', name: 'Submitted', description: 'GRN has been submitted', badgeClass: 'bg-blue-500', badgeVariant: 'default', icon: 'Send', isTerminal: false, isActive: true, displayOrder: 2 },
  { id: 'fallback-3', code: 'CHECKED', name: 'Checked', description: 'GRN has been checked', badgeClass: 'bg-yellow-500', badgeVariant: 'outline', icon: 'CheckSquare', isTerminal: false, isActive: true, displayOrder: 3 },
  { id: 'fallback-4', code: 'AUTHORIZED', name: 'Authorized', description: 'GRN has been authorized', badgeClass: 'bg-green-500', badgeVariant: 'default', icon: 'CheckCircle', isTerminal: true, isActive: true, displayOrder: 4 },
  { id: 'fallback-5', code: 'REJECTED', name: 'Rejected', description: 'GRN has been rejected', badgeClass: 'bg-red-500', badgeVariant: 'destructive', icon: 'XCircle', isTerminal: true, isActive: true, displayOrder: 5 },
];

export function useGRNStatuses() {
  const [statuses, setStatuses] = useState<GRNStatus[]>(FALLBACK_STATUSES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchStatuses();
  }, []);

  const fetchStatuses = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('grn_statuses')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (fetchError) throw fetchError;

      if (data && data.length > 0) {
        const transformedData: GRNStatus[] = data.map((item) => ({
          id: item.id,
          code: item.code,
          name: item.name,
          description: item.description,
          badgeClass: item.badge_class,
          badgeVariant: item.badge_variant,
          icon: item.icon,
          isTerminal: item.is_terminal,
          isActive: item.is_active,
          displayOrder: item.display_order,
        }));
        setStatuses(transformedData);
      } else {
        setStatuses(FALLBACK_STATUSES);
      }
    } catch (err) {
      console.error('Error fetching GRN statuses:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch GRN statuses'));
      setStatuses(FALLBACK_STATUSES);
    } finally {
      setLoading(false);
    }
  };

  const getStatusByCode = (code: string): GRNStatus | undefined => {
    return statuses.find(status => status.code === code);
  };

  const getStatusByName = (name: string): GRNStatus | undefined => {
    return statuses.find(status => status.name === name);
  };

  const getTerminalStatuses = (): GRNStatus[] => {
    return statuses.filter(status => status.isTerminal);
  };

  const getNonTerminalStatuses = (): GRNStatus[] => {
    return statuses.filter(status => !status.isTerminal);
  };

  return {
    statuses,
    loading,
    error,
    refetch: fetchStatuses,
    getStatusByCode,
    getStatusByName,
    getTerminalStatuses,
    getNonTerminalStatuses,
  };
}
