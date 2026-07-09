# Mutual NDA Generator

An AI-assisted mutual NDA (non-disclosure agreement) generator. Fill in a form or describe
the deal in plain language to an embedded AI assistant, preview the generated legal document
live, and export it as PDF, .docx, or plain text.

This tool does not provide legal advice. The generated document should be reviewed by a
licensed attorney before use.

## Setup

```
npm install
npm run dev
```

The AI assistant calls the Anthropic API directly from the browser using your own API key.
Add it via the "API key" button in the top right; it is stored only in your browser's local
storage.

## Build

```
npm run build
npm run preview
```
