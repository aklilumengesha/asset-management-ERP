import { NavGroup } from "../NavGroup";
import { NavItem } from "../NavItem";
import { useNavigationMenu } from "@/hooks/useNavigationMenu";
import { getIcon } from "@/utils/iconMapper";

interface ProcurementSectionProps {
  currentPath: string;
}

export function ProcurementSection({ currentPath }: ProcurementSectionProps) {
  const { groups, getItemsForGroup } = useNavigationMenu();
  
  // Find the Procurement group
  const procurementGroup = groups.find(g => g.name === 'Procurement');
  
  // If no procurement group or user doesn't have access, don't render
  if (!procurementGroup) {
    return null;
  }

  // Get items for this group
  const items = getItemsForGroup(procurementGroup.id);
  
  if (items.length === 0) {
    return null;
  }

  const GroupIcon = getIcon(procurementGroup.icon);
  const isProcurementRoute = currentPath.startsWith('/requests') || 
                             currentPath.startsWith('/purchase-orders') ||
                             currentPath.startsWith('/grn');
  
  return (
    <NavGroup 
      title={procurementGroup.name}
      icon={GroupIcon}
      defaultOpen={isProcurementRoute}
    >
      {items.map((item) => {
        const ItemIcon = item.icon ? getIcon(item.icon) : null;
        
        return (
          <NavItem 
            key={item.id}
            href={item.path}
            depth={item.depth}
          >
            {ItemIcon && <ItemIcon className="h-4 w-4 mr-2" />}
            {item.label}
          </NavItem>
        );
      })}
    </NavGroup>
  );
}
