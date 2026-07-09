# Mutual NDA Generator - Implementation Plan

## Step 1: Project scaffold

- `npm create vite@latest . -- --template react-ts`
- Install dependencies: `tailwindcss`, `@tailwindcss/vite`, `@anthropic-ai/sdk`, `docx`
- Configure Tailwind v4 with a custom `@theme` palette

## Step 2: Types and NDA template

- Define `PartyInfo`, `NdaFormData`, `ChatMessage` types
- Build `buildNdaDocument(data)` — turns form data into a structured `NdaDocument`
  (title, intro, numbered sections, signature blocks) with bracketed placeholders for
  unfilled fields
- `ndaDocumentToPlainText(doc)` — flattens the document for copy/plain-text export

## Step 3: Form state

- `useLocalStorage<T>(key, initialValue)` — generic localStorage-synced state
- `useNdaForm()` — wraps form state, exposes `updateField`, `updateParty`, and
  `applyPatch` (used by both manual edits and AI autofill)

## Step 4: Form UI

- Shared field primitives (`TextField`, `DateField`, `SelectField`, `NumberField`,
  `TextAreaField`, `CheckboxField`) in `components/fields.tsx`
- `PartyFields`, `TermsFields`, `OptionsFields`, composed by `NdaForm`

## Step 5: Document preview and export

- `DocumentPreview` — renders the NDA as a white "paper" card (print target via
  `#nda-print-area` + `@media print` CSS)
- `ExportBar` — Print/Save as PDF (`window.print()`), Download .docx (via the `docx`
  package, `Packer.toBlob`), Copy as text (clipboard API with an `execCommand` fallback)

## Step 6: AI assistant

- `lib/anthropic.ts` — client factory (`dangerouslyAllowBrowser: true`), system prompt
  built from the current form state, and an `update_nda_fields` tool schema
- `useChatAssistant` — keeps the UI message list and the raw Anthropic message history
  in sync; applies `tool_use` blocks via `onApplyPatch`, appends matching `tool_result`
  blocks so the conversation stays valid for the next turn, rolls back on request failure
- `ChatAssistant` — message list, input, empty-state example prompt, inline error banner
- `ApiKeyModal` — stores the user's own Anthropic API key in local storage only

## Step 7: Layout

- `Header`, three-column responsive layout (form / preview / chat), `ApiKeyModal` as an
  overlay
