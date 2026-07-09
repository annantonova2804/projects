import { useState } from 'react'
import type { NdaDocument } from '../lib/ndaTemplate'
import { ndaDocumentToPlainText } from '../lib/ndaTemplate'
import { exportNdaAsDocx } from '../lib/docxExport'

const buttonClass =
  'rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text-primary transition-colors hover:border-accent disabled:cursor-not-allowed disabled:opacity-50'

function copyWithFallback(text: string) {
  const textarea = window.document.createElement('textarea')
  textarea.value = text
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  window.document.body.appendChild(textarea)
  textarea.select()
  window.document.execCommand('copy')
  window.document.body.removeChild(textarea)
}

export function ExportBar({ document: ndaDocument }: { document: NdaDocument }) {
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle')
  const [exporting, setExporting] = useState(false)

  const handleCopy = async () => {
    const text = ndaDocumentToPlainText(ndaDocument)
    try {
      await navigator.clipboard.writeText(text)
      setCopyState('copied')
    } catch {
      try {
        copyWithFallback(text)
        setCopyState('copied')
      } catch {
        setCopyState('failed')
      }
    }
    setTimeout(() => setCopyState('idle'), 2000)
  }

  const handleDocx = async () => {
    setExporting(true)
    try {
      await exportNdaAsDocx(ndaDocument)
    } finally {
      setExporting(false)
    }
  }

  const copyLabel =
    copyState === 'copied' ? 'Copied!' : copyState === 'failed' ? 'Copy failed' : 'Copy as text'

  return (
    <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
      <button type="button" className={buttonClass} onClick={() => window.print()}>
        Print / Save as PDF
      </button>
      <button type="button" className={buttonClass} onClick={handleDocx} disabled={exporting}>
        {exporting ? 'Preparing .docx...' : 'Download .docx'}
      </button>
      <button type="button" className={buttonClass} onClick={handleCopy}>
        {copyLabel}
      </button>
    </div>
  )
}
