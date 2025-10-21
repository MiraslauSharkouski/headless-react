# Интеграция с React Router

## Принцип

Все роутинг-зависимые функции (`useNavigate`, `useLocation`) находятся **в компоненте-потребителе**, а не внутри `Menu`.

## Пример в App.tsx

1. Использовать `useLocation` для определения активного пункта.
2. Передать `defaultActiveId` в `Menu`.
3. Использовать `onActiveItemChange` для вызова `navigate`.
4. Передавать `onClick` в `MenuItem` извне (не внутри `MenuItem`).
