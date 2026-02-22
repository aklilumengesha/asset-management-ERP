import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useRole } from './useRole';

// Component types (camelCase for React components)
export interface NavigationGroup {
  id: string;
  name: string;
  icon: string;
  displayOrder: number;
  isActive: boolean;
  requiredRoles: string[];
}

export interface NavigationItem {
  id: string;
  groupId: string;
  label: string;
  path: string;
  icon: string | null;
  depth: number;
  displayOrder: number;
  isActive: boolean;
  requiredRoles: string[];
}

// Database types (snake_case from Supabase)
interface DBNavigationGroup {
  id: string;
  name: string;
  icon: string;
  display_order: number;
  is_active: boolean;
  required_roles: string[];
  created_at: string;
  updated_at: string;
}

interface DBNavigationItem {
  id: string;
  group_id: string;
  label: string;
  path: string;
  icon: string | null;
  depth: number;
  display_order: number;
  is_active: boolean;
  required_roles: string[];
  created_at: string;
  updated_at: string;
}

export function useNavigationMenu() {
  const [groups, setGroups] = useState<NavigationGroup[]>([]);
  const [items, setItems] = useState<NavigationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { role } = useRole();

  useEffect(() => {
    fetchNavigationData();
  }, [role]);

  const fetchNavigationData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch groups and items in parallel
      const [groupsResult, itemsResult] = await Promise.all([
        supabase
          .from('navigation_groups')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true }),
        supabase
          .from('navigation_items')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true })
      ]);

      if (groupsResult.error) throw groupsResult.error;
      if (itemsResult.error) throw itemsResult.error;

      // Transform database types to component types
      const transformedGroups: NavigationGroup[] = (groupsResult.data || []).map((item: DBNavigationGroup) => ({
        id: item.id,
        name: item.name,
        icon: item.icon,
        displayOrder: item.display_order,
        isActive: item.is_active,
        requiredRoles: item.required_roles || []
      }));

      const transformedItems: NavigationItem[] = (itemsResult.data || []).map((item: DBNavigationItem) => ({
        id: item.id,
        groupId: item.group_id,
        label: item.label,
        path: item.path,
        icon: item.icon,
        depth: item.depth,
        displayOrder: item.display_order,
        isActive: item.is_active,
        requiredRoles: item.required_roles || []
      }));

      // Filter by user role
      const filteredGroups = filterByRole(transformedGroups, role);
      const filteredItems = filterByRole(transformedItems, role);

      setGroups(filteredGroups);
      setItems(filteredItems);
    } catch (err) {
      console.error('Error fetching navigation data:', err);
      setError(err as Error);
      
      // Fallback to hardcoded data if database fetch fails
      setGroups(getFallbackGroups());
      setItems(getFallbackItems());
    } finally {
      setLoading(false);
    }
  };

  // Filter items by user role
  const filterByRole = <T extends { requiredRoles: string[] }>(items: T[], userRole: string | null): T[] => {
    if (!userRole) return [];
    
    return items.filter(item => {
      // If no roles required, show to everyone
      if (!item.requiredRoles || item.requiredRoles.length === 0) {
        return true;
      }
      // Check if user's role is in the required roles
      return item.requiredRoles.includes(userRole);
    });
  };

  // Get items for a specific group
  const getItemsForGroup = (groupId: string): NavigationItem[] => {
    return items.filter(item => item.groupId === groupId);
  };

  return {
    groups,
    items,
    loading,
    error,
    getItemsForGroup,
    refetch: fetchNavigationData
  };
}

// Fallback data if database fetch fails
function getFallbackGroups(): NavigationGroup[] {
  return [
    {
      id: 'procurement',
      name: 'Procurement',
      icon: 'ShoppingCart',
      displayOrder: 1,
      isActive: true,
      requiredRoles: ['super_admin', 'admin', 'procurement_manager', 'department_head', 'asset_manager', 'finance_manager']
    },
    {
      id: 'assets',
      name: 'Assets',
      icon: 'BoxIcon',
      displayOrder: 2,
      isActive: true,
      requiredRoles: []
    },
    {
      id: 'finance',
      name: 'Finance',
      icon: 'WalletIcon',
      displayOrder: 3,
      isActive: true,
      requiredRoles: ['super_admin', 'finance_manager']
    },
    {
      id: 'reports',
      name: 'Reports',
      icon: 'FileText',
      displayOrder: 4,
      isActive: true,
      requiredRoles: ['super_admin', 'admin', 'finance_manager', 'asset_manager', 'procurement_manager', 'department_head']
    },
    {
      id: 'admin',
      name: 'Admin',
      icon: 'Settings',
      displayOrder: 5,
      isActive: true,
      requiredRoles: ['super_admin', 'admin']
    }
  ];
}

