import { useMemo, useState } from 'react'
import { Header } from './components/Header'
import { NdaForm } from './components/NdaForm'
import { DocumentPreview } from './components/DocumentPreview'
import { ExportBar } from './components/ExportBar'
import { ChatAssistant } from './components/ChatAssistant'
import { ApiKeyModal } from './components/ApiKeyModal'
import { useNdaForm } from './hooks/useNdaForm'
import { useChatAssistant } from './hooks/useChatAssistant'
import { useLocalStorage } from './hooks/useLocalStorage'
import { buildNdaDocument } from './lib/ndaTemplate'

function App() {
  const { data, updateField, updateParty, applyPatch, reset } = useNdaForm()
  const [apiKey, setApiKey] = useLocalStorage('nda-anthropic-api-key', '')
  const [settingsOpen, setSettingsOpen] = useState(false)

  const chat = useChatAssistant({
    apiKey,
    getFormData: () => data,
    onApplyPatch: applyPatch,
  })

  const ndaDocument = useMemo(() => buildNdaDocument(data), [data])

  return (
    <div className="min-h-screen">
      <Header onOpenSettings={() => setSettingsOpen(true)} />

      <main className="mx-auto grid max-w-[1400px] grid-cols-1 gap-6 px-6 py-6 lg:grid-cols-[360px_1fr_360px]">
        <aside className="order-1 max-h-[calc(100vh-120px)] overflow-y-auto lg:sticky lg:top-6">
          <NdaForm
            data={data}
            onUpdateField={updateField}
            onUpdateParty={updateParty}
            onReset={reset}
          />
        </aside>

        <section className="order-3 lg:order-2">
          <ExportBar document={ndaDocument} />
          <DocumentPreview document={ndaDocument} />
        </section>

        <aside className="order-2 h-[calc(100vh-120px)] lg:order-3 lg:sticky lg:top-6">
          <ChatAssistant
            messages={chat.messages}
            isSending={chat.isSending}
            error={chat.error}
            hasApiKey={Boolean(apiKey)}
            onSend={chat.sendMessage}
            onOpenSettings={() => setSettingsOpen(true)}
          />
        </aside>
      </main>

      {settingsOpen && (
        <ApiKeyModal
          apiKey={apiKey}
          onSave={setApiKey}
          onClose={() => setSettingsOpen(false)}
        />
      )}
    </div>
  )
}

export default App
