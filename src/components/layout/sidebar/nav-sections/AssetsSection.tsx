
import { BoxIcon, ClipboardList, WrenchIcon, Trash2, DollarSign } from "lucide-react";
import { NavItem } from "../NavItem";
import { NavGroup } from "../NavGroup";
import { useRole } from "@/hooks/useRole";

interface AssetsSectionProps {
  currentPath: string;
}

export function AssetsSection({ currentPath }: AssetsSectionProps) {
  const { role, isSuperAdmin, isAssetManager } = useRole();
  const isAssetsActive = currentPath.startsWith("/assets") || 
                         currentPath === "/maintenance" || 
                         currentPath === "/vendors";

  // Employee can only see Asset List and Request
  const canSeeMaintenanceAndDisposal = role !== 'employee';
  const canSeeVendors = isSuperAdmin() || isAssetManager() || role === 'procurement_manager';

  return (
    <div className="space-y-1">
      <NavGroup 
        title="Assets" 
        defaultOpen={isAssetsActive}
        icon={BoxIcon}
      >
        <NavItem 
          href="/assets" 
          depth={1}
        >
          <BoxIcon className="h-4 w-4 mr-2" />
          Asset List
        </NavItem>
        
        <NavItem 
          href="/assets/request" 
          depth={1}
        >
          <ClipboardList className="h-4 w-4 mr-2" />
          Request
        </NavItem>
        
        {canSeeMaintenanceAndDisposal && (
          <>
            <NavItem 
              href="/maintenance" 
              depth={1}
            >
              <WrenchIcon className="h-4 w-4 mr-2" />
              Maintenance
            </NavItem>
            
            <NavItem 
              href="/assets/disposal" 
              depth={1}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Disposal
            </NavItem>
            
            <NavItem 
              href="/assets/capitalisation" 
              depth={1}
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Capitalisation
            </NavItem>
          </>
        )}
        
        {canSeeVendors && (
          <NavItem 
            href="/vendors" 
            depth={1}
          >
            <BoxIcon className="h-4 w-4 mr-2" />
            Vendors
          </NavItem>
        )}
      </NavGroup>
    </div>
  );
}
