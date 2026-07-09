import type { NdaFormData, PartyInfo } from '../types'

export interface NdaSection {
  heading: string
  paragraphs: string[]
}

export interface NdaDocument {
  title: string
  intro: string
  sections: NdaSection[]
  signatureBlocks: { label: string; party: PartyInfo }[]
}

const placeholder = (value: string, fallback: string) =>
  value.trim().length > 0 ? value.trim() : fallback

const formatDate = (iso: string) => {
  if (!iso) return '[Effective Date]'
  const date = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(date.getTime())) return '[Effective Date]'
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const formatTerm = (value: number, unit: 'months' | 'years') => {
  const n = Number.isFinite(value) && value > 0 ? value : 1
  const unitLabel = n === 1 ? unit.slice(0, -1) : unit
  return `${n} (${n}) ${unitLabel}`
}

const describeParty = (party: PartyInfo, label: string) => {
  const name = placeholder(party.name, `[${label} Name]`)
  const address = placeholder(party.address, `[${label} Address]`)
  if (party.entityType === 'individual') {
    return `${name}, an individual residing at ${address} ("${label}")`
  }
  const jurisdiction = placeholder(
    party.jurisdictionOfFormation,
    '[Jurisdiction of Formation]',
  )
  return `${name}, a company organized under the laws of ${jurisdiction}, with a principal address at ${address} ("${label}")`
}

