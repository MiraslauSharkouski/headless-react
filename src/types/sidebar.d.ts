export interface SidebarItemProps {
  icon: React.ReactNode;
  label?: string;
  isActive?: boolean;
  isExpanded?: boolean;
  hasSubmenu?: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export interface SidebarMenuContextType {
  isCollapsed: boolean;
  toggleCollapse: () => void;
  activeItemId: string | null;
  setActiveItemId: (id: string | null) => void;
  expandedItems: Set<string>;
  toggleExpanded: (id: string) => void;
  isMobile: boolean;
}

export type SidebarMenuItemType = "item" | "submenu";
