import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface RequestStatus {
  id: string;
  code: string;
  name: string;
  description: string | null;
  colorClass: string;
  icon: string | null;
  isTerminal: boolean;
  isActive: boolean;
  displayOrder: number;
}

// Fallback data for offline scenarios
const FALLBACK_REQUEST_STATUSES: RequestStatus[] = [
  {
    id: 'fallback-1',
    code: 'APPROVED',
    name: 'Approved',
    description: 'Request has been approved',
    colorClass: 'bg-green-100 text-green-700 border border-green-200',
    icon: 'check-circle',
    isTerminal: false,
    isActive: true,
    displayOrder: 1,
  },
  {
    id: 'fallback-2',
    code: 'REJECTED',
    name: 'Rejected',
    description: 'Request has been rejected',
    colorClass: 'bg-red-100 text-red-700 border border-red-200',
    icon: 'x-circle',
    isTerminal: true,
    isActive: true,
    displayOrder: 2,
  },
  {
    id: 'fallback-3',
    code: 'PENDING',
    name: 'Pending',
    description: 'Request is pending review',
    colorClass: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
    icon: 'clock',
    isTerminal: false,
    isActive: true,
    displayOrder: 3,
  },
  {
    id: 'fallback-4',
    code: 'IN_APPROVAL',
    name: 'In Approval',
    description: 'Request is in approval workflow',
    colorClass: 'bg-amber-100 text-amber-700 border border-amber-200',
    icon: 'hourglass',
    isTerminal: false,
    isActive: true,
    displayOrder: 4,
  },
  {
    id: 'fallback-5',
    code: 'NOT_STARTED',
    name: 'Not Started',
    description: 'Request has not been started',
    colorClass: 'bg-gray-100 text-gray-700 border border-gray-200',
    icon: 'circle',
    isTerminal: false,
    isActive: true,
    displayOrder: 5,
  },
  {
    id: 'fallback-6',
    code: 'DRAFT',
    name: 'Draft',
    description: 'Request is in draft state',
    colorClass: 'bg-slate-100 text-slate-700 border border-slate-200',
    icon: 'file-edit',
    isTerminal: false,
    isActive: true,
    displayOrder: 6,
  },
  {
    id: 'fallback-7',
    code: 'DELIVERED',
    name: 'Delivered',
    description: 'Request has been delivered',
    colorClass: 'bg-blue-100 text-blue-700 border border-blue-200',
    icon: 'package-check',
    isTerminal: true,
    isActive: true,
    displayOrder: 7,
  },
  {
    id: 'fallback-8',
    code: 'PROCESSING',
    name: 'Processing',
    description: 'Request is being processed',
    colorClass: 'bg-purple-100 text-purple-700 border border-purple-200',
    icon: 'loader',
    isTerminal: false,
    isActive: true,
    displayOrder: 8,
  },
  {
    id: 'fallback-9',
    code: 'CANCELLED',
    name: 'Cancelled',
    description: 'Request has been cancelled',
    colorClass: 'bg-rose-100 text-rose-700 border border-rose-200',
    icon: 'ban',
    isTerminal: true,
    isActive: true,
    displayOrder: 9,
  },
  {
    id: 'fallback-10',
    code: 'COMPLETED',
    name: 'Completed',
    description: 'Request has been completed',
    colorClass: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
    icon: 'check-circle-2',
    isTerminal: true,
    isActive: true,
    displayOrder: 10,
  },
];

export function useRequestStatuses() {
  const [statuses, setStatuses] = useState<RequestStatus[]>(FALLBACK_REQUEST_STATUSES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchRequestStatuses();
  }, []);

  const fetchRequestStatuses = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('request_statuses')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (fetchError) {
        throw fetchError;
      }

      if (data && data.length > 0) {
        // Transform snake_case to camelCase
        const transformedData: RequestStatus[] = data.map((item) => ({
          id: item.id,
          code: item.code,
          name: item.name,
          description: item.description,
          colorClass: item.color_class,
          icon: item.icon,
          isTerminal: item.is_terminal,
          isActive: item.is_active,
          displayOrder: item.display_order,
        }));

        setStatuses(transformedData);
      } else {
        // Use fallback if no data
        setStatuses(FALLBACK_REQUEST_STATUSES);
      }
    } catch (err) {
      console.error('Error fetching request statuses:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch request statuses'));
      // Keep fallback data on error
      setStatuses(FALLBACK_REQUEST_STATUSES);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get status by code
  const getStatusByCode = (code: string): RequestStatus | undefined => {
    return statuses.find(status => status.code === code);
  };

  // Helper function to get status color class
  const getStatusColor = (statusName: string): string => {
    const status = statuses.find(s => s.name === statusName || s.code === statusName);
    return status?.colorClass || 'bg-indigo-100 text-indigo-700 border border-indigo-200';
  };

  return {
    statuses,
    loading,
    error,
    refetch: fetchRequestStatuses,
    getStatusByCode,
    getStatusColor,
  };
}
