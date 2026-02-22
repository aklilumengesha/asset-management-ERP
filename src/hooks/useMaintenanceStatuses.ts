import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface MaintenanceStatus {
  id: string;
  code: string;
  name: string;
  description: string | null;
  colorClass: string | null;
  icon: string | null;
  isTerminal: boolean;
  allowsEditing: boolean;
  workflowOrder: number | null;
  isActive: boolean;
  displayOrder: number;
}

const FALLBACK_STATUSES: MaintenanceStatus[] = [
  { id: 'fallback-1', code: 'SCHEDULED', name: 'Scheduled', description: 'Maintenance has been scheduled', colorClass: 'blue', icon: null, isTerminal: false, allowsEditing: true, workflowOrder: 1, isActive: true, displayOrder: 1 },
  { id: 'fallback-2', code: 'IN_PROGRESS', name: 'In Progress', description: 'Maintenance work is currently being performed', colorClass: 'yellow', icon: null, isTerminal: false, allowsEditing: true, workflowOrder: 2, isActive: true, displayOrder: 2 },
  { id: 'fallback-3', code: 'ON_HOLD', name: 'On Hold', description: 'Maintenance work has been paused', colorClass: 'orange', icon: null, isTerminal: false, allowsEditing: true, workflowOrder: 3, isActive: true, displayOrder: 3 },
  { id: 'fallback-4', code: 'COMPLETED', name: 'Completed', description: 'Maintenance work has been successfully completed', colorClass: 'green', icon: null, isTerminal: true, allowsEditing: false, workflowOrder: 4, isActive: true, displayOrder: 4 },
  { id: 'fallback-5', code: 'CANCELLED', name: 'Cancelled', description: 'Maintenance has been cancelled', colorClass: 'red', icon: null, isTerminal: true, allowsEditing: false, workflowOrder: 5, isActive: true, displayOrder: 5 },
  { id: 'fallback-6', code: 'FAILED', name: 'Failed', description: 'Maintenance could not be completed', colorClass: 'red', icon: null, isTerminal: true, allowsEditing: false, workflowOrder: 6, isActive: true, displayOrder: 6 },
];

export function useMaintenanceStatuses() {
  const [statuses, setStatuses] = useState<MaintenanceStatus[]>(FALLBACK_STATUSES);
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
        .from('maintenance_statuses')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (fetchError) throw fetchError;

      if (data && data.length > 0) {
        const transformedData: MaintenanceStatus[] = data.map((item) => ({
          id: item.id,
          code: item.code,
          name: item.name,
          description: item.description,
          colorClass: item.color_class,
          icon: item.icon,
          isTerminal: item.is_terminal,
          allowsEditing: item.allows_editing,
          workflowOrder: item.workflow_order,
          isActive: item.is_active,
          displayOrder: item.display_order,
        }));
        setStatuses(transformedData);
      } else {
        setStatuses(FALLBACK_STATUSES);
      }
    } catch (err) {
      console.error('Error fetching maintenance statuses:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch maintenance statuses'));
      setStatuses(FALLBACK_STATUSES);
    } finally {
      setLoading(false);
    }
  };

  const getStatusByCode = (code: string): MaintenanceStatus | undefined => {
    return statuses.find(status => status.code.toUpperCase() === code.toUpperCase());
  };

  const getStatusByName = (name: string): MaintenanceStatus | undefined => {
    return statuses.find(status => status.name.toLowerCase() === name.toLowerCase());
  };

  const getStatusById = (id: string): MaintenanceStatus | undefined => {
    return statuses.find(status => status.id === id);
  };

  const getTerminalStatuses = (): MaintenanceStatus[] => {
    return statuses.filter(status => status.isTerminal);
  };

  const getEditableStatuses = (): MaintenanceStatus[] => {
    return statuses.filter(status => !status.isTerminal && status.allowsEditing);
  };

  // Get color classes for badge styling
  const getStatusColors = (statusCodeOrName: string): { color: string; bgColor: string } => {
    const status = getStatusByCode(statusCodeOrName) || getStatusByName(statusCodeOrName);
    
    if (!status || !status.colorClass) {
      return { color: 'text-gray-600', bgColor: 'bg-gray-100' };
    }

    const colorMap: Record<string, { color: string; bgColor: string }> = {
      blue: { color: 'text-blue-600', bgColor: 'bg-blue-100' },
      yellow: { color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
      orange: { color: 'text-orange-600', bgColor: 'bg-orange-100' },
      green: { color: 'text-green-600', bgColor: 'bg-green-100' },
      red: { color: 'text-red-600', bgColor: 'bg-red-100' },
      purple: { color: 'text-purple-600', bgColor: 'bg-purple-100' },
      gray: { color: 'text-gray-600', bgColor: 'bg-gray-100' },
    };

    return colorMap[status.colorClass] || { color: 'text-gray-600', bgColor: 'bg-gray-100' };
  };

  // Convert to Option format for Select components
  const getStatusesAsOptions = () => {
    return statuses.map(status => ({
      value: status.code,
      label: status.name
    }));
  };

  return {
    statuses,
    loading,
    error,
    refetch: fetchStatuses,
    getStatusByCode,
    getStatusByName,
    getStatusById,
    getTerminalStatuses,
    getEditableStatuses,
    getStatusColors,
    getStatusesAsOptions,
  };
}
