import type { NdaFormData, PartyInfo } from '../types'
import { PartyFields } from './PartyFields'
import { TermsFields } from './TermsFields'
import { OptionsFields } from './OptionsFields'

export function NdaForm({
  data,
  onUpdateField,
  onUpdateParty,
  onReset,
}: {
  data: NdaFormData
  onUpdateField: <K extends keyof NdaFormData>(key: K, value: NdaFormData[K]) => void
  onUpdateParty: (party: 'partyA' | 'partyB', field: keyof PartyInfo, value: string) => void
  onReset: () => void
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-text-muted">
          Agreement details
        </h2>
        <button
          type="button"
          onClick={onReset}
          className="text-xs text-text-muted transition-colors hover:text-accent-2"
        >
          Reset form
        </button>
      </div>
      <PartyFields
        label="Party A"
        party={data.partyA}
        onChange={(field, value) => onUpdateParty('partyA', field, value)}
      />
      <PartyFields
        label="Party B"
        party={data.partyB}
        onChange={(field, value) => onUpdateParty('partyB', field, value)}
      />
      <TermsFields data={data} onChange={onUpdateField} />
      <OptionsFields data={data} onChange={onUpdateField} />
    </div>
  )
}
