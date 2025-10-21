import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Menu from "./components/Menu/Menu";
import MenuItem from "./components/Menu/MenuItem";
import MenuToggle from "./components/Menu/MenuToggle";
import { MenuItemProps } from "./components/Menu/types";
import { useMenu } from "./context/MenuContext";
import {
  Home,
  Settings,
  User,
  Mail,
  Folder,
  FileText,
  Users,
  List,
  FolderKanban,
  Bell,
} from "lucide-react";
import "./App.css";

// Компоненты страниц
const HomePage = () => (
  <div>
    <h2>Главная страница</h2>
    <p>Добро пожаловать на главную страницу!</p>
  </div>
);
const SettingsPage = () => (
  <div>
    <h2>Настройки</h2>
    <p>Здесь вы можете изменить настройки приложения.</p>
  </div>
);
const UserProfile = () => (
  <div>
    <h2>Профиль пользователя</h2>
    <p>Информация о пользователе.</p>
  </div>
);
const MailPage = () => (
  <div>
    <h2>Почта</h2>
    <p>Ваши письма и сообщения.</p>
  </div>
);
const FolderPage = () => (
  <div>
    <h2>Папки</h2>
    <p>Управление папками и файлами.</p>
  </div>
);

const ListPage = () => (
  <div>
    <h2>Список клиентов</h2>
    <p>Здесь отображается список клиентов.</p>
  </div>
);
const DocumentPage = () => (
  <div>
    <h2>Документы</h2>
    <p>Ваши документы и файлы.</p>
  </div>
);

// Main AppContent component that has access to router and menu contexts
const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setActiveItem, activeItemId } = useMenu(); // Now we can use the menu context

  // Определяем активный ID на основе текущего пути
  const getActiveIdFromPath = (): string | null => {
    switch (location.pathname) {
      case "/":
        return "home";
      case "/settings":
        return "settings";
      case "/profile":
        return "profile";
      case "/mail":
        return "mail";
      case "/folders":
        return "folders";
      case "/documents":
        return "documents";
      case "/list":
        return "clients-list"; // первый элемент подменю "Клиенты"
      case "/review":
        return "review"; // второй элемент подменю "Клиенты"
      case "/notifications":
        return "notifications"; // третий элемент подменю "Клиенты"
      default:
        return "home";
    }
  };

  // Get initial active ID only on mount to avoid infinite loops
  const [initialActiveId] = React.useState<string | null>(getActiveIdFromPath);

  // Effect to sync active menu item with current route
  React.useEffect(() => {
    const currentActiveId = getActiveIdFromPath();
    if (currentActiveId && activeItemId !== currentActiveId) {
      setActiveItem(currentActiveId);
    }
  }, [location.pathname, activeItemId, setActiveItem]);

  // Определяем элементы меню
  const menuItems: MenuItemProps[] = [
    {
      id: "home",
      icon: <Home size={20} />,
      label: "Главная",
      onClick: () => navigate("/"),
    },
    {
      id: "profile",
      icon: <User size={20} />,
      label: "Профиль",
      onClick: () => navigate("/profile"),
    },
    {
      id: "mail",
      icon: <Mail size={20} />,
      label: "Почта",
      onClick: () => navigate("/mail"),
    },
    {
      id: "folders",
      icon: <Folder size={20} />,
      label: "Папки",
      hasSubmenu: true,
      submenuItems: [
        {
          id: "documents",
          icon: <FileText size={16} />,
          label: "Документы",
          onClick: () => navigate("/documents"),
        },
        {
          id: "settings",
          icon: <Settings size={16} />,
          label: "Настройки",
          onClick: () => navigate("/settings"),
        },
      ],
      onClick: () => {
        // При клике на элемент с подменю, мы можем оставить текущую страницу или определить другое поведение
        // В данном случае, оставляем без изменений, подменю будет открыто/закрыто через логику меню
      },
    },
    {
      id: "clients",
      icon: <Users size={20} />,
      label: "Клиенты",
      hasSubmenu: true,
      submenuItems: [
        {
          id: "clients-list", // уникальный id для первого элемента подменю "Клиенты"
          icon: <List size={16} />,
          label: "Список",
          onClick: () => navigate("/list"),
        },
        {
          id: "review",
          icon: <FolderKanban size={16} />,
          label: "Обзор",
          onClick: () => navigate("/review"),
        },
        {
          id: "notifications",
          icon: <Bell size={16} />,
          label: "Уведомления",
          onClick: () => navigate("/notifications"),
        },
      ],
      onClick: () => {
        // При клике на элемент с подменю, переходим на первый элемент подменю
        navigate("/list");
      },
    },
  ];

  return (
    <div className="app-container">
      <div className="menu-wrapper">
        <Menu
          defaultActiveId={initialActiveId}
          onActiveItemChange={(id) => {
            // Обновляем навигацию при изменении активного элемента, если это не совпадает с текущим путем
            const currentPath = location.pathname;
            let targetPath = "";
            switch (id) {
              case "home":
                targetPath = "/";
                break;
              case "settings":
                targetPath = "/settings";
                break;
              case "profile":
                targetPath = "/profile";
                break;
              case "mail":
                targetPath = "/mail";
                break;
              case "folders":
                targetPath = "/folders";
                break;
              case "documents":
                targetPath = "/documents";
                break;
              case "list":
                targetPath = "/list";
                break;
              case "review":
                targetPath = "/review";
                break;
              case "clients-list":
                targetPath = "/list";
                break;
              case "notifications":
                targetPath = "/notifications";
                break;
            }

            // Навигируем только если целевой путь отличается от текущего
            if (targetPath && currentPath !== targetPath) {
              navigate(targetPath);
            }
          }}
        >
          <div className="menu-header menu-item-container">
            <h3>Меню</h3>
          </div>

          {menuItems.map((item) => (
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
          <MenuToggle />
        </Menu>
      </div>
      <div className="content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/mail" element={<MailPage />} />
          <Route path="/folders" element={<FolderPage />} />
          <Route path="/documents" element={<DocumentPage />} />
          <Route path="/list" element={<ListPage />} />
          <Route
            path="/review"
            element={
              <div>
                <h2>Обзор клиентов</h2>
                <p>Здесь отображается обзор клиентов.</p>
              </div>
            }
          />
          <Route
            path="/notifications"
            element={
              <div>
                <h2>Уведомления</h2>
                <p>Здесь отображаются уведомления.</p>
              </div>
            }
          />
        </Routes>
      </div>
    </div>
  );
};

// Main App component with routing
function App() {
  return (
    <Router>
      <Menu>
        <AppContent />
      </Menu>
    </Router>
  );
}

export default App;
