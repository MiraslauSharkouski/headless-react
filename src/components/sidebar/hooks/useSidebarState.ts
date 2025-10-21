import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import type { SidebarMenuContextType } from "../../../types/sidebar";
import { useMediaQuery } from "./useMediaQuery";

const SidebarMenuContext = createContext<SidebarMenuContextType | undefined>(
  undefined
);

/**
 * Провайдер состояния меню
 */
export const SidebarMenuProvider: React.FC<{
  children: React.ReactNode;
  initialCollapsed?: boolean;
  initialActiveItemId?: string | null;
  onActiveChange?: (id: string | null) => void;
}> = ({
  children,
  initialCollapsed = false,
  initialActiveItemId = null,
  onActiveChange,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(initialCollapsed);
  const [activeItemId, setActiveItemId] = useState<string | null>(
    initialActiveItemId
  );
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const isMobile = useMediaQuery("(max-width: 768px)");

  const toggleCollapse = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  const toggleExpanded = useCallback((id: string) => {
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

  const setActiveItemIdCallback = useCallback(
    (id: string | null) => {
      setActiveItemId(id);
      if (onActiveChange) {
        onActiveChange(id);
      }
    },
    [onActiveChange]
  );

  const contextValue = useMemo(
    () => ({
      isCollapsed,
      toggleCollapse,
      activeItemId,
      setActiveItemId: setActiveItemIdCallback,
      expandedItems,
      toggleExpanded,
      isMobile,
    }),
    [
      isCollapsed,
      toggleCollapse,
      activeItemId,
      setActiveItemIdCallback,
      expandedItems,
      toggleExpanded,
      isMobile,
    ]
  );

  return (
    <SidebarMenuContext.Provider value={contextValue}>
      {children}
    </SidebarMenuContext.Provider>
  );
};

/**
 * Хук для доступа к состоянию меню
 */
export const useSidebarMenu = (): SidebarMenuContextType => {
  const context = useContext(SidebarMenuContext);
  if (!context) {
    throw new Error("useSidebarMenu must be used within a SidebarMenuProvider");
  }
  return context;
};
