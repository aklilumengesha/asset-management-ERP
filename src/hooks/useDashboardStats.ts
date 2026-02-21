import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RoleName } from '@/types/roles';

export interface DashboardStats {
  totalUsers?: number;
  totalAssets?: number;
  activeRequests?: number;
  pendingApprovals?: number;
  systemAlerts?: number;
  maintenanceDue?: number;
  assetsInUse?: number;
  activePOs?: number;
  monthlySpend?: number;
  overdueDeliveries?: number;
  teamMembers?: number;
  departmentBudget?: number;
  assetUtilization?: number;
  totalAssetValue?: number;
  depreciationThisMonth?: number;
  budgetAlerts?: number;
}

export function useDashboardStats(role: RoleName | null, userId?: string) {
  const [stats, setStats] = useState<DashboardStats>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!role) return;
    
    fetchStats();
  }, [role, userId]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const newStats: DashboardStats = {};

      // Fetch total users (for admin roles)
      if (role === 'super_admin' || role === 'admin') {
        const { count: usersCount, error: usersError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
        
        if (usersError) throw usersError;
        newStats.totalUsers = usersCount || 0;
      }

      // Fetch total assets (for all roles)
      // Note: This will work once assets table is created
      // For now, we'll set a placeholder
      newStats.totalAssets = 0;

      // Fetch active requests
      // Note: This will work once requests table is created
      newStats.activeRequests = 0;
      newStats.pendingApprovals = 0;

      // Role-specific stats
      switch (role) {
        case 'super_admin':
        case 'admin':
          newStats.systemAlerts = 0;
          break;

        case 'finance_manager':
          newStats.totalAssetValue = 0;
          newStats.depreciationThisMonth = 0;
          newStats.budgetAlerts = 0;
          break;

        case 'asset_manager':
          newStats.maintenanceDue = 0;
          newStats.assetsInUse = 0;
          break;

        case 'procurement_manager':
          newStats.activePOs = 0;
          newStats.monthlySpend = 0;
          newStats.overdueDeliveries = 0;
          break;

        case 'department_head':
          newStats.teamMembers = 0;
          newStats.departmentBudget = 0;
          newStats.assetUtilization = 0;
          break;

        case 'employee':
          // Employee-specific stats
          break;
      }

      setStats(newStats);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  };
}
