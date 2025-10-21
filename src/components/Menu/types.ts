// Типы для компонентов меню

export interface MenuItemProps {
  id: string;
  icon: React.ReactNode;
  label: string;
  hasSubmenu?: boolean;
  submenuItems?: MenuItemProps[];
  onClick?: () => void;
}

export interface MenuState {
  isExpanded: boolean;
  activeItemId: string | null;
  expandedItems: Set<string>;
  isMobile: boolean;
}

export interface MenuContextType extends MenuState {
  toggleExpand: () => void;
  setActiveItem: (id: string) => void;
  toggleSubmenu: (id: string) => void;
  onResize: () => void;
}
