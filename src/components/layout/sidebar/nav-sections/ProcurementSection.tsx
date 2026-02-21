
import { FileTextIcon } from "lucide-react";
import { NavGroup } from "../NavGroup";
import { NavItem } from "../NavItem";
import { useRole } from "@/hooks/useRole";

interface ProcurementSectionProps {
  currentPath: string;
}

export function ProcurementSection({ currentPath }: ProcurementSectionProps) {
  const { role, isSuperAdmin, isProcurementManager } = useRole();
  const isProcurementRoute = currentPath.startsWith('/requests') || 
                             currentPath.startsWith('/purchase-orders') ||
                             currentPath.startsWith('/grn');
  
  // Employee can only see Requests
  const canSeePurchaseOrders = role !== 'employee';
  // Only Super Admin and Procurement Manager can see GRN
  const canSeeGRN = isSuperAdmin() || isProcurementManager();
  
  return (
    <NavGroup 
      title="Procurement" 
      icon={FileTextIcon}
      defaultOpen={isProcurementRoute}
    >
      <NavItem 
        href="/requests" 
        depth={1}
      >
        Requests
      </NavItem>
      {canSeePurchaseOrders && (
        <NavItem 
          href="/purchase-orders" 
          depth={1}
        >
          Purchase Orders
        </NavItem>
      )}
      {canSeeGRN && (
        <NavItem 
          href="/grn" 
          depth={1}
        >
          Goods Receipt Notes
        </NavItem>
      )}
    </NavGroup>
  );
}
