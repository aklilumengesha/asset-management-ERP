import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface PriorityLevel {
  id: string;
  code: string;
  name: string;
  description: string | null;
  severityLevel: number;
  colorClass: string | null;
  icon: string | null;
  slaHours: number | null;
  isActive: boolean;
  displayOrder: number;
}

const FALLBACK_PRIORITIES: PriorityLevel[] = [
  { id: 'fallback-1', code: 'CRITICAL', name: 'Critical', description: 'Immediate attention required', severityLevel: 1, colorClass: 'red', icon: null, slaHours: 1, isActive: true, displayOrder: 1 },
  { id: 'fallback-2', code: 'HIGH', name: 'High', description: 'High priority - significant impact', severityLevel: 2, colorClass: 'red', icon: null, slaHours: 4, isActive: true, displayOrder: 2 },
  { id: 'fallback-3', code: 'MEDIUM', name: 'Medium', description: 'Medium priority - moderate impact', severityLevel: 3, colorClass: 'amber', icon: null, slaHours: 24, isActive: true, displayOrder: 3 },
  { id: 'fallback-4', code: 'LOW', name: 'Low', description: 'Low priority - minimal impact', severityLevel: 4, colorClass: 'green', icon: null, slaHours: 72, isActive: true, displayOrder: 4 },
  { id: 'fallback-5', code: 'PLANNING', name: 'Planning', description: 'Future planning - no immediate action', severityLevel: 5, colorClass: 'blue', icon: null, slaHours: 168, isActive: true, displayOrder: 5 },
];

export function usePriorityLevels() {
  const [priorities, setPriorities] = useState<PriorityLevel[]>(FALLBACK_PRIORITIES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchPriorities();
  }, []);

  const fetchPriorities = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('priority_levels')
        .select('*')
        .eq('is_active', true)
        .order('severity_level', { ascending: true });

      if (fetchError) throw fetchError;

      if (data && data.length > 0) {
        const transformedData: PriorityLevel[] = data.map((item) => ({
          id: item.id,
          code: item.code,
          name: item.name,
          description: item.description,
          severityLevel: item.severity_level,
          colorClass: item.color_class,
          icon: item.icon,
          slaHours: item.sla_hours,
          isActive: item.is_active,
          displayOrder: item.display_order,
        }));
        setPriorities(transformedData);
      } else {
        setPriorities(FALLBACK_PRIORITIES);
      }
    } catch (err) {
      console.error('Error fetching priority levels:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch priority levels'));
      setPriorities(FALLBACK_PRIORITIES);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityByCode = (code: string): PriorityLevel | undefined => {
    return priorities.find(priority => priority.code.toUpperCase() === code.toUpperCase());
  };

  const getPriorityByName = (name: string): PriorityLevel | undefined => {
    return priorities.find(priority => priority.name.toLowerCase() === name.toLowerCase());
  };

  const getPriorityById = (id: string): PriorityLevel | undefined => {
    return priorities.find(priority => priority.id === id);
  };

  const getPriorityBySeverity = (severityLevel: number): PriorityLevel | undefined => {
    return priorities.find(priority => priority.severityLevel === severityLevel);
  };

  // Get color classes for badge styling
  const getPriorityColors = (priority: string): { color: string; bgColor: string } => {
    const priorityLevel = getPriorityByCode(priority) || getPriorityByName(priority);
    
    if (!priorityLevel || !priorityLevel.colorClass) {
      return { color: 'text-gray-600', bgColor: 'bg-gray-100' };
    }

    const colorMap: Record<string, { color: string; bgColor: string }> = {
      red: { color: 'text-red-600', bgColor: 'bg-red-100' },
      amber: { color: 'text-amber-600', bgColor: 'bg-amber-100' },
      yellow: { color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
      green: { color: 'text-green-600', bgColor: 'bg-green-100' },
      blue: { color: 'text-blue-600', bgColor: 'bg-blue-100' },
      gray: { color: 'text-gray-600', bgColor: 'bg-gray-100' },
    };

    return colorMap[priorityLevel.colorClass] || { color: 'text-gray-600', bgColor: 'bg-gray-100' };
  };

  // Convert to Option format for Select components
  const getPrioritiesAsOptions = () => {
    return priorities.map(priority => ({
      value: priority.name,
      label: priority.name
    }));
  };

  return {
    priorities,
    loading,
    error,
    refetch: fetchPriorities,
    getPriorityByCode,
    getPriorityByName,
    getPriorityById,
    getPriorityBySeverity,
    getPriorityColors,
    getPrioritiesAsOptions,
  };
}
