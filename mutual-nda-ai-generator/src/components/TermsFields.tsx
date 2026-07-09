import type { NdaFormData, TermUnit } from '../types'
import { DateField, NumberField, SelectField, TextAreaField, TextField } from './fields'

const unitOptions: { value: TermUnit; label: string }[] = [
  { value: 'months', label: 'Months' },
  { value: 'years', label: 'Years' },
]

export function TermsFields({
  data,
  onChange,
}: {
  data: NdaFormData
  onChange: <K extends keyof NdaFormData>(key: K, value: NdaFormData[K]) => void
}) {
  return (
    <div className="space-y-3 rounded-xl border border-border bg-surface-elevated p-4">
      <h3 className="text-sm font-semibold text-text-primary">Agreement terms</h3>
      <DateField
        label="Effective date"
        value={data.effectiveDate}
        onChange={(value) => onChange('effectiveDate', value)}
      />
      <TextAreaField
        label="Purpose of disclosure"
        value={data.purpose}
        onChange={(value) => onChange('purpose', value)}
        placeholder="e.g. evaluating a potential partnership between the parties"
      />
      <div className="grid grid-cols-2 gap-3">
        <NumberField
          label="Agreement term"
          value={data.agreementTermValue}
          onChange={(value) => onChange('agreementTermValue', value)}
        />
        <SelectField
          label="Unit"
          value={data.agreementTermUnit}
          onChange={(value) => onChange('agreementTermUnit', value)}
          options={unitOptions}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <NumberField
          label="Confidentiality survival"
          value={data.confidentialityTermValue}
          onChange={(value) => onChange('confidentialityTermValue', value)}
        />
        <SelectField
          label="Unit"
          value={data.confidentialityTermUnit}
          onChange={(value) => onChange('confidentialityTermUnit', value)}
          options={unitOptions}
        />
      </div>
      <TextField
        label="Governing law / jurisdiction"
        value={data.governingLaw}
        onChange={(value) => onChange('governingLaw', value)}
        placeholder="the State of Delaware"
      />
    </div>
  )
}
