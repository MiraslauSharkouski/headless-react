import { useState, useCallback } from "react";

interface UseMenuStateProps {
  defaultExpanded?: boolean;
  defaultActiveId?: string | null;
  defaultExpandedItems?: string[];
}

export const useMenuState = ({
  defaultExpanded = true,
  defaultActiveId = null,
  defaultExpandedItems = [],
}: UseMenuStateProps = {}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [activeItemId, setActiveItemId] = useState<string | null>(
    defaultActiveId
  );
  const [expandedItems, setExpandedItems] = useState<Set<string>>(
    new Set(defaultExpandedItems)
  );

  const toggleExpand = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const setActiveItem = useCallback((id: string) => {
    setActiveItemId(id);
  }, []);

  const toggleSubmenu = useCallback((id: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  return {
    isExpanded,
    activeItemId,
    expandedItems,
    toggleExpand,
    setActiveItem,
    toggleSubmenu,
  };
};
