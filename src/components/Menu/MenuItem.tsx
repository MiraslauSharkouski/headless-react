import { useState, useRef, useEffect } from "react";
import { useMenu } from "../../context/MenuContext";
import SubMenu from "./SubMenu";
import { MenuItemProps } from "./types";

interface MenuItemComponentProps extends MenuItemProps {}

const MenuItem: React.FC<MenuItemComponentProps> = ({
  id,
  icon,
  label,
  hasSubmenu = false,
  submenuItems = [],
  onClick,
}) => {
  const [isSubmenuHovered, setIsSubmenuHovered] = useState(false);

  // Рефы для хранения таймеров
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Функция для очистки предыдущих таймеров
  const clearTimers = () => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    if (showTimerRef.current) {
      clearTimeout(showTimerRef.current);
      showTimerRef.current = null;
    }
  };

  const {
    isExpanded,
    activeItemId,
    expandedItems,
    hoveredItemId,
    setActiveItem,
    toggleSubmenu,
    setHoveredItem,
    isMobile,
    toggleExpand,
    getMenuParentId,
  } = useMenu();

  // Определяем, находится ли текущий элемент в состоянии hover
  const isHovered = hoveredItemId === id;

  const isActive = activeItemId === id;
  const isExpandedSubmenu = expandedItems.has(id);

  // For handling submenu display on hover in collapsed state
  const [showSubmenuTooltip, setShowSubmenuTooltip] = useState(false);

  // Закрытие тултипа при клике вне его области
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const tooltipElement = document.querySelector(
        `[data-tooltip-id="${id}"]`
      );

      // Проверяем, находится ли клик вне тултипа и вне основного элемента меню
      if (
        showSubmenuTooltip &&
        tooltipElement &&
        !tooltipElement.contains(target)
      ) {
        const menuItemElement = document.getElementById(`menu-item-${id}`);
        if (menuItemElement && !menuItemElement.contains(target)) {
          setShowSubmenuTooltip(false);
          setHoveredItem(null);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSubmenuTooltip, id]);

  const handleMouseEnter = () => {
    // Очищаем все таймеры, чтобы предотвратить конфликты
    clearTimers();

    // Если наводим на другой элемент, а другое подменю открыто, сразу скрываем его
    if (hoveredItemId && hoveredItemId !== id) {
      setShowSubmenuTooltip(false);
    }

    setHoveredItem(id);
    setIsSubmenuHovered(false); // Сброс состояния при наведении на основной элемент

    if (hasSubmenu && !isExpanded) {
      // Отменяем предыдущий таймер показа, если он был
      if (showTimerRef.current) {
        clearTimeout(showTimerRef.current);
      }

      // Delay showing submenu to prevent flickering
      showTimerRef.current = setTimeout(() => {
        setShowSubmenuTooltip(true);
      }, 300);
    }
  };

  const handleMouseLeave = () => {
    // Delay hiding submenu to allow for movement to submenu
    clearTimers(); // Очищаем предыдущие таймеры
    hideTimerRef.current = setTimeout(() => {
      // Проверяем, не находится ли мышь на подменю
      if (!isSubmenuHovered) {
        setShowSubmenuTooltip(false);
      }
    }, 0); // Уменьшил задержку для более быстрого скрытия
  };

  const handleSubmenuMouseEnter = () => {
    // Очищаем таймер, чтобы предотвратить скрытие при наведении на подменю
    clearTimers();

    // Устанавливаем текущий элемент как hovered, чтобы другие подменю скрылись
    if (hoveredItemId !== id) {
      setHoveredItem(id);
    }
    setIsSubmenuHovered(true);
    setShowSubmenuTooltip(true);
  };

  const handleSubmenuMouseLeave = () => {
    setIsSubmenuHovered(false);
    // Задержка при уходе с подменю, чтобы дать время вернуться
    clearTimers(); // Очищаем предыдущие таймеры
    hideTimerRef.current = setTimeout(() => {
      // Проверяем, не находится ли мышь на основном элементе меню
      if (!isHovered) {
        setShowSubmenuTooltip(false);
      }
    }, 300);
  };

  const handleClick = () => {
    // Set this item as active
    setActiveItem(id);

    // If menu is expanded and this item has submenu, toggle submenu
    if (hasSubmenu && isExpanded) {
      toggleSubmenu(id);
    } else if (hasSubmenu && !isExpanded) {
      // If menu is collapsed and this item has submenu, show the submenu tooltip
      setShowSubmenuTooltip(true);
    }

    // Call the provided onClick handler
    if (onClick) {
      onClick();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault();
        handleClick();
        break;
      case "ArrowRight":
        if (hasSubmenu && !isExpandedSubmenu) {
          if (!isExpanded) {
            // If menu is collapsed, show submenu tooltip instead of expanding the whole menu
            setShowSubmenuTooltip(true);
          } else {
            toggleSubmenu(id);
          }
        }
        break;
      case "ArrowLeft":
        if (hasSubmenu && isExpandedSubmenu) {
          toggleSubmenu(id);
        } else if (!hasSubmenu && !isExpanded) {
          // If on a non-submenu item while collapsed, expand the menu
          toggleExpand();
        } else if (!hasSubmenu && getMenuParentId(id)) {
          // If on a submenu item, close its parent submenu
          const parentId = getMenuParentId(id);
          if (parentId) {
            toggleSubmenu(parentId); // This will close the parent submenu
          }
        }
        break;
    }
  };

  return (
    <div className="menu-item-container">
      <div
        id={`menu-item-${id}`}
        className={`menu-item ${isActive ? "active" : ""}`}
        role="menuitem"
        aria-expanded={hasSubmenu ? isExpandedSubmenu : undefined}
        aria-haspopup={hasSubmenu ? "true" : undefined}
        aria-current={isActive ? "page" : undefined}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        <div className="menu-item-icon">{icon}</div>
        {isExpanded && <span className="menu-item-label">{label}</span>}
        {/* Show tooltip on hover when menu is collapsed */}
        {!isExpanded && (isHovered || showSubmenuTooltip) && (
          <div
            className="menu-item-tooltip"
            data-tooltip-id={id}
            onClick={() => {
              setShowSubmenuTooltip(false); // Закрываем тултип при клике на область тултипа
              setHoveredItem(null); // Сбрасываем состояние hover
            }}
          >
            <span className="menu-item-label">{label}</span>
            {/* Render submenu items if the item has submenu */}
            {hasSubmenu && submenuItems.length > 0 && (
              <div
                className="submenu-tooltip"
                onMouseEnter={handleSubmenuMouseEnter}
                onMouseLeave={handleSubmenuMouseLeave}
                onClick={(e) => {
                  e.stopPropagation(); // Предотвращаем всплытие события к родительскому контейнеру
                  setShowSubmenuTooltip(false); // Закрываем тултип при клике на область подменю
                  setHoveredItem(null); // Сбрасываем состояние hover
                }}
              >
                {submenuItems.map((subItem) => (
                  <div
                    key={subItem.id}
                    className="submenu-tooltip-item"
                    onClick={(e) => {
                      e.stopPropagation();

                      // Выполняем действие, связанное с подменю
                      if (subItem.onClick) {
                        subItem.onClick();
                      }

                      // Устанавливаем активный элемент и закрываем тултип
                      setActiveItem(subItem.id);
                      setShowSubmenuTooltip(false);
                      setHoveredItem(null);
                    }}
                  >
                    <div className="submenu-item-icon">{subItem.icon}</div>
                    <span className="submenu-item-label">{subItem.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {hasSubmenu && isExpanded && (
          <div className="submenu-toggle">
            <span>{isExpandedSubmenu ? "▼" : "▶"}</span>
          </div>
        )}
      </div>

      {hasSubmenu && isExpandedSubmenu && (
        <div
          className={`submenu-container ${
            isExpanded ? "expanded" : "collapsed"
          } ${isMobile ? "mobile" : ""}`}
        >
          <SubMenu items={submenuItems} />
        </div>
      )}
    </div>
  );
};

export default MenuItem;
