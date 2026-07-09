import { useState } from 'react'
import type { FormEvent } from 'react'
import type { ChatMessage } from '../types'

export function ChatAssistant({
  messages,
  isSending,
  error,
  hasApiKey,
  onSend,
  onOpenSettings,
}: {
  messages: ChatMessage[]
  isSending: boolean
  error: string | null
  hasApiKey: boolean
  onSend: (text: string) => void
  onOpenSettings: () => void
}) {
  const [draft, setDraft] = useState('')

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!draft.trim()) return
    onSend(draft)
    setDraft('')
  }

  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-surface-elevated">
      <div className="border-b border-border p-4">
        <h3 className="text-sm font-semibold text-text-primary">AI assistant</h3>
        <p className="text-xs text-text-muted">
          Describe the deal in plain language and I'll fill in the form.
        </p>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.length === 0 && (
          <p className="rounded-lg border border-dashed border-border p-3 text-xs text-text-muted">
            Try: "Mutual NDA between my company Acme Inc. (Delaware) and a contractor named Jane
            Doe, for a 2 year engineering project, starting today, governed by California law."
          </p>
        )}
        {messages.map((message) => (
          <div
            key={message.id}
            className={
              message.role === 'user'
                ? 'ml-auto max-w-[85%] rounded-lg bg-accent px-3 py-2 text-sm text-white'
                : 'mr-auto max-w-[85%] rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary'
            }
          >
            {message.content}
          </div>
        ))}
        {isSending && (
          <div className="mr-auto max-w-[85%] rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-muted">
            Thinking...
          </div>
        )}
      </div>

      {!hasApiKey && (
        <div className="border-t border-border p-3 text-xs text-text-muted">
          No API key set.{' '}
          <button
            type="button"
            onClick={onOpenSettings}
            className="text-accent-2 underline underline-offset-2"
          >
            Add your Anthropic API key
          </button>{' '}
          to use the assistant.
        </div>
      )}

      {error && (
        <div className="border-t border-border p-3 text-xs text-red-400">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2 border-t border-border p-3">
        <input
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Describe your NDA..."
          className="flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-accent"
        />
        <button
          type="submit"
          disabled={isSending || !draft.trim()}
          className="rounded-lg bg-accent px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-accent-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  )
}
