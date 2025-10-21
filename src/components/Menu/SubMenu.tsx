import React from "react";
import MenuItem from "./MenuItem";
import { MenuItemProps } from "./types";

interface SubMenuProps {
  items: MenuItemProps[];
}

const SubMenu: React.FC<SubMenuProps> = ({ items }) => {
  return (
    <div className="submenu" role="group" aria-label="Submenu">
      {items.map((item) => (
        <MenuItem
          key={item.id}
          id={item.id}
          icon={item.icon}
          label={item.label}
          hasSubmenu={item.hasSubmenu}
          submenuItems={item.submenuItems}
          onClick={item.onClick}
        />
      ))}
    </div>
  );
};

export default SubMenu;
