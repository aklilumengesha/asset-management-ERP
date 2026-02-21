import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface DepartmentSpending {
  name: string;
  spent: number;
  budget: number;
  percentage: number;
}

export function useDepartmentSpending(limit: number = 5) {
  const [departments, setDepartments] = useState<DepartmentSpending[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchDepartmentSpending();
  }, [limit]);

  const fetchDepartmentSpending = async () => {
    try {
      setLoading(true);
      setError(null);

      // TODO: Replace with actual department spending query when available
      // For now, return empty array as placeholder
      // const { data, error: fetchError } = await supabase
      //   .from('departments')
      //   .select('id, name, budget, spent')
      //   .order('spent', { ascending: false })
      //   .limit(limit);

      // if (fetchError) throw fetchError;

      // const formattedDepartments: DepartmentSpending[] = data?.map(dept => ({
      //   name: dept.name,
      //   spent: dept.spent || 0,
      //   budget: dept.budget || 0,
      //   percentage: dept.budget > 0 ? Math.round((dept.spent / dept.budget) * 100) : 0
      // })) || [];

      setDepartments([]);
    } catch (err) {
      console.error('Error fetching department spending:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return {
    departments,
    loading,
    error,
    refetch: fetchDepartmentSpending
  };
}
