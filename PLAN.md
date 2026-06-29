# Kanban MVP - Implementation Plan

## Step 1: Project scaffold

- `npm create vite@latest . -- --template react-ts`
- Install dependencies: `tailwindcss`, `@dnd-kit/core`, `@dnd-kit/sortable`
- Configure Tailwind v4
- Delete Vite boilerplate (App.css, assets)

## Step 2: Types

- Define `Card` type: `id`, `title`, `columnId`
- Define `ColumnId` enum: `TODO | IN_PROGRESS | DONE`
- Define `Column` type: `id`, `title`

## Step 3: localStorage hook

- `useLocalStorage<T>(key, initialValue)` — reads on mount, writes on every change

## Step 4: Board component

- Holds all state: `cards` array
- Wraps children in `DndContext`
- Handles `onDragEnd` to move cards between columns
- Renders three `Column` components

## Step 5: Column component

- `useDroppable` from dnd-kit
- Renders its cards filtered from the full card list
- Contains `AddCard` at the bottom

## Step 6: Card component

- `useDraggable` from dnd-kit
- Displays title
- Edit and delete icon buttons visible on hover

## Step 7: AddCard component

- Single text input, submit on Enter or blur
- Calls `onAdd(title)` prop

## Step 8: EditCard component

- Inline text input pre-filled with card title
- Saves on Enter, cancels on Escape

## Step 9: Wire persistence

- Pass `cards` from `useLocalStorage` into Board
- Confirm state survives reload

## Step 10: Visual polish

- Apply color scheme from AGENTS.md
- Drag overlay (ghost card) via `DragOverlay`
- Confirm responsive layout at 1024px+ (desktop only)
