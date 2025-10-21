import { useState, useCallback } from "react";
import { MenuState } from "../components/Menu/types";

/**
 * Props for the useMenuState hook
 */
interface UseMenuStateProps {
  defaultExpanded?: boolean;
  defaultActiveId?: string | null;
  defaultExpandedItems?: string[];
}

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
 * @returns Menu state and methods to update it
 */
export const useMenuState = ({
  defaultExpanded = true,
  defaultActiveId = null,
  defaultExpandedItems = [],
}: UseMenuStateProps = {}): MenuState & {
  toggleExpand: () => void;
  setActiveItem: (id: string) => void;
  toggleSubmenu: (id: string) => void;
  setHoveredItem: (id: string | null) => void;
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

  // State for tracking the currently hovered menu item
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);

  // Toggle the main menu expansion state
  const toggleExpand = useCallback(() => {
    setIsExpanded((prev) => !prev);
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

  return {
    isExpanded,
    activeItemId,
    expandedItems,
    hoveredItemId,
    toggleExpand,
    setActiveItem,
    toggleSubmenu,
    setHoveredItem,
  };
};
