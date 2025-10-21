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
  const {
    isExpanded,
    activeItemId,
    expandedItems,
    setActiveItem,
    toggleSubmenu,
    isMobile,
  } = useMenu();

  const isActive = activeItemId === id;
  const isExpandedSubmenu = expandedItems.has(id);

  const handleClick = () => {
    // Set this item as active
    setActiveItem(id);

    // If it has a submenu, toggle it
    if (hasSubmenu) {
      toggleSubmenu(id);
    }

    // Call the provided onClick handler
    if (onClick) {
      onClick();
    }
  };

  return (
    <div className="menu-item-container">
      <div
        className={`menu-item ${isActive ? "active" : ""}`}
        role="menuitem"
        aria-expanded={hasSubmenu ? isExpandedSubmenu : undefined}
        aria-haspopup={hasSubmenu ? "true" : undefined}
        aria-current={isActive ? "page" : undefined}
        onClick={handleClick}
      >
        <div className="menu-item-icon">{icon}</div>
        {isExpanded && <span className="menu-item-label">{label}</span>}
        {hasSubmenu && isExpanded && (
          <div className="submenu-toggle">
            <span>{isExpandedSubmenu ? "▼" : "▶"}</span>
          </div>
        )}
      </div>

      {hasSubmenu && (isExpandedSubmenu || (isMobile && isExpandedSubmenu)) && (
        <div
          className={`submenu-container ${
            isExpanded ? "expanded" : "collapsed"
          }`}
        >
          <SubMenu items={submenuItems} />
        </div>
      )}
    </div>
  );
};

export default MenuItem;
