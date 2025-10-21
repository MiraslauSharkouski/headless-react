# Типы данных

## MenuItemProps

```ts
interface MenuItemProps {
  id: string;
  icon: React.ReactNode;
  label: string;
  hasSubmenu?: boolean;
  submenuItems?: MenuItemProps[];
  onClick?: () => void;
}
```

## MenuState

```ts
interface MenuState {
  isExpanded: boolean;
  activeItemId: string | null;
  expandedItems: Set<string>;
}
```

## MenuContextType

```ts
interface MenuContextType extends MenuState {
  isMobile: boolean;
  toggleExpand: () => void;
  setActiveItem: (id: string) => void;
  toggleSubmenu: (id: string) => void;
}
```
