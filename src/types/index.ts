// Common types for the application

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  department_id?: string;
  location_id?: string;
}

export interface Asset {
  id: string;
  asset_tag: string;
  name: string;
  description?: string;
  category: string;
  status: string;
  purchase_date: string;
  purchase_cost: number;
  current_value: number;
  location_id: string;
  department_id: string;
  assigned_to?: string;
}

export interface Request {
  id: string;
  request_number: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  requested_by: string;
  requested_date: string;
  total_amount: number;
}

export interface PurchaseOrder {
  id: string;
  po_number: string;
  vendor_id: string;
  status: string;
  order_date: string;
  total_amount: number;
  items: POItem[];
}

export interface POItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}
