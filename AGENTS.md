# Kanban MVP - Agent Guide

## Project Overview

A minimal Kanban board web app. Three columns (To Do, In Progress, Done), drag-and-drop cards, local persistence.

---

## Business Requirements

- Users can create, edit, and delete cards
- Cards live in one of three columns: To Do, In Progress, Done
- Cards can be moved between columns via drag-and-drop
- Board state persists across page reloads (localStorage)
- No authentication, no multi-user, no backend

---

## Limitations

- Single board only, no multi-board support
- No user accounts or sync
- No attachments, labels, or due dates
- No undo/redo

---

## Technical Decisions

- **Framework**: React 19 with Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Drag-and-drop**: `@dnd-kit/core` + `@dnd-kit/sortable`
- **State**: React `useState` + `useReducer`, no external state library
- **Persistence**: `localStorage` via a custom `useLocalStorage` hook
- **No backend**: all data is client-side only
- **No router**: single-page, no routing needed

---

## Color Scheme

- Background: `#F4F5F7` (light gray)
- Column background: `#EBECF0`
- Card background: `#FFFFFF`
- Primary accent: `#0052CC` (blue)
- Destructive: `#DE350B` (red)
- Text primary: `#172B4D`
- Text secondary: `#5E6C84`

---

## Coding Standards

- Functional components only, no class components
- One component per file
- Props typed with TypeScript interfaces, no `any`
- No `useEffect` for derived state — compute inline
- No defensive programming for impossible states
- No comments explaining what code does — only why (non-obvious constraints)
- No barrel `index.ts` re-exports unless the directory has 4+ files
- Keep components under 100 lines; extract when they grow
- Use named exports, not default exports
- Tailwind classes only — no inline styles, no CSS modules

---

## Starting Point

```
src/
  components/
    Board.tsx          # root layout, renders three Column components
    Column.tsx         # droppable column with header and card list
    Card.tsx           # draggable card with edit/delete actions
    AddCard.tsx        # inline form to create a new card
    EditCard.tsx       # inline form to edit an existing card
  hooks/
    useLocalStorage.ts # generic hook for localStorage sync
  types.ts             # Card and Column type definitions
  App.tsx
  main.tsx
```

---

## Working Documentation

- All docs live at the repo root: `AGENTS.md`, `PLAN.md`, `README.md`
- Keep docs current when implementation changes
- README stays minimal: setup steps only, no feature tours
- No emojis anywhere
