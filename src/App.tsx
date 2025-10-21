import React from "react";
import { useNavigate, useLocation } from "react-router";
import { SidebarMenu } from "../src/components/sidebar/SidebarMenu";
import { SidebarMenuItem } from "../src/components/sidebar/SidebarMenuItem";
import { SidebarToggle } from "../src/components/sidebar/SidebarToggle";
import { SidebarSubMenu } from "../src/components/sidebar/SidebarSubMenu";
import {
  Car,
  Cat,
  Castle,
  PieChart,
  Carrot,
  Cherry,
  DollarSign,
} from "lucide-react";

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Определяем активный пункт по текущему пути
  const getActiveId = (): string | null => {
    const path = location.pathname;
    if (path.startsWith("/clients")) return "clients";
    if (path.startsWith("/reviews")) return "reviews";
    if (path.startsWith("/notifications")) return "notifications";
    return null;
  };

  const handleItemClick = (id: string) => {
    switch (id) {
      case "clients":
        navigate("/clients");
        break;
      case "reviews":
        navigate("/reviews");
        break;
      case "notifications":
        navigate("/notifications");
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex h-screen">
      <SidebarMenu
        initialActiveItemId={getActiveId()}
        onActiveChange={(id) => {
          if (id && id !== getActiveId()) {
            handleItemClick(id);
          }
        }}
      >
        <div className="flex flex-col h-full bg-gray-100 p-4">
          <SidebarMenuItem
            id="clients"
            icon={<Car />}
            label="Clients"
            isActive={location.pathname.startsWith("/clients")}
            onClick={() => handleItemClick("clients")}
          />
          <SidebarMenuItem
            id="reviews"
            icon={<Cat />}
            label="Reviews"
            isActive={location.pathname.startsWith("/reviews")}
            onClick={() => handleItemClick("reviews")}
          />
          <SidebarMenuItem
            id="notifications"
            icon={<Castle />}
            label="Notifications"
            isActive={location.pathname.startsWith("/notifications")}
            onClick={() => handleItemClick("notifications")}
          />

          {/* Пример подменю */}
          <SidebarMenuItem
            id="analytics"
            icon={<PieChart />}
            label="Analytics"
            hasSubmenu
          >
            <SidebarSubMenu>
              <SidebarMenuItem
                id="analytics-list"
                icon={<Carrot />}
                label="List"
                isActive={location.pathname === "/analytics/list"}
                onClick={() => navigate("/analytics/list")}
              />
              <SidebarMenuItem
                id="analytics-reviews"
                icon={<Cherry />}
                label="Reviews"
                isActive={location.pathname === "/analytics/reviews"}
                onClick={() => navigate("/analytics/reviews")}
              />
            </SidebarSubMenu>
          </SidebarMenuItem>

          <SidebarMenuItem
            id="payments"
            icon={<DollarSign />}
            label="Payments"
            isActive={location.pathname.startsWith("/payments")}
            onClick={() => handleItemClick("payments")}
          />

          <div className="mt-auto">
            <SidebarToggle />
          </div>
        </div>
      </SidebarMenu>

      <main className="flex-1 p-6">{children}</main>
    </div>
  );
};

export default AppLayout;
