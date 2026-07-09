# Mutual NDA Generator - Agent Guide

## Project Overview

An AI-assisted mutual NDA generator. A form (party details, term, governing law,
optional clauses) drives a live document preview, exportable as PDF (print), .docx, or
plain text. An embedded chat assistant lets the user describe the deal in natural
language and autofills the form via Claude tool use.

---

## Business Requirements

- Generate a standard mutual NDA from structured form fields
- Live preview updates as the form changes
- Export as PDF (browser print), .docx, and plain text (clipboard)
- AI chat assistant: extracts NDA details from natural language and fills the form,
  explains clauses in plain language, always disclaims that it is not legal advice
- User supplies their own Anthropic API key; stored in browser local storage only
- No backend, no accounts, no server-side storage of any kind

---

## Limitations

- Single NDA template (mutual/bilateral only, no one-way NDA variant)
- No multi-document history or saved templates — one draft at a time, persisted to
  localStorage
- No e-signature integration
- AI assistant only edits fields via the `update_nda_fields` tool; it cannot rewrite
  the legal template prose itself

---

## Technical Decisions

- **Framework**: React 19 with Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 (`@theme` tokens in `src/index.css`)
- **AI**: `@anthropic-ai/sdk`, called directly from the browser
  (`dangerouslyAllowBrowser: true`) with the user's own API key — no backend proxy
- **Document export**: `docx` package for .docx, `window.print()` + print CSS for PDF
- **State**: React `useState`, no external state library; form and API key persisted
  via a generic `useLocalStorage` hook
- **No backend, no router**: single-page, entirely client-side

---

## Color Scheme

Dark, purple-accented "premium SaaS" chrome around a neutral white "paper" document
preview (the document itself must read like a printable legal document, not match the
app's dark theme).

- Background: `#0a0a0a`
- Surface: `#17101f` / elevated surface: `#221840`
- Accent: `#7b5cf5` / secondary accent: `#c084fc`
- Border: `rgba(255,255,255,0.08)`
- Text primary: `#ffffff`, secondary: `#9ca3af`, muted: `#6b7280`
- Document preview: white background, `neutral-900` text, serif font

---

## Coding Standards

- Functional components only, no class components
- One component per file
- Props typed with TypeScript interfaces/inline types, no `any`
- No comments explaining what code does — only why (non-obvious constraints)
- Shared form-field primitives live in `components/fields.tsx`; don't duplicate input
  markup in individual field components
- Tailwind classes only — no inline styles, no CSS modules (except the print media
  query in `index.css`)
- Use named exports, not default exports (except `App.tsx`, which Vite expects as a
  default export)

---

## Starting Point

```
src/
  components/
    fields.tsx           # shared input primitives (TextField, SelectField, ...)
    PartyFields.tsx       # one party's fields (name, entity type, address, signatory)
    TermsFields.tsx       # effective date, purpose, term lengths, governing law
    OptionsFields.tsx     # optional clauses + additional terms
    NdaForm.tsx            # composes the above
    DocumentPreview.tsx    # renders the NDA as a printable "paper" card
    ExportBar.tsx          # PDF / .docx / copy-as-text actions
    ChatAssistant.tsx      # chat UI
    ApiKeyModal.tsx        # Anthropic API key entry (local storage only)
    Header.tsx
  hooks/
    useLocalStorage.ts
    useNdaForm.ts           # form state + patch application (manual and AI)
    useChatAssistant.ts     # chat history + Anthropic tool-use handling
  lib/
    ndaTemplate.ts          # form data -> structured NDA document
    docxExport.ts           # structured NDA document -> .docx download
    anthropic.ts            # Anthropic client, system prompt, tool schema
  types.ts
  App.tsx
  main.tsx
```

---

## Working Documentation

- All docs live at the repo root: `AGENTS.md`, `PLAN.md`, `README.md`
- Keep docs current when implementation changes
- README stays minimal: setup steps only, no feature tours
- No emojis anywhere
