# Kanban Studio - Agent Guide

## Project Overview

A minimal single-board Kanban web app. Five columns, drag-and-drop cards with title and description, column tab navigation, localStorage persistence. Dark theme.

---

## Business Requirements

- Users can create, edit, and delete cards
- Each card has a title (required) and a description (optional)
- Cards live in one of five columns: Backlog, Discovery, In Progress, Review, Done
- Cards can be moved between columns via drag-and-drop
- Cards can be reordered within a column via drag-and-drop
- Column tab navigation lets users focus on a single column or view all
- Board state persists across page reloads via localStorage
- No authentication, no multi-user, no backend

---

## Limitations

- Single board only
- No user accounts or sync
- No attachments, labels, or due dates
- No undo/redo
- Desktop layout only (1024px+)

---

## Technical Decisions

- **Framework**: React 19 with Vite 6
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS v4 via `@tailwindcss/vite`
- **Drag-and-drop**: `@dnd-kit/core` + `@dnd-kit/sortable` + `@dnd-kit/utilities`
- **State**: `useState` + `useReducer` in components, no external state library
- **Persistence**: `localStorage` via a custom `useLocalStorage` hook
- **localStorage key**: `kanban-cards-v2`
- **No router**: single-page, no routing needed
- **React plugin**: `@vitejs/plugin-react@4` (compatible with Vite 6; v5+ requires Vite 8)

---

## Color Scheme

| Token | Value | Usage |
|---|---|---|
| Background | `#0D0E12` | Page background |
| Surface | `#1A1C24` | Cards, add-card form |
| Border default | `#1F2028` | Column dividers, card borders |
| Border hover | `#2A2D3A` | Card hover state |
| Text primary | `#E8EAED` | Card titles, headings |
| Text secondary | `#6B6F80` | Descriptions, placeholders |
| Text muted | `#4A4E5E` | Icon buttons default |
| Accent indigo | `#6366F1` | Primary CTA, Backlog column, active tab |
| Accent violet | `#A78BFA` | Discovery column |
| Accent amber | `#F59E0B` | In Progress column |
| Accent emerald | `#34D399` | Review column |
| Accent green | `#10B981` | Done column |
| Destructive | `#EF4444` | Delete icon hover |

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
- No emojis anywhere

---

## File Structure

```
src/
  components/
    Board.tsx       — DndContext, column tab nav, drag logic, card state
    Column.tsx      — droppable column, card count, card list
    Card.tsx        — draggable card with title/description, edit/delete on hover
    AddCard.tsx     — inline form: title input + description textarea
    EditCard.tsx    — inline edit form pre-filled with current values
  hooks/
    useLocalStorage.ts   — generic hook: reads on mount, writes on every change
  types.ts          — Card, Column, ColumnId type definitions
  App.tsx           — page shell: dark header + Board
  main.tsx          — React root mount
  index.css         — @import "tailwindcss"
```

---

## Working Documentation

- All docs live at repo root: `AGENTS.md`, `PLAN.md`, `README.md`
- Keep docs current when implementation changes
- README stays minimal: setup steps + feature list only
- No emojis anywhere
