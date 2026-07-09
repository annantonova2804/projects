# Kanban Studio - Implementation Plan

## Status

All steps completed. App is running and buildable.

---

## Step 1: Project scaffold

- `npm create vite@latest . -- --template react-ts`
- Install `tailwindcss`, `@tailwindcss/vite`, `@vitejs/plugin-react@4`
- Install `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`
- Configure Tailwind v4 in `vite.config.ts` via plugin
- Single CSS entry: `@import "tailwindcss"` in `src/index.css`
- Delete Vite boilerplate (App.css, assets, counter)

**Note**: use `@vitejs/plugin-react@4`, not latest — v5+ requires Vite 8.

---

## Step 2: Types

- `ColumnId` union: `"backlog" | "discovery" | "in-progress" | "review" | "done"`
- `Card`: `id`, `title`, `description`, `columnId`
- `Column`: `id`, `title`, `color` (hex accent per column)

---

## Step 3: useLocalStorage hook

- Generic `useLocalStorage<T>(key, initialValue)`
- Reads from localStorage on first render, falls back to `initialValue` on parse error
- Returns `[value, set]` where `set` accepts a value or an updater function
- Writes to localStorage synchronously inside the updater

---

## Step 4: App shell

- Dark background `#0D0E12`, full min-height
- Header: eyebrow label in indigo, large bold title, muted subtitle
- Renders `<Board />`

---

## Step 5: Board component

- Holds all card state via `useLocalStorage("kanban-cards-v2", [])`
- Column tab navigation: "All" + one button per column, click to focus/unfocus
- Wraps visible columns in `DndContext` with `PointerSensor` (5px activation distance)
- `onDragStart`: captures active card for `DragOverlay`
- `onDragEnd`: moves card to target column, reorders with `arrayMove` if over a card
- `DragOverlay`: rotated ghost card with indigo border

---

## Step 6: Column component

- `useDroppable({ id: column.id })` — whole column is a drop target
- Header: colored card count label (`— N cards`) + column title
- Light blue-tinted background (`#1F2130`) when `isOver`
- `SortableContext` with `verticalListSortingStrategy` over column's card ids
- `AddCard` at the bottom

---

## Step 7: Card component

- `useSortable({ id: card.id })` — draggable + sortable
- Shows title (semibold) and description (muted, only if non-empty)
- Edit and delete icon buttons visible on hover (`opacity-0 group-hover:opacity-100`)
- `onPointerDown stopPropagation` on action buttons to prevent drag activation
- Switches to `EditCard` inline when editing

---

## Step 8: AddCard component

- Collapsed: single "+ Add card" text button
- Expanded: title input (required, Enter to submit) + description textarea (optional)
- Escape cancels, blur does not submit
- On submit: calls `onAdd(title, description)`, resets and collapses

---

## Step 9: EditCard component

- Pre-filled title input with underline focus indicator
- Pre-filled description textarea
- Enter saves, Escape cancels
- Empty title on save cancels instead of saving

---

## Step 10: Wire persistence and verify

- Confirm cards survive page reload
- Confirm drag-and-drop moves cards across columns
- Confirm column tab filters correctly
- Run `npm run build` — zero TypeScript errors required before shipping
