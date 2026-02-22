import { NavGroup } from "../NavGroup";
import { NavItem } from "../NavItem";
import { useNavigationMenu } from "@/hooks/useNavigationMenu";
import { getIcon } from "@/utils/iconMapper";

interface FinanceSectionProps {
  currentPath: string;
}

export function FinanceSection({ currentPath }: FinanceSectionProps) {
  const { groups, getItemsForGroup } = useNavigationMenu();
  
  // Find the Finance group
  const financeGroup = groups.find(g => g.name === 'Finance');
  
  // If no finance group or user doesn't have access, don't render
  if (!financeGroup) {
    return null;
  }

  // Get items for this group
  const items = getItemsForGroup(financeGroup.id);
  
  if (items.length === 0) {
    return null;
  }

  const GroupIcon = getIcon(financeGroup.icon);
  const isFinanceRoute = currentPath.startsWith('/admin/finance');
  
  return (
    <NavGroup 
      title={financeGroup.name}
      icon={GroupIcon}
      defaultOpen={isFinanceRoute}
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
