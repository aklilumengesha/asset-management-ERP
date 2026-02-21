export type ActivityModule = 
  | 'auth'
  | 'users'
  | 'assets'
  | 'requests'
  | 'approvals'
  | 'departments'
  | 'roles'
  | 'settings'
  | 'finance'
  | 'procurement'
  | 'maintenance';

export type ActivityAction =
  | 'create'
  | 'update'
  | 'delete'
  | 'view'
  | 'login'
  | 'logout'
  | 'approve'
  | 'reject'
  | 'submit'
  | 'assign'
  | 'transfer'
  | 'dispose';

export interface ActivityLog {
  id: string;
  user_id: string;
  action: ActivityAction;
  module: ActivityModule;
  entity_type?: string;
  entity_id?: string;
  description: string;
  metadata?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  user?: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

export interface ActivityFilters {
  module?: ActivityModule;
  action?: ActivityAction;
  userId?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
}
