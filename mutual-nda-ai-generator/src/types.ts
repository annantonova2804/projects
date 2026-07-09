export type EntityType = 'company' | 'individual'

export interface PartyInfo {
  name: string
  entityType: EntityType
  jurisdictionOfFormation: string
  address: string
  signatoryName: string
  signatoryTitle: string
}

export type TermUnit = 'months' | 'years'

export interface NdaFormData {
  partyA: PartyInfo
  partyB: PartyInfo
  effectiveDate: string
  purpose: string
  confidentialityTermValue: number
  confidentialityTermUnit: TermUnit
  agreementTermValue: number
  agreementTermUnit: TermUnit
  governingLaw: string
  includeNonSolicit: boolean
  includeResidualsClause: boolean
  additionalTerms: string
}

export const emptyParty = (): PartyInfo => ({
  name: '',
  entityType: 'company',
  jurisdictionOfFormation: '',
  address: '',
  signatoryName: '',
  signatoryTitle: '',
})

export const emptyNdaForm = (): NdaFormData => ({
  partyA: emptyParty(),
  partyB: emptyParty(),
  effectiveDate: '',
  purpose: '',
  confidentialityTermValue: 3,
  confidentialityTermUnit: 'years',
  agreementTermValue: 2,
  agreementTermUnit: 'years',
  governingLaw: '',
  includeNonSolicit: false,
  includeResidualsClause: false,
  additionalTerms: '',
})

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: number
}
