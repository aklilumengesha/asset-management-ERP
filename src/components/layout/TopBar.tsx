
import { Menu, Bell, Settings, User, Plus, Package, LogOut, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate, useLocation } from "react-router-dom";
import { useRole } from "@/hooks/useRole";
import { authService } from "@/services/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useRoleDisplay } from "@/hooks/useRoleDisplay";

interface TopBarProps {
  onMenuClick: () => void;
  scrolled: boolean;
  onCreateRequest?: () => void;
}

export function TopBar({ onMenuClick, scrolled, onCreateRequest }: TopBarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, role, loading } = useRole();
  const { getRoleDisplayName, getRoleBadgeColor } = useRoleDisplay();
  
  const isAssetsPage = location.pathname.startsWith('/assets');
  
  const handleCreateAsset = () => {
    navigate('/assets/create-from-po');
  };

  const handleLogout = async () => {
    await authService.logout();
    navigate('/login');
  };

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full border-b backdrop-blur-sm transition-all duration-200",
      scrolled 
        ? "bg-white/95 shadow-sm" 
        : "bg-background/95 supports-[backdrop-filter]:bg-background/60"
    )}>
      <div className="flex h-16 items-center gap-4 px-4 md:px-6">
        <Button 
          variant="ghost" 
          size="icon" 
          className="lg:hidden hover:bg-primary/10" 
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
        
        <div className="flex items-center">
          <span className="ml-2 text-lg font-semibold">Asseter</span>
        </div>
        
        <div className="flex-1" />
        
        <div className="flex items-center gap-4">
          {onCreateRequest && (
            <Button 
              onClick={onCreateRequest}
              className="hidden md:flex items-center gap-2 rounded-full shadow-sm"
              variant="default"
            >
              <Plus className="h-4 w-4" />
              New Request
            </Button>
          )}
          
          {isAssetsPage && (
            <Button 
              onClick={handleCreateAsset}
              className="hidden md:flex items-center gap-2 rounded-full shadow-sm"
              variant="default"
            >
              <Package className="h-4 w-4" />
              Create Asset
            </Button>
          )}
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative hover:bg-primary/10 rounded-full"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full" />
            <span className="sr-only">Notifications</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="hover:bg-primary/10 rounded-full"
            onClick={() => navigate('/profile')}
          >
            <Settings className="h-5 w-5" />
            <span className="sr-only">Settings</span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="hover:bg-primary/10 rounded-full h-auto px-3 py-2"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div className="hidden md:flex flex-col items-start">
                    <span className="text-sm font-medium">
                      {loading ? 'Loading...' : `${profile?.first_name || 'User'} ${profile?.last_name || ''}`}
                    </span>
                    <Badge 
                      variant="secondary" 
                      className={cn("text-xs font-normal", getRoleBadgeColor(role))}
                    >
                      {getRoleDisplayName(role)}
                    </Badge>
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">
                    {profile?.first_name} {profile?.last_name}
                  </p>
                  <p className="text-xs text-muted-foreground">{profile?.email}</p>
                  <Badge 
                    variant="secondary" 
                    className={cn("text-xs w-fit mt-1", getRoleBadgeColor(role))}
                  >
                    {getRoleDisplayName(role)}
                  </Badge>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                <UserCircle className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
