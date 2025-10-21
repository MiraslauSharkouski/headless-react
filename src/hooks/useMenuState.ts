import { useState, useCallback, useEffect, useRef } from "react";
import { MenuState, MenuItemProps } from "../components/Menu/types";

/**
 * Props for the useMenuState hook
 */
interface UseMenuStateProps {
  defaultExpanded?: boolean;
  defaultActiveId?: string | null;
  defaultExpandedItems?: string[];
  menuItems?: MenuItemProps[]; // Added to help find parent submenus
}

/**
 * Find the parent ID of an active item in the menu structure
 */
const findParentId = (
  menuItems: MenuItemProps[],
  activeId: string
): string | null => {
  for (const item of menuItems) {
    if (item.submenuItems) {
      for (const subItem of item.submenuItems) {
        if (subItem.id === activeId) {
          return item.id;
        }
        // Recursively search nested submenus
        const nestedParentId = findParentId(
          [{ ...subItem, submenuItems: subItem.submenuItems || [] }],
          activeId
        );
        if (nestedParentId) return nestedParentId;
      }
    }
  }
  return null;
};

/**
 * Custom hook to manage menu state
 *
 * This hook handles all internal state logic for the menu component including:
 * - Expansion state of the menu
 * - Active item tracking
 * - Submenu expansion state
 * - Methods to update the state
 *
 * @param defaultExpanded Whether the menu should be expanded by default
 * @param defaultActiveId The ID of the initially active item
 * @param defaultExpandedItems Array of submenu IDs that should be expanded by default
 * @param menuItems The menu items structure to help find parent submenus when expanding
 * @returns Menu state and methods to update it
 */
export const useMenuState = ({
  defaultExpanded = true,
  defaultActiveId = null,
  defaultExpandedItems = [],
  menuItems = [],
}: UseMenuStateProps = {}): MenuState & {
  toggleExpand: (parentIdToExpand?: string) => void; // Modified to accept parent ID to expand
  setActiveItem: (id: string) => void;
  toggleSubmenu: (id: string) => void;
  setHoveredItem: (id: string | null) => void;
  getMenuParentId: (activeId: string) => string | null; // Added function to find parent ID
} => {
  // State for whether the menu is expanded or collapsed
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  // State for tracking the currently active menu item
  const [activeItemId, setActiveItemId] = useState<string | null>(
    defaultActiveId
  );

  // State for tracking which submenus are expanded (using Set for efficient operations)
  const [expandedItems, setExpandedItems] = useState<Set<string>>(
    new Set(defaultExpandedItems)
  );

  // Refs to track previous values
  const prevIsExpanded = useRef(isExpanded);
  const prevActiveItemId = useRef(activeItemId);

  // State for tracking the currently hovered menu item
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);

  // Store menuItems in a ref so they're accessible to findParentId
  const menuItemsRef = useRef<MenuItemProps[]>(menuItems);
  useEffect(() => {
    menuItemsRef.current = menuItems;
  }, [menuItems]);

  // Effect to handle expanding parent submenu when menu expands and there's an active submenu item
  useEffect(() => {
    // Check if menu expanded from collapsed state
    if (isExpanded && !prevIsExpanded.current) {
      // Check if there's an active item and it has a parent submenu
      if (activeItemId) {
        const parentId = findParentId(menuItemsRef.current, activeItemId);
        if (parentId) {
          // Expand only the parent submenu to show the active item, closing all others
          setExpandedItems(() => {
            const newSet = new Set<string>();
            newSet.add(parentId);
            return newSet;
          });
        }
      } else {
        // If no active item, clear all expanded items
        setExpandedItems(new Set<string>());
      }
    }

    // Update previous values
    prevIsExpanded.current = isExpanded;
    prevActiveItemId.current = activeItemId;
  }, [isExpanded, activeItemId, menuItems]);

  // Toggle the main menu expansion state
  const toggleExpand = useCallback((parentIdToExpand?: string) => {
    setIsExpanded((prev) => {
      const newExpandedState = !prev;
      // If we're expanding the menu and there's a parent ID to expand, set it as the only expanded submenu
      if (newExpandedState && parentIdToExpand) {
        setExpandedItems(() => {
          const newSet = new Set<string>();
          newSet.add(parentIdToExpand);
          return newSet;
        });
      } else if (!newExpandedState) {
        // When collapsing the menu, clear all expanded submenus
        setExpandedItems(new Set<string>());
      }
      return newExpandedState;
    });
  }, []);

  // Set the active menu item by ID
  const setActiveItem = useCallback((id: string) => {
    setActiveItemId(id);
  }, []);

  // Toggle a submenu's expanded state
  const toggleSubmenu = useCallback((id: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        // Если подменю уже открыто, просто закрываем его
        newSet.delete(id);
      } else {
        // Если подменю закрыто, открываем его и закрываем все остальные
        newSet.clear(); // Закрываем все открытые подменю
        newSet.add(id); // Открываем только выбранное подменю
      }
      return newSet;
    });
  }, []);

  // Set the hovered menu item by ID
  const setHoveredItem = useCallback((id: string | null) => {
    setHoveredItemId(id);
  }, []);

  // Function to get parent ID of an active item
  const getMenuParentId = useCallback((activeId: string): string | null => {
    return findParentId(menuItemsRef.current, activeId);
  }, []);

  return {
    isExpanded,
    activeItemId,
    expandedItems,
    hoveredItemId,
    toggleExpand,
    setActiveItem,
    toggleSubmenu,
    setHoveredItem,
    getMenuParentId,
  };
};
