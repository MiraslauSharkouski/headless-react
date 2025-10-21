import React, { useMemo, useEffect } from "react";
import MenuContext from "../../context/MenuContext";
import { useMenuState } from "../../hooks/useMenuState";
import { useIsMobile } from "../../hooks/useIsMobile";
import { MenuContextType } from "./types";

interface MenuProps {
  children: React.ReactNode;
  defaultExpanded?: boolean;
  defaultActiveId?: string | null;
  defaultExpandedItems?: string[];
  onExpandChange?: (isExpanded: boolean) => void;
  onActiveItemChange?: (id: string) => void;
}

const Menu: React.FC<MenuProps> = ({
  children,
  defaultExpanded,
  defaultActiveId,
  defaultExpandedItems,
  onExpandChange,
  onActiveItemChange,
}) => {
  const isMobile = useIsMobile();
  const menuState = useMenuState({
    defaultExpanded,
    defaultActiveId,
    defaultExpandedItems,
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
      onResize: () => {}, // Placeholder - resize handled by useIsMobile
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
