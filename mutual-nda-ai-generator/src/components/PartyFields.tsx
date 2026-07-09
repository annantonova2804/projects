import type { PartyInfo } from '../types'
import { SelectField, TextField } from './fields'

export function PartyFields({
  label,
  party,
  onChange,
}: {
  label: string
  party: PartyInfo
  onChange: (field: keyof PartyInfo, value: string) => void
}) {
  return (
    <div className="space-y-3 rounded-xl border border-border bg-surface-elevated p-4">
      <h3 className="text-sm font-semibold text-text-primary">{label}</h3>
      <SelectField
        label="Entity type"
        value={party.entityType}
        onChange={(value) => onChange('entityType', value)}
        options={[
          { value: 'company', label: 'Company / Organization' },
          { value: 'individual', label: 'Individual' },
        ]}
      />
      <TextField
        label={party.entityType === 'individual' ? 'Full name' : 'Company name'}
        value={party.name}
        onChange={(value) => onChange('name', value)}
        placeholder={party.entityType === 'individual' ? 'Jane Doe' : 'Acme Inc.'}
      />
      {party.entityType === 'company' && (
        <TextField
          label="Jurisdiction of formation"
          value={party.jurisdictionOfFormation}
          onChange={(value) => onChange('jurisdictionOfFormation', value)}
          placeholder="Delaware, USA"
        />
      )}
      <TextField
        label="Address"
        value={party.address}
        onChange={(value) => onChange('address', value)}
        placeholder="123 Main St, City, Country"
      />
      <div className="grid grid-cols-2 gap-3">
        <TextField
          label="Signatory name"
          value={party.signatoryName}
          onChange={(value) => onChange('signatoryName', value)}
          placeholder="John Smith"
        />
        <TextField
          label="Signatory title"
          value={party.signatoryTitle}
          onChange={(value) => onChange('signatoryTitle', value)}
          placeholder="CEO"
        />
      </div>
    </div>
  )
}
