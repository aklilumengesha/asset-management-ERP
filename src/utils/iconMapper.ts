import {
  Settings,
  Users2,
  ShieldCheck,
  Building2,
  Link2,
  Building,
  History,
  GitBranch,
  Tag,
  WalletIcon,
  BoxIcon,
  ClipboardList,
  WrenchIcon,
  Trash2,
  DollarSign,
  FileText,
  ShoppingCart,
  PackageCheck,
  HelpCircle
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';

// Map of icon names to Lucide icon components
const iconMap: Record<string, LucideIcon> = {
  Settings,
  Users2,
  ShieldCheck,
  Building2,
  Link2,
  Building,
  History,
  GitBranch,
  Tag,
  WalletIcon,
  BoxIcon,
  ClipboardList,
  WrenchIcon,
  Trash2,
  DollarSign,
  FileText,
  ShoppingCart,
  PackageCheck,
  HelpCircle
};

/**
 * Get a Lucide icon component by name
 * @param iconName - The name of the icon (e.g., "Settings", "Users2")
 * @returns The Lucide icon component, or HelpCircle if not found
 */
export function getIcon(iconName: string | null | undefined): LucideIcon {
  if (!iconName) {
    return HelpCircle;
  }
  
  return iconMap[iconName] || HelpCircle;
}

/**
 * Check if an icon name exists in the map
 * @param iconName - The name of the icon to check
 * @returns true if the icon exists, false otherwise
 */
export function hasIcon(iconName: string | null | undefined): boolean {
  if (!iconName) return false;
  return iconName in iconMap;
}

/**
 * Get all available icon names
 * @returns Array of all icon names in the map
 */
export function getAvailableIcons(): string[] {
  return Object.keys(iconMap);
}
