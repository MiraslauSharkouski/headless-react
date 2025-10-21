# Компоненты

## Menu

### Пропсы

- `children: React.ReactNode`
- `defaultExpanded?: boolean`
- `defaultActiveId?: string`
- `onExpandChange?: (isExpanded: boolean) => void`
- `onActiveItemChange?: (id: string) => void`

---

## MenuItem

### Пропсы

- `id: string`
- `icon: React.ReactNode`
- `label: string`
- `hasSubmenu?: boolean`
- `submenuItems?: MenuItemProps[]`
- `onClick?: () => void`

---

## MenuToggle

### Пропсы

- Нет

---

## SubMenu

### Пропсы

- `items: MenuItemProps[]`
