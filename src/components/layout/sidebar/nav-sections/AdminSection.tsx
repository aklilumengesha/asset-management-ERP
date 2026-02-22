import { NavGroup } from "../NavGroup";
import { NavItem } from "../NavItem";
import { useNavigationMenu } from "@/hooks/useNavigationMenu";
import { getIcon } from "@/utils/iconMapper";

interface AdminSectionProps {
  currentPath: string;
}

export function AdminSection({ currentPath }: AdminSectionProps) {
  const { groups, getItemsForGroup, loading } = useNavigationMenu();
  
  // Find the Admin group
  const adminGroup = groups.find(g => g.name === 'Admin');
  
  // If no admin group or user doesn't have access, don't render
  if (!adminGroup) {
    return null;
  }

  // Get items for this group
  const items = getItemsForGroup(adminGroup.id);
  
  if (items.length === 0) {
    return null;
  }

  const GroupIcon = getIcon(adminGroup.icon);

  return (
    <NavGroup 
      title={adminGroup.name}
      icon={GroupIcon}
      defaultOpen={currentPath.startsWith("/admin")}
    >
      {items.map((item) => {
        const ItemIcon = item.icon ? getIcon(item.icon) : null;
        
        return (
          <NavItem 
            key={item.id}
            href={item.path}
            isActive={currentPath === item.path}
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
