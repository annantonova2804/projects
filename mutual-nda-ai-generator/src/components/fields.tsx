import type { ReactNode } from 'react'

const labelClass = 'block text-xs font-medium text-text-secondary mb-1.5'
const controlClass =
  'w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted outline-none transition-colors focus:border-accent'

export function FieldGroup({ children }: { children: ReactNode }) {
  return <div>{children}</div>
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
}) {
  return (
    <FieldGroup>
      <label className={labelClass}>{label}</label>
      <input
        className={controlClass}
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </FieldGroup>
  )
}

export function DateField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <FieldGroup>
      <label className={labelClass}>{label}</label>
      <input
        className={controlClass}
        type="date"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </FieldGroup>
  )
}

export function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
}) {
  return (
    <FieldGroup>
      <label className={labelClass}>{label}</label>
      <textarea
        className={`${controlClass} resize-none`}
        value={value}
        rows={rows}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </FieldGroup>
  )
}

export function SelectField<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: T
  onChange: (value: T) => void
  options: { value: T; label: string }[]
}) {
  return (
    <FieldGroup>
      <label className={labelClass}>{label}</label>
      <select
        className={controlClass}
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldGroup>
  )
}

export function NumberField({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (value: number) => void
}) {
  return (
    <FieldGroup>
      <label className={labelClass}>{label}</label>
      <input
        className={controlClass}
        type="number"
        min={1}
        value={value}
        onChange={(event) => onChange(Number(event.target.value) || 1)}
      />
    </FieldGroup>
  )
}

export function CheckboxField({
  label,
  description,
  checked,
  onChange,
}: {
  label: string
  description: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-surface p-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 size-4 shrink-0 accent-accent"
      />
      <span>
        <span className="block text-sm font-medium text-text-primary">{label}</span>
        <span className="block text-xs text-text-muted">{description}</span>
      </span>
    </label>
  )
}
