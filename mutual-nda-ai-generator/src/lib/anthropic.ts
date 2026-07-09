import Anthropic from '@anthropic-ai/sdk'
import type { NdaFormData } from '../types'

export const MODEL = 'claude-sonnet-5'

const partySchema = {
  type: 'object' as const,
  properties: {
    name: { type: 'string' as const },
    entityType: { type: 'string' as const, enum: ['company', 'individual'] },
    jurisdictionOfFormation: { type: 'string' as const },
    address: { type: 'string' as const },
    signatoryName: { type: 'string' as const },
    signatoryTitle: { type: 'string' as const },
  },
}

export const updateFieldsTool: Anthropic.Tool = {
  name: 'update_nda_fields',
  description:
    'Update fields of the mutual NDA form based on concrete details the user has provided in the conversation. Only include fields that should change; omit anything you are not confident about.',
  input_schema: {
    type: 'object',
    properties: {
      partyA: partySchema,
      partyB: partySchema,
      effectiveDate: { type: 'string', description: 'ISO date, YYYY-MM-DD' },
      purpose: { type: 'string' },
      confidentialityTermValue: { type: 'number' },
      confidentialityTermUnit: { type: 'string', enum: ['months', 'years'] },
      agreementTermValue: { type: 'number' },
      agreementTermUnit: { type: 'string', enum: ['months', 'years'] },
      governingLaw: { type: 'string' },
      includeNonSolicit: { type: 'boolean' },
      includeResidualsClause: { type: 'boolean' },
      additionalTerms: { type: 'string' },
    },
  },
}

export function buildSystemPrompt(data: NdaFormData): string {
  return [
    'You are the AI assistant embedded in a mutual NDA (non-disclosure agreement) generator tool.',
    'You help the user fill out and understand a standard mutual NDA template.',
    '',
    'Current form state (JSON):',
    JSON.stringify(data),
    '',
    'Guidelines:',
    '- When the user describes their situation in natural language (party names, dates, term length, governing law, purpose of the NDA), extract the relevant fields and call the update_nda_fields tool to fill in the form.',
    '- Only set fields you have real information for. Never invent company names, addresses, or dates that were not provided or implied by the user.',
    '- You may explain legal terms in plain language and suggest common defaults (e.g. typical confidentiality term lengths), but always be clear these are common conventions, not legal advice.',
    '- Always make clear, when relevant, that you are not a lawyer and the final document should be reviewed by a licensed attorney before signing.',
    '- Keep replies concise and conversational.',
  ].join('\n')
}

export function createAnthropicClient(apiKey: string) {
  return new Anthropic({ apiKey, dangerouslyAllowBrowser: true })
}