export function buildNdaDocument(data: NdaFormData): NdaDocument {
  const partyAName = placeholder(data.partyA.name, '[Party A Name]')
  const partyBName = placeholder(data.partyB.name, '[Party B Name]')
  const purpose = placeholder(
    data.purpose,
    'evaluating a potential business relationship between the parties (the "Purpose")',
  )
  const effectiveDate = formatDate(data.effectiveDate)
  const governingLaw = placeholder(data.governingLaw, '[Governing Law / Jurisdiction]')
  const confidentialityTerm = formatTerm(
    data.confidentialityTermValue,
    data.confidentialityTermUnit,
  )
  const agreementTerm = formatTerm(data.agreementTermValue, data.agreementTermUnit)

  const intro = `This Mutual Non-Disclosure Agreement ("Agreement") is entered into as of ${effectiveDate} (the "Effective Date") by and between ${describeParty(
    data.partyA,
    'Party A',
  )} and ${describeParty(
    data.partyB,
    'Party B',
  )} (each a "Party" and together the "Parties"), in connection with ${purpose}.`

  const sections: NdaSection[] = [
    {
      heading: '1. Definition of Confidential Information',
      paragraphs: [
        `"Confidential Information" means any non-public, proprietary, or confidential information disclosed by either Party (the "Disclosing Party") to the other Party (the "Receiving Party"), whether disclosed orally, in writing, or in any other form, that is designated as confidential or that reasonably should be understood to be confidential given the nature of the information and the circumstances of disclosure, including but not limited to business plans, financial information, technical data, trade secrets, know-how, and information relating to the Purpose.`,
      ],
    },
    {
      heading: '2. Obligations of the Receiving Party',
      paragraphs: [
        `The Receiving Party shall (a) use the Confidential Information solely in connection with the Purpose, (b) not disclose the Confidential Information to any third party without the prior written consent of the Disclosing Party, except to its employees, officers, agents, and professional advisors who have a need to know such information and who are bound by confidentiality obligations no less protective than those in this Agreement, and (c) protect the Confidential Information using at least the same degree of care it uses to protect its own confidential information of similar nature, and in no event less than a reasonable degree of care.`,
      ],
    },
    {
      heading: '3. Exclusions',
      paragraphs: [
        `Confidential Information does not include information that (a) is or becomes publicly available through no fault of the Receiving Party, (b) was rightfully known to the Receiving Party prior to disclosure by the Disclosing Party, (c) is rightfully obtained by the Receiving Party from a third party without restriction on disclosure, or (d) is independently developed by the Receiving Party without use of or reference to the Disclosing Party's Confidential Information.`,
      ],
    },
    {
      heading: '4. Compelled Disclosure',
      paragraphs: [
        `If the Receiving Party is required by law, regulation, or court order to disclose any Confidential Information, it shall, to the extent legally permitted, provide the Disclosing Party with prompt written notice so that the Disclosing Party may seek a protective order or other appropriate remedy, and shall disclose only the portion of Confidential Information legally required to be disclosed.`,
      ],
    },
    {
      heading: '5. Term',
      paragraphs: [
        `This Agreement shall remain in effect for ${agreementTerm} from the Effective Date, unless terminated earlier by either Party upon written notice. The obligations of confidentiality set forth in this Agreement shall survive termination of this Agreement and shall remain in effect for ${confidentialityTerm} following the date of disclosure of the relevant Confidential Information.`,
      ],
    },
    {
      heading: '6. Return or Destruction of Materials',
      paragraphs: [
        `Upon the Disclosing Party's written request, or upon termination of this Agreement, the Receiving Party shall promptly return or destroy all documents and materials containing Confidential Information, and certify such destruction in writing if requested, except that the Receiving Party may retain copies as required by law or its standard archival or backup procedures, subject to the continuing confidentiality obligations herein.`,
      ],
    },
    {
      heading: '7. No License or Warranty',
      paragraphs: [
        `Nothing in this Agreement shall be construed as granting any rights, by license or otherwise, to any Confidential Information disclosed hereunder, or any patent, trademark, copyright, or other intellectual property right, except the limited right to use such information for the Purpose. All Confidential Information is provided "AS IS" without any warranty, express or implied, as to its accuracy or completeness.`,
      ],
    },
  ]

  if (data.includeNonSolicit) {
    sections.push({
      heading: `${sections.length + 1}. Non-Solicitation`,
      paragraphs: [
        `During the term of this Agreement and for a period of twelve (12) months thereafter, neither Party shall directly or indirectly solicit for employment any employee of the other Party with whom it had contact in connection with the Purpose, without the prior written consent of the other Party. This restriction shall not apply to general solicitations of employment not specifically directed at such employees.`,
      ],
    })
  }

  if (data.includeResidualsClause) {
    sections.push({
      heading: `${sections.length + 1}. Residuals`,
      paragraphs: [
        `Notwithstanding anything to the contrary herein, the Receiving Party may use for any purpose the ideas, concepts, know-how, and techniques contained in the Confidential Information that are retained in the unaided memory of the Receiving Party's employees who have had access to the Confidential Information in accordance with this Agreement, provided that this Section shall not be deemed to grant a license under any patents or copyrights of the Disclosing Party, nor relieve the Receiving Party of its obligations regarding disclosure of the Confidential Information itself.`,
      ],
    })
  }

  sections.push(
    {
      heading: `${sections.length + 1}. Remedies`,
      paragraphs: [
        `Each Party acknowledges that unauthorized use or disclosure of Confidential Information may cause irreparable harm for which monetary damages would be an inadequate remedy, and that the Disclosing Party shall be entitled to seek injunctive relief, in addition to any other remedies available at law or in equity, without the necessity of posting a bond.`,
      ],
    },
    {
      heading: `${sections.length + 2}. Governing Law`,
      paragraphs: [
        `This Agreement shall be governed by and construed in accordance with the laws of ${governingLaw}, without regard to its conflict of laws principles. Any dispute arising out of or relating to this Agreement shall be subject to the exclusive jurisdiction of the courts located in ${governingLaw}.`,
      ],
    },
    {
      heading: `${sections.length + 3}. General`,
      paragraphs: [
        `This Agreement constitutes the entire agreement between the Parties with respect to its subject matter and supersedes all prior discussions and agreements, whether oral or written, concerning the Purpose. This Agreement may only be amended by a written instrument signed by both Parties. If any provision of this Agreement is held to be unenforceable, the remaining provisions shall continue in full force and effect. Neither Party may assign this Agreement without the prior written consent of the other Party. This Agreement may be executed in counterparts, each of which shall be deemed an original.`,
        ...(data.additionalTerms.trim()
          ? [data.additionalTerms.trim()]
          : []),
      ],
    },
  )

  return {
    title: 'Mutual Non-Disclosure Agreement',
    intro,
    sections,
    signatureBlocks: [
      { label: partyAName, party: data.partyA },
      { label: partyBName, party: data.partyB },
    ],
  }
}

export function ndaDocumentToPlainText(doc: NdaDocument): string {
  const lines: string[] = [doc.title.toUpperCase(), '', doc.intro, '']
  for (const section of doc.sections) {
    lines.push(section.heading)
    for (const paragraph of section.paragraphs) {
      lines.push(paragraph)
    }
    lines.push('')
  }
  lines.push('SIGNATURES', '')
  for (const block of doc.signatureBlocks) {
    lines.push(
      block.label,
      `By: ${placeholder(block.party.signatoryName, '_______________________')}`,
      `Title: ${placeholder(block.party.signatoryTitle, '_______________________')}`,
      '',
    )
  }
  return lines.join('\n')
}
