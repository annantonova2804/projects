import type { NdaFormData } from '../types'
import { CheckboxField, TextAreaField } from './fields'

export function OptionsFields({
  data,
  onChange,
}: {
  data: NdaFormData
  onChange: <K extends keyof NdaFormData>(key: K, value: NdaFormData[K]) => void
}) {
  return (
    <div className="space-y-3 rounded-xl border border-border bg-surface-elevated p-4">
      <h3 className="text-sm font-semibold text-text-primary">Optional clauses</h3>
      <CheckboxField
        label="Non-solicitation"
        description="Restricts either party from poaching the other's employees for 12 months."
        checked={data.includeNonSolicit}
        onChange={(value) => onChange('includeNonSolicit', value)}
      />
      <CheckboxField
        label="Residuals clause"
        description="Allows use of ideas retained in unaided memory, common in tech NDAs."
        checked={data.includeResidualsClause}
        onChange={(value) => onChange('includeResidualsClause', value)}
      />
      <TextAreaField
        label="Additional terms (optional)"
        value={data.additionalTerms}
        onChange={(value) => onChange('additionalTerms', value)}
        placeholder="Any extra terms specific to this agreement..."
        rows={3}
      />
    </div>
  )
}
