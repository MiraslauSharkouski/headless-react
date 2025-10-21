import React from "react";
import { useMenu } from "../../context/MenuContext";

const MenuToggle: React.FC = () => {
  const { isExpanded, toggleExpand } = useMenu();

  return (
    <button
      className="menu-toggle"
      onClick={() => toggleExpand()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggleExpand();
        }
      }}
      aria-label={isExpanded ? "Collapse menu" : "Expand menu"}
      aria-expanded={isExpanded}
    >
      {isExpanded ? "◀" : "▶"}
    </button>
  );
};

export default MenuToggle;
