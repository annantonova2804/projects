import type { NdaDocument } from '../lib/ndaTemplate'

export function DocumentPreview({ document }: { document: NdaDocument }) {
  return (
    <div
      id="nda-print-area"
      className="mx-auto max-w-[820px] rounded-lg bg-white px-12 py-14 text-neutral-900 shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_30px_60px_-20px_rgba(123,92,245,0.25)]"
    >
      <div className="font-serif text-sm leading-relaxed">
        <h1 className="mb-6 text-center text-xl font-bold uppercase tracking-wide">
          {document.title}
        </h1>
        <p className="mb-6 text-justify">{document.intro}</p>
        {document.sections.map((section) => (
          <section key={section.heading} className="mb-5">
            <h2 className="mb-2 font-bold">{section.heading}</h2>
            {section.paragraphs.map((paragraph, index) => (
              <p key={index} className="mb-2 text-justify">
                {paragraph}
              </p>
            ))}
          </section>
        ))}
        <section className="mt-10">
          <h2 className="mb-4 font-bold">Signatures</h2>
          <div className="grid grid-cols-2 gap-8">
            {document.signatureBlocks.map((block) => (
              <div key={block.label} className="space-y-4">
                <p className="font-semibold">{block.label}</p>
                <div>
                  <div className="mb-1 h-8 border-b border-neutral-400" />
                  <p className="text-xs text-neutral-500">
                    By: {block.party.signatoryName || '_______________________'}
                  </p>
                  <p className="text-xs text-neutral-500">
                    Title: {block.party.signatoryTitle || '_______________________'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
