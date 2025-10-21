# Хуки

## useMenuState

### Описание

Управляет состоянием меню: `isExpanded`, `activeItemId`, `expandedItems`.

### Возвращаемые значения

- `isExpanded: boolean`
- `activeItemId: string | null`
- `expandedItems: Set<string>`
- `toggleExpand: () => void`
- `setActiveItem: (id: string) => void`
- `toggleSubmenu: (id: string) => void`

---

## useIsMobile

### Описание

Определяет, находится ли приложение в мобильном режиме.

### Параметры

- `breakpoint?: number` (по умолчанию 768)

### Возвращаемое значение

- `isMobile: boolean`
