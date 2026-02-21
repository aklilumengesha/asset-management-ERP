import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RoleName, Profile } from '@/types/roles';

export function useRole() {
  const [role, setRole] = useState<RoleName | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserRole();
  }, []);

  const fetchUserRole = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }

      const { data: profileData, error } = await supabase
        .from('profiles')
        .select(`
          *,
          role:roles(*)
        `)
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (profileData) {
        setProfile(profileData);
        setRole(profileData.role?.name || null);
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
    } finally {
      setLoading(false);
    }
  };

  const hasRole = (roleName: RoleName | RoleName[]): boolean => {
    if (!role) return false;
    if (Array.isArray(roleName)) {
      return roleName.includes(role);
    }
    return role === roleName;
  };

  const isSuperAdmin = () => hasRole('super_admin');
  const isAdmin = () => hasRole(['super_admin', 'admin']);
  const isFinanceManager = () => hasRole(['super_admin', 'finance_manager']);
  const isAssetManager = () => hasRole(['super_admin', 'asset_manager']);
  const isProcurementManager = () => hasRole(['super_admin', 'procurement_manager']);
  const isDepartmentHead = () => hasRole(['super_admin', 'department_head']);
  const isEmployee = () => hasRole('employee');

  return {
    role,
    profile,
    loading,
    hasRole,
    isSuperAdmin,
    isAdmin,
    isFinanceManager,
    isAssetManager,
    isProcurementManager,
    isDepartmentHead,
    isEmployee,
    refetch: fetchUserRole
  };
}
