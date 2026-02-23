import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Department {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
}

// Fallback data for offline scenarios
const FALLBACK_DEPARTMENTS: Department[] = [
  {
    id: '1',
    name: 'Engineering',
    description: 'Software development and technical teams',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Finance',
    description: 'Financial planning and accounting',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'HR',
    description: 'Human resources and talent management',
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Operations',
    description: 'Business operations and logistics',
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Sales',
    description: 'Sales and business development',
    createdAt: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Marketing',
    description: 'Marketing and communications',
    createdAt: new Date().toISOString(),
  },
];

export function useDepartments() {
  const [departments, setDepartments] = useState<Department[]>(FALLBACK_DEPARTMENTS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('departments')
        .select('*')
        .order('name', { ascending: true });

      if (fetchError) throw fetchError;

      if (data && data.length > 0) {
        const mappedDepartments: Department[] = data.map((dept) => ({
          id: dept.id,
          name: dept.name,
          description: dept.description,
          createdAt: dept.created_at,
        }));
        setDepartments(mappedDepartments);
      } else {
        // Use fallback if no data
        setDepartments(FALLBACK_DEPARTMENTS);
      }
    } catch (err) {
      console.error('Error fetching departments:', err);
      setError(err as Error);
      // Use fallback data on error
      setDepartments(FALLBACK_DEPARTMENTS);
    } finally {
      setLoading(false);
    }
  };

  return {
    departments,
    loading,
    error,
    refetch: fetchDepartments,
  };
}
