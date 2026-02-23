import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Role {
  id: string;
  name: string;
  displayName: string;
  description: string | null;
}

// Fallback data for offline scenarios
const FALLBACK_ROLES: Role[] = [
  {
    id: '1',
    name: 'admin',
    displayName: 'Admin',
    description: 'System administrator with full access',
  },
  {
    id: '2',
    name: 'finance_manager',
    displayName: 'Finance Manager',
    description: 'Manages financial operations',
  },
  {
    id: '3',
    name: 'asset_manager',
    displayName: 'Asset Manager',
    description: 'Manages company assets',
  },
  {
    id: '4',
    name: 'procurement_manager',
    displayName: 'Procurement Manager',
    description: 'Manages procurement processes',
  },
  {
    id: '5',
    name: 'department_head',
    displayName: 'Department Head',
    description: 'Leads a department',
  },
  {
    id: '6',
    name: 'employee',
    displayName: 'Employee',
    description: 'Standard employee access',
  },
];

export function useRoles(excludeSuperAdmin: boolean = false) {
  const [roles, setRoles] = useState<Role[]>(FALLBACK_ROLES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchRoles();
  }, [excludeSuperAdmin]);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('roles')
        .select('*')
        .order('display_name', { ascending: true });

      if (excludeSuperAdmin) {
        query = query.neq('name', 'super_admin');
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      if (data && data.length > 0) {
        const mappedRoles: Role[] = data.map((role) => ({
          id: role.id,
          name: role.name,
          displayName: role.display_name,
          description: role.description,
        }));
        setRoles(mappedRoles);
      } else {
        // Use fallback if no data
        setRoles(FALLBACK_ROLES);
      }
    } catch (err) {
      console.error('Error fetching roles:', err);
      setError(err as Error);
      // Use fallback data on error
      setRoles(FALLBACK_ROLES);
    } finally {
      setLoading(false);
    }
  };

  return {
    roles,
    loading,
    error,
    refetch: fetchRoles,
  };
}
