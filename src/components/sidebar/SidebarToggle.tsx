import { type FC } from "react";
import { useSidebarMenu } from "./hooks/useSidebarState";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Кнопка переключения режима меню (свернуть/развернуть).
 * Визуализация делегирована потребителю.
 */
export const SidebarToggle: FC = () => {
  const { isCollapsed, toggleCollapse, isMobile } = useSidebarMenu();

  // На мобильных устройствах кнопка не нужна — меню всегда свернуто
  if (isMobile) return null;

  return (
    <button
      onClick={toggleCollapse}
      aria-label={isCollapsed ? "Развернуть меню" : "Свернуть меню"}
      className="flex items-center justify-center p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
    </button>
  );
};
