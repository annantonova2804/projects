# Kanban Studio

A minimal single-board Kanban app with drag-and-drop cards, dark theme, and local persistence.

## Stack

- React 19 + Vite 6
- TypeScript
- Tailwind CSS v4
- @dnd-kit/core + @dnd-kit/sortable

## Setup

```
npm install
npm run dev
```

Open http://localhost:5173

## Build

```
npm run build
npm run preview
```

## Features

- Five columns: Backlog, Discovery, In Progress, Review, Done
- Cards with title and optional description
- Drag-and-drop between columns and within columns
- Inline create, edit, and delete for cards
- Column tab navigation to focus a single column
- State persists in localStorage — survives page reload
- No backend, no auth, no multi-user
