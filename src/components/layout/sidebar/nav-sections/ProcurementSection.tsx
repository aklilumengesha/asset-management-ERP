
import { FileTextIcon } from "lucide-react";
import { NavGroup } from "../NavGroup";
import { NavItem } from "../NavItem";
import { useRole } from "@/hooks/useRole";

interface ProcurementSectionProps {
  currentPath: string;
}

export function ProcurementSection({ currentPath }: ProcurementSectionProps) {
  const { role } = useRole();
  const isProcurementRoute = currentPath.startsWith('/requests') || currentPath.startsWith('/purchase-orders');
  
  // Employee can only see Requests, not Purchase Orders
  const canSeePurchaseOrders = role !== 'employee';
  
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
    </NavGroup>
  );
}
