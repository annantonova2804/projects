import { useState } from 'react'

export function ApiKeyModal({
  apiKey,
  onSave,
  onClose,
}: {
  apiKey: string
  onSave: (key: string) => void
  onClose: () => void
}) {
  const [value, setValue] = useState(apiKey)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-surface-elevated p-6">
        <h2 className="mb-2 text-sm font-semibold text-text-primary">Anthropic API key</h2>
        <p className="mb-4 text-xs leading-relaxed text-text-muted">
          The chat assistant calls the Anthropic API directly from your browser using your own
          key. It is stored only in this browser's local storage and is never sent anywhere
          except api.anthropic.com.
        </p>
        <input
          type="password"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="sk-ant-..."
          className="mb-4 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-accent"
        />
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => {
              onSave('')
              setValue('')
            }}
            className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text-muted transition-colors hover:text-accent-2"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text-primary transition-colors hover:border-accent"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onSave(value.trim())
              onClose()
            }}
            className="rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-accent-2"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
