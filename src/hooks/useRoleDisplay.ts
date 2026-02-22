import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Component types (camelCase for React components)
export interface RoleDisplayConfig {
  roleName: string;
  displayName: string;
  badgeBgColor: string;
  badgeTextColor: string;
  isActive: boolean;
  displayOrder: number;
}

// Database types (snake_case from Supabase)
interface DBRoleDisplayConfig {
  role_name: string;
  display_name: string;
  badge_bg_color: string;
  badge_text_color: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export function useRoleDisplay() {
  const [roles, setRoles] = useState<RoleDisplayConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchRoleDisplayConfig();
  }, []);

  const fetchRoleDisplayConfig = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('role_display_config')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (fetchError) throw fetchError;

      // Transform database types to component types
      const transformedRoles: RoleDisplayConfig[] = (data || []).map((item: DBRoleDisplayConfig) => ({
        roleName: item.role_name,
        displayName: item.display_name,
        badgeBgColor: item.badge_bg_color,
        badgeTextColor: item.badge_text_color,
        isActive: item.is_active,
        displayOrder: item.display_order
      }));

      setRoles(transformedRoles);
    } catch (err) {
      console.error('Error fetching role display config:', err);
      setError(err as Error);
      
      // Fallback to hardcoded data if database fetch fails
      setRoles(getFallbackRoles());
    } finally {
      setLoading(false);
    }
  };

  // Get display name for a role
  const getRoleDisplayName = (roleName: string | null): string => {
    if (!roleName) return 'User';
    
    const role = roles.find(r => r.roleName === roleName);
    return role?.displayName || roleName;
  };

  // Get badge color classes for a role
  const getRoleBadgeColor = (roleName: string | null): string => {
    if (!roleName) return 'bg-gray-100 text-gray-800';
    
    const role = roles.find(r => r.roleName === roleName);
    if (!role) return 'bg-gray-100 text-gray-800';
    
    return `${role.badgeBgColor} ${role.badgeTextColor}`;
  };

  // Get role config by name
  const getRoleConfig = (roleName: string | null): RoleDisplayConfig | null => {
    if (!roleName) return null;
    return roles.find(r => r.roleName === roleName) || null;
  };

  return {
    roles,
    loading,
    error,
    getRoleDisplayName,
    getRoleBadgeColor,
    getRoleConfig,
    refetch: fetchRoleDisplayConfig
  };
}

// Fallback data if database fetch fails
function getFallbackRoles(): RoleDisplayConfig[] {
  return [
    {
      roleName: 'super_admin',
      displayName: 'Super Admin',
      badgeBgColor: 'bg-purple-100',
      badgeTextColor: 'text-purple-800',
      isActive: true,
      displayOrder: 1
    },
    {
      roleName: 'admin',
      displayName: 'Admin',
      badgeBgColor: 'bg-blue-100',
      badgeTextColor: 'text-blue-800',
      isActive: true,
      displayOrder: 2
    },
    {
      roleName: 'finance_manager',
      displayName: 'Finance Manager',
      badgeBgColor: 'bg-green-100',
      badgeTextColor: 'text-green-800',
      isActive: true,
      displayOrder: 3
    },
    {
      roleName: 'asset_manager',
      displayName: 'Asset Manager',
      badgeBgColor: 'bg-orange-100',
      badgeTextColor: 'text-orange-800',
      isActive: true,
      displayOrder: 4
    },
    {
      roleName: 'procurement_manager',
      displayName: 'Procurement Manager',
      badgeBgColor: 'bg-cyan-100',
      badgeTextColor: 'text-cyan-800',
      isActive: true,
      displayOrder: 5
    },
    {
      roleName: 'department_head',
      displayName: 'Department Head',
      badgeBgColor: 'bg-indigo-100',
      badgeTextColor: 'text-indigo-800',
      isActive: true,
      displayOrder: 6
    },
    {
      roleName: 'employee',
      displayName: 'Employee',
      badgeBgColor: 'bg-gray-100',
      badgeTextColor: 'text-gray-800',
      isActive: true,
      displayOrder: 7
    }
  ];
}
