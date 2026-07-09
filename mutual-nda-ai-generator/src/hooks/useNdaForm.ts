import { useLocalStorage } from './useLocalStorage'
import { emptyNdaForm } from '../types'
import type { NdaFormData, PartyInfo } from '../types'

export type NdaFormPatch = Partial<Omit<NdaFormData, 'partyA' | 'partyB'>> & {
  partyA?: Partial<PartyInfo>
  partyB?: Partial<PartyInfo>
}

export function useNdaForm() {
  const [data, setData] = useLocalStorage<NdaFormData>('nda-form-draft', emptyNdaForm())

  const updateField = <K extends keyof NdaFormData>(key: K, value: NdaFormData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }))
  }

  const updateParty = (
    party: 'partyA' | 'partyB',
    field: keyof PartyInfo,
    value: string,
  ) => {
    setData((prev) => ({ ...prev, [party]: { ...prev[party], [field]: value } }))
  }

  const applyPatch = (patch: NdaFormPatch) => {
    setData((prev) => ({
      ...prev,
      ...patch,
      partyA: { ...prev.partyA, ...(patch.partyA ?? {}) },
      partyB: { ...prev.partyB, ...(patch.partyB ?? {}) },
    }))
  }

  const reset = () => setData(emptyNdaForm())

  return { data, updateField, updateParty, applyPatch, reset }
}
