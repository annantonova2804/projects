export function Header({ onOpenSettings }: { onOpenSettings: () => void }) {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-6 py-4">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-text-primary">
            Mutual NDA Generator
          </h1>
          <p className="text-xs text-text-muted">AI Legal Doc Generator</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-text-muted sm:block">
            Not legal advice — have counsel review before signing
          </span>
          <button
            type="button"
            onClick={onOpenSettings}
            className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text-primary transition-colors hover:border-accent"
          >
            API key
          </button>
        </div>
      </div>
    </header>
  )
}
