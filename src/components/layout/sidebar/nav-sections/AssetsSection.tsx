import { NavItem } from "../NavItem";
import { NavGroup } from "../NavGroup";
import { useNavigationMenu } from "@/hooks/useNavigationMenu";
import { getIcon } from "@/utils/iconMapper";

interface AssetsSectionProps {
  currentPath: string;
}

export function AssetsSection({ currentPath }: AssetsSectionProps) {
  const { groups, getItemsForGroup } = useNavigationMenu();
  
  // Find the Assets group
  const assetsGroup = groups.find(g => g.name === 'Assets');
  
  // If no assets group or user doesn't have access, don't render
  if (!assetsGroup) {
    return null;
  }

  // Get items for this group
  const items = getItemsForGroup(assetsGroup.id);
  
  if (items.length === 0) {
    return null;
  }

  const GroupIcon = getIcon(assetsGroup.icon);
  const isAssetsActive = currentPath.startsWith("/assets") || 
                         currentPath === "/maintenance" || 
                         currentPath === "/vendors";

  return (
    <div className="space-y-1">
      <NavGroup 
        title={assetsGroup.name}
        defaultOpen={isAssetsActive}
        icon={GroupIcon}
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
    </div>
  );
}
