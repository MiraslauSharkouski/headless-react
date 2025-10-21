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
}

export interface MenuContextType extends MenuState {
  isMobile: boolean;
  toggleExpand: () => void;
  setActiveItem: (id: string) => void;
  toggleSubmenu: (id: string) => void;
}
