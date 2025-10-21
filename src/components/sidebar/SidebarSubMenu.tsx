import React, { FC } from "react";
import { useSidebarMenu } from "./hooks/useSidebarState";

/**
 * Компонент подменю.
 * Отображается только если родительский пункт раскрыт.
 * Визуализация — на усмотрение потребителя.
 */
export const SidebarSubMenu: FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { isCollapsed, isMobile } = useSidebarMenu();

  // На мобильных устройствах подменю всегда показывается как отдельный блок (не всплывающее)
  // Но в нашем случае мы просто не скрываем его, если родитель раскрыт
  return (
    <div
      className={`transition-all duration-200 ${
        isCollapsed && !isMobile ? "hidden" : ""
      }`}
    >
      {children}
    </div>
  );
};
