export type RoleName = 
  | 'super_admin'
  | 'admin'
  | 'finance_manager'
  | 'asset_manager'
  | 'procurement_manager'
  | 'department_head'
  | 'employee';

export interface Role {
  id: string;
  name: RoleName;
  display_name: string;
  description: string;
  created_at: string;
}

export interface Profile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role_id: string;
  department_id: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  role?: Role;
}

export interface Department {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Invitation {
  id: string;
  email: string;
  role_id: string;
  department_id: string | null;
  invited_by: string;
  token: string;
  expires_at: string;
  accepted_at: string | null;
  created_at: string;
}
