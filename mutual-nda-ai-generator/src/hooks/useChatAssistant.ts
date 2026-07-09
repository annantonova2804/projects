import { useRef, useState } from 'react'
import type Anthropic from '@anthropic-ai/sdk'
import { MODEL, buildSystemPrompt, createAnthropicClient, updateFieldsTool } from '../lib/anthropic'
import type { ChatMessage, NdaFormData } from '../types'
import type { NdaFormPatch } from './useNdaForm'

export function useChatAssistant({
  apiKey,
  getFormData,
  onApplyPatch,
}: {
  apiKey: string
  getFormData: () => NdaFormData
  onApplyPatch: (patch: NdaFormPatch) => void
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const historyRef = useRef<Anthropic.MessageParam[]>([])

  const sendMessage = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || isSending) return

    if (!apiKey) {
      setError('Add your Anthropic API key first (top right, "API key").')
      return
    }

    setError(null)
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: 'user', content: trimmed, createdAt: Date.now() },
    ])
    historyRef.current = [...historyRef.current, { role: 'user', content: trimmed }]
    setIsSending(true)

    try {
      const client = createAnthropicClient(apiKey)
      const response = await client.messages.create({
        model: MODEL,
        max_tokens: 1024,
        system: buildSystemPrompt(getFormData()),
        tools: [updateFieldsTool],
        messages: historyRef.current,
      })

      historyRef.current = [
        ...historyRef.current,
        { role: 'assistant', content: response.content },
      ]

      let replyText = ''
      const toolResults: Anthropic.ToolResultBlockParam[] = []

      for (const block of response.content) {
        if (block.type === 'text') {
          replyText += block.text
        } else if (block.type === 'tool_use' && block.name === 'update_nda_fields') {
          onApplyPatch(block.input as NdaFormPatch)
          toolResults.push({
            type: 'tool_result',
            tool_use_id: block.id,
            content: 'Form updated.',
          })
        }
      }

      if (toolResults.length > 0) {
        historyRef.current = [...historyRef.current, { role: 'user', content: toolResults }]
      }

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: replyText || "I've updated the form based on what you shared.",
          createdAt: Date.now(),
        },
      ])
    } catch (err) {
      historyRef.current = historyRef.current.slice(0, -1)
      setError(err instanceof Error ? err.message : 'Something went wrong contacting Claude.')
    } finally {
      setIsSending(false)
    }
  }

  const resetChat = () => {
    setMessages([])
    historyRef.current = []
    setError(null)
  }

  return { messages, isSending, error, sendMessage, resetChat }
}
