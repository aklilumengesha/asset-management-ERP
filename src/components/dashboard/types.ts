
// NOTE: This type is now dynamic and loaded from the database via useRequestStatuses hook
// Kept for backward compatibility. New code should use the hook directly.
export type RequestStatus = 
  | 'DRAFT' 
  | 'PENDING' 
  | 'IN_REVIEW' 
  | 'IN_APPROVAL'
  | 'APPROVED' 
  | 'REJECTED'
  | 'NOT_STARTED'
  | 'DELIVERED'
  | 'PROCESSING'
  | 'CANCELLED'
  | 'COMPLETED'
  | string; // Allow any string for dynamic statuses from database

// NOTE: This mapping is deprecated. Use useRequestStatuses() hook instead.
// Kept for backward compatibility during migration.
export const requestStatuses: Record<string, { label: string; color: string }> = {
  DRAFT: {
    label: 'Draft',
    color: 'bg-slate-100 text-slate-700 border border-slate-200'
  },
  PENDING: {
    label: 'Pending',
    color: 'bg-yellow-100 text-yellow-700 border border-yellow-200'
  },
  IN_REVIEW: {
    label: 'In Review',
    color: 'bg-amber-100 text-amber-700 border border-amber-200'
  },
  IN_APPROVAL: {
    label: 'In Approval',
    color: 'bg-amber-100 text-amber-700 border border-amber-200'
  },
  APPROVED: {
    label: 'Approved',
    color: 'bg-green-100 text-green-700 border border-green-200'
  },
  REJECTED: {
    label: 'Rejected',
    color: 'bg-red-100 text-red-700 border border-red-200'
  },
  NOT_STARTED: {
    label: 'Not Started',
    color: 'bg-gray-100 text-gray-700 border border-gray-200'
  },
  DELIVERED: {
    label: 'Delivered',
    color: 'bg-blue-100 text-blue-700 border border-blue-200'
  },
  PROCESSING: {
    label: 'Processing',
    color: 'bg-purple-100 text-purple-700 border border-purple-200'
  },
  CANCELLED: {
    label: 'Cancelled',
    color: 'bg-rose-100 text-rose-700 border border-rose-200'
  },
  COMPLETED: {
    label: 'Completed',
    color: 'bg-emerald-100 text-emerald-700 border border-emerald-200'
  }
};

export interface Request {
  id: string;
  title: string;
  asset_category: string;
  status: RequestStatus;
  total_cost: number;
  created_at: string;
  created_by: string;
  approved_at?: string;
  approved_by?: string;
  creator?: {
    role: string;
  };
  approver?: {
    role: string;
  };
}

