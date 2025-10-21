import React, { useMemo, useEffect } from "react";
import MenuContext from "../../context/MenuContext";
import { useMenuState } from "../../hooks/useMenuState";
import { useIsMobile } from "../../hooks/useIsMobile";
import { MenuContextType, MenuItemProps } from "./types";

interface MenuProps {
  children: React.ReactNode;
  defaultExpanded?: boolean;
  defaultActiveId?: string | null;
  defaultExpandedItems?: string[];
  menuItems?: MenuItemProps[]; // Added to pass menu structure to hook
  onExpandChange?: (isExpanded: boolean) => void;
  onActiveItemChange?: (id: string) => void;
}

const Menu: React.FC<MenuProps> = ({
  children,
  defaultExpanded,
  defaultActiveId,
  defaultExpandedItems,
  menuItems = [],
  onExpandChange,
  onActiveItemChange,
}) => {
  const isMobile = useIsMobile();
  const menuState = useMenuState({
    defaultExpanded,
    defaultActiveId,
    defaultExpandedItems,
    menuItems, // Pass the menu items to the hook
  });

  // Sync internal state changes with external callbacks
  useEffect(() => {
    if (onExpandChange) {
      onExpandChange(menuState.isExpanded);
    }
  }, [menuState.isExpanded, onExpandChange]);

  useEffect(() => {
    if (onActiveItemChange && menuState.activeItemId) {
      onActiveItemChange(menuState.activeItemId);
    }
  }, [menuState.activeItemId, onActiveItemChange]);

  const contextValue = useMemo<MenuContextType>(
    () => ({
      ...menuState,
      isMobile,
      toggleExpand: menuState.toggleExpand,
      setActiveItem: menuState.setActiveItem,
      toggleSubmenu: menuState.toggleSubmenu,
      setHoveredItem: menuState.setHoveredItem,
      getMenuParentId: menuState.getMenuParentId, // Add the new function to context
    }),
    [menuState, isMobile]
  );

  return (
    <MenuContext.Provider value={contextValue}>
      <nav className="menu" role="navigation" aria-label="Main navigation">
        {children}
      </nav>
    </MenuContext.Provider>
  );
};

export default Menu;
