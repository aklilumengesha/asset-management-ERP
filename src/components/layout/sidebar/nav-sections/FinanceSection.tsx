
import { WalletIcon } from "lucide-react";
import { NavGroup } from "../NavGroup";
import { NavItem } from "../NavItem";
import { useRole } from "@/hooks/useRole";

interface FinanceSectionProps {
  currentPath: string;
}

export function FinanceSection({ currentPath }: FinanceSectionProps) {
  const { isSuperAdmin, isFinanceManager } = useRole();
  const isFinanceRoute = currentPath.startsWith('/admin/finance');
  
  // Only Super Admin and Finance Manager can see Finance section
  if (!isSuperAdmin() && !isFinanceManager()) {
    return null;
  }
  
  return (
    <NavGroup 
      title="Finance" 
      icon={WalletIcon}
      defaultOpen={isFinanceRoute}
    >
      <NavItem 
        href="/admin/finance/depreciation-setup" 
        depth={1}
      >
        Depreciation Setup
      </NavItem>
      <NavItem 
        href="/admin/finance/depreciation-schedule" 
        depth={1}
      >
        Depreciation Schedules
      </NavItem>
      <NavItem 
        href="/admin/finance/impairment-revaluation" 
        depth={1}
      >
        Revaluation/Impairment
      </NavItem>
      <NavItem 
        href="/admin/finance/erp-integration" 
        depth={1}
      >
        ERP Integration
      </NavItem>
    </NavGroup>
  );
}