function getFallbackItems(): NavigationItem[] {
  return [
    // Procurement items
    { id: '1', groupId: 'procurement', label: 'Requests', path: '/requests', icon: 'ClipboardList', depth: 1, displayOrder: 1, isActive: true, requiredRoles: [] },
    { id: '2', groupId: 'procurement', label: 'Purchase Orders', path: '/purchase-orders', icon: 'FileText', depth: 1, displayOrder: 2, isActive: true, requiredRoles: ['super_admin', 'admin', 'procurement_manager', 'finance_manager'] },
    { id: '3', groupId: 'procurement', label: 'GRN', path: '/grn', icon: 'PackageCheck', depth: 1, displayOrder: 3, isActive: true, requiredRoles: ['super_admin', 'admin', 'procurement_manager', 'asset_manager'] },
    
    // Assets items
    { id: '4', groupId: 'assets', label: 'Asset List', path: '/assets', icon: 'BoxIcon', depth: 1, displayOrder: 1, isActive: true, requiredRoles: [] },
    { id: '5', groupId: 'assets', label: 'Request', path: '/assets/request', icon: 'ClipboardList', depth: 1, displayOrder: 2, isActive: true, requiredRoles: [] },
    { id: '6', groupId: 'assets', label: 'Maintenance', path: '/maintenance', icon: 'WrenchIcon', depth: 1, displayOrder: 3, isActive: true, requiredRoles: ['super_admin', 'admin', 'asset_manager', 'procurement_manager', 'department_head', 'finance_manager'] },
    { id: '7', groupId: 'assets', label: 'Disposal', path: '/assets/disposal', icon: 'Trash2', depth: 1, displayOrder: 4, isActive: true, requiredRoles: ['super_admin', 'admin', 'asset_manager', 'procurement_manager', 'department_head', 'finance_manager'] },
    { id: '8', groupId: 'assets', label: 'Capitalisation', path: '/assets/capitalisation', icon: 'DollarSign', depth: 1, displayOrder: 5, isActive: true, requiredRoles: ['super_admin', 'admin', 'asset_manager', 'procurement_manager', 'department_head', 'finance_manager'] },
    { id: '9', groupId: 'assets', label: 'Vendors', path: '/vendors', icon: 'BoxIcon', depth: 1, displayOrder: 6, isActive: true, requiredRoles: ['super_admin', 'asset_manager', 'procurement_manager'] },
    
    // Finance items
    { id: '10', groupId: 'finance', label: 'Depreciation Setup', path: '/admin/finance/depreciation-setup', icon: null, depth: 1, displayOrder: 1, isActive: true, requiredRoles: ['super_admin', 'finance_manager'] },
    { id: '11', groupId: 'finance', label: 'Depreciation Schedules', path: '/admin/finance/depreciation-schedule', icon: null, depth: 1, displayOrder: 2, isActive: true, requiredRoles: ['super_admin', 'finance_manager'] },
    { id: '12', groupId: 'finance', label: 'Revaluation/Impairment', path: '/admin/finance/impairment-revaluation', icon: null, depth: 1, displayOrder: 3, isActive: true, requiredRoles: ['super_admin', 'finance_manager'] },
    { id: '13', groupId: 'finance', label: 'ERP Integration', path: '/admin/finance/erp-integration', icon: null, depth: 1, displayOrder: 4, isActive: true, requiredRoles: ['super_admin', 'finance_manager'] },
    
    // Reports items
    { id: '14', groupId: 'reports', label: 'Asset Reports', path: '/reports/assets', icon: null, depth: 1, displayOrder: 1, isActive: true, requiredRoles: ['super_admin', 'admin', 'finance_manager', 'asset_manager', 'procurement_manager', 'department_head'] },
    { id: '15', groupId: 'reports', label: 'Financial Reports', path: '/reports/financial', icon: null, depth: 1, displayOrder: 2, isActive: true, requiredRoles: ['super_admin', 'admin', 'finance_manager', 'asset_manager', 'procurement_manager', 'department_head'] },
    
    // Admin items
    { id: '16', groupId: 'admin', label: 'User Management', path: '/admin/users', icon: 'Users2', depth: 1, displayOrder: 1, isActive: true, requiredRoles: ['super_admin', 'admin'] },
    { id: '17', groupId: 'admin', label: 'Roles & Permissions', path: '/admin/roles', icon: 'ShieldCheck', depth: 1, displayOrder: 2, isActive: true, requiredRoles: ['super_admin', 'admin'] },
    { id: '18', groupId: 'admin', label: 'Approval Workflow', path: '/admin/workflow', icon: 'GitBranch', depth: 1, displayOrder: 3, isActive: true, requiredRoles: ['super_admin', 'admin'] },
    { id: '19', groupId: 'admin', label: 'Departments', path: '/admin/departments', icon: 'Building2', depth: 1, displayOrder: 4, isActive: true, requiredRoles: ['super_admin', 'admin'] },
    { id: '20', groupId: 'admin', label: 'Item Master', path: '/admin/item-master', icon: 'Tag', depth: 1, displayOrder: 5, isActive: true, requiredRoles: ['super_admin', 'admin'] },
    { id: '21', groupId: 'admin', label: 'Integrations', path: '/admin/integrations', icon: 'Link2', depth: 1, displayOrder: 6, isActive: true, requiredRoles: ['super_admin', 'admin'] },
    { id: '22', groupId: 'admin', label: 'Company Setup', path: '/admin/company', icon: 'Building', depth: 1, displayOrder: 7, isActive: true, requiredRoles: ['super_admin', 'admin'] },
    { id: '23', groupId: 'admin', label: 'Audit Logs', path: '/admin/audit-logs', icon: 'History', depth: 1, displayOrder: 8, isActive: true, requiredRoles: ['super_admin', 'admin'] }
  ];
}
