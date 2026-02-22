import { NavGroup } from "../NavGroup";
import { NavItem } from "../NavItem";
import { useNavigationMenu } from "@/hooks/useNavigationMenu";
import { getIcon } from "@/utils/iconMapper";

interface ReportsSectionProps {
  currentPath: string;
}

export function ReportsSection({ currentPath }: ReportsSectionProps) {
  const { groups, getItemsForGroup } = useNavigationMenu();
  
  // Find the Reports group
  const reportsGroup = groups.find(g => g.name === 'Reports');
  
  // If no reports group or user doesn't have access, don't render
  if (!reportsGroup) {
    return null;
  }

  // Get items for this group
  const items = getItemsForGroup(reportsGroup.id);
  
  if (items.length === 0) {
    return null;
  }

  const GroupIcon = getIcon(reportsGroup.icon);
  
  return (
    <NavGroup 
      title={reportsGroup.name}
      icon={GroupIcon}
      defaultOpen={currentPath.startsWith("/reports")}
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
