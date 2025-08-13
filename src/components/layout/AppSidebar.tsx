import { useState } from "react";
import { useLocation, NavLink } from "react-router-dom";
import { 
  Home, 
  Activity, 
  Settings, 
  Terminal, 
  Users, 
  FileText, 
  Shield,
  HardDrive,
  Network
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const navigationItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Monitoring", url: "/monitoring", icon: Activity },
  { title: "Terminal", url: "/terminal", icon: Terminal },
  { title: "Services", url: "/services", icon: Settings },
  { title: "Users", url: "/users", icon: Users },
  { title: "Storage", url: "/storage", icon: HardDrive },
  { title: "Network", url: "/network", icon: Network },
  { title: "Security", url: "/security", icon: Shield },
  { title: "Logs", url: "/logs", icon: FileText },
];

export function AppSidebar() {
  const { collapsed } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  return (
    <Sidebar
      className={collapsed ? "w-16" : "w-64"}
      collapsible
    >
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-primary">
            <Terminal className="h-5 w-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div>
              <div className="font-semibold text-sidebar-foreground">Ubuntu Console</div>
              <div className="text-xs text-sidebar-foreground/60">Web Management</div>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup defaultOpen>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    variant={isActive(item.url) ? "active" : "default"}
                  >
                    <NavLink 
                      to={item.url} 
                      className="flex items-center gap-3"
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
            <Users className="h-4 w-4" />
          </div>
          {!collapsed && (
            <div className="flex-1">
              <div className="text-sm font-medium text-sidebar-foreground">admin</div>
              <div className="text-xs text-sidebar-foreground/60">System Administrator</div>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}