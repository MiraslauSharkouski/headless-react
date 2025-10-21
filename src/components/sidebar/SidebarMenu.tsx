import React, { FC, ReactNode } from "react";
import { SidebarMenuProvider } from "./hooks/useSidebarState";

/**
 * Headless компонент бокового меню.
 * Управляет состоянием: свернуто/развернуто, активный пункт, раскрытые подменю.
 * Визуализация полностью делегирована потребителю.
 */
export const SidebarMenu: FC<{
  children: ReactNode;
  initialCollapsed?: boolean;
  initialActiveItemId?: string | null;
  onActiveChange?: (id: string | null) => void;
}> = ({ children, initialCollapsed, initialActiveItemId, onActiveChange }) => {
  return (
    <SidebarMenuProvider
      initialCollapsed={initialCollapsed}
      initialActiveItemId={initialActiveItemId}
      onActiveChange={onActiveChange}
    >
      {children}
    </SidebarMenuProvider>
  );
};
