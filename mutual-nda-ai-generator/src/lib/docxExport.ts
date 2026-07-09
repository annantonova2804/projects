import {
  AlignmentType,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  TextRun,
} from 'docx'
import type { NdaDocument } from './ndaTemplate'

export async function exportNdaAsDocx(
  ndaDocument: NdaDocument,
  fileName = 'mutual-nda.docx',
) {
  const children: Paragraph[] = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      heading: HeadingLevel.TITLE,
      children: [new TextRun({ text: ndaDocument.title.toUpperCase(), bold: true })],
    }),
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { before: 200, after: 300 },
      children: [new TextRun(ndaDocument.intro)],
    }),
  ]

  for (const section of ndaDocument.sections) {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 },
        children: [new TextRun({ text: section.heading, bold: true })],
      }),
    )
    for (const paragraph of section.paragraphs) {
      children.push(
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 150 },
          children: [new TextRun(paragraph)],
        }),
      )
    }
  }

  children.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 150 },
      children: [new TextRun({ text: 'Signatures', bold: true })],
    }),
  )

  for (const block of ndaDocument.signatureBlocks) {
    children.push(
      new Paragraph({
        spacing: { before: 200 },
        children: [new TextRun({ text: block.label, bold: true })],
      }),
      new Paragraph({
        text: `By: ${block.party.signatoryName || '_______________________'}`,
      }),
      new Paragraph({
        text: `Title: ${block.party.signatoryTitle || '_______________________'}`,
      }),
    )
  }

  const file = new Document({ sections: [{ children }] })
  const blob = await Packer.toBlob(file)
  const url = URL.createObjectURL(blob)
  const link = window.document.createElement('a')
  link.href = url
  link.download = fileName
  link.click()
  URL.revokeObjectURL(url)
}
