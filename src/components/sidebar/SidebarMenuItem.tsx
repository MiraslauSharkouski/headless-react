import React, { FC, useCallback, useMemo } from "react";
import { useSidebarMenu } from "./hooks/useSidebarState";
import { SidebarItemProps } from "../../types/sidebar";

/**
 * Компонент пункта меню.
 * Может содержать подменю, управляется извне через isActive, onClick и т.д.
 */
export const SidebarMenuItem: FC<
  SidebarItemProps & {
    id: string;
    children?: React.ReactNode;
  }
> = ({
  id,
  icon,
  label,
  isActive = false,
  isExpanded = false,
  hasSubmenu = false,
  onClick,
  onMouseEnter,
  onMouseLeave,
  children,
}) => {
  const {
    isCollapsed,
    isMobile,
    toggleExpanded,
    expandedItems,
    setActiveItemId,
  } = useSidebarMenu();

  const isParentActive = useMemo(() => {
    // Если есть подменю и один из его пунктов активен — родитель тоже активен
    if (hasSubmenu && children) {
      const childItems = React.Children.toArray(children).filter(
        (child): child is React.ReactElement => React.isValidElement(child)
      );
      return childItems.some((child) => child.props.isActive);
    }
    return false;
  }, [hasSubmenu, children, isActive]);

  const handleToggleExpand = useCallback(() => {
    if (hasSubmenu) {
      toggleExpanded(id);
    }
  }, [hasSubmenu, id, toggleExpanded]);

  const handleClick = useCallback(() => {
    setActiveItemId(id);
    onClick?.();
    if (hasSubmenu) {
      handleToggleExpand();
    }
  }, [id, onClick, hasSubmenu, handleToggleExpand, setActiveItemId]);

  const handleMouseEnter = useCallback(() => {
    if (hasSubmenu && !isMobile) {
      toggleExpanded(id);
    }
    onMouseEnter?.();
  }, [hasSubmenu, isMobile, id, toggleExpanded, onMouseEnter]);

  const handleMouseLeave = useCallback(() => {
    if (hasSubmenu && !isMobile) {
      toggleExpanded(id);
    }
    onMouseLeave?.();
  }, [hasSubmenu, isMobile, id, toggleExpanded, onMouseLeave]);

  const isExpandedNow = expandedItems.has(id);

  return (
    <div
      role="menuitem"
      aria-haspopup={hasSubmenu ? "true" : undefined}
      aria-expanded={hasSubmenu ? isExpandedNow : undefined}
      aria-current={isActive || isParentActive ? "page" : undefined}
      className="relative"
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {/* Визуализация делегируется потребителю */}
      {children ? (
        <div>
          {icon}
          {!isCollapsed && label && <span>{label}</span>}
        </div>
      ) : (
        <>
          {icon}
          {!isCollapsed && label && <span>{label}</span>}
        </>
      )}
      {hasSubmenu && (
        <div
          className={`absolute left-full top-0 ml-2 transition-opacity duration-200 ${
            isExpandedNow ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          {children}
        </div>
      )}
    </div>
  );
};
