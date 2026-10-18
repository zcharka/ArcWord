import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
} from 'docx'
import type { Editor } from '@tiptap/react'

export async function exportToDocxBlob(editor: Editor, docTitle: string = 'Dokument'): Promise<Blob> {
  const json = editor.getJSON()
  const contentNodes = json.content || []

  const children: (Paragraph | Table)[] = []

  const mapAlignment = (align?: string): (typeof AlignmentType)[keyof typeof AlignmentType] => {
    switch (align) {
      case 'center':
        return AlignmentType.CENTER
      case 'right':
        return AlignmentType.RIGHT
      case 'justify':
        return AlignmentType.JUSTIFIED
      default:
        return AlignmentType.LEFT
    }
  }

  const mapMarks = (textNode: any) => {
    const marks = textNode.marks || []
    let bold = false
    let italics = false
    let underline = false
    let strike = false
    let color: string | undefined
    let font: string | undefined
    let size: number | undefined

    for (const m of marks) {
      if (m.type === 'bold') bold = true
      if (m.type === 'italic') italics = true
      if (m.type === 'underline') underline = true
      if (m.type === 'strike') strike = true
      if (m.type === 'textStyle') {
        if (m.attrs?.color) {
          color = m.attrs.color.replace('#', '')
        }
        if (m.attrs?.fontFamily) {
          font = m.attrs.fontFamily
        }
        if (m.attrs?.fontSize) {
          const pt = parseInt(m.attrs.fontSize, 10)
          if (!isNaN(pt)) size = pt * 2 // half-points in docx
        }
      }
    }

    return new TextRun({
      text: textNode.text || '',
      bold,
      italics,
      underline: underline ? {} : undefined,
      strike,
      color,
      font: font ? { name: font } : undefined,
      size,
    })
  }

  for (const node of contentNodes) {
    if (node.type === 'heading') {
      const level = node.attrs?.level || 1
      let headingLevel: any = HeadingLevel.HEADING_1
      if (level === 2) headingLevel = HeadingLevel.HEADING_2
      else if (level === 3) headingLevel = HeadingLevel.HEADING_3
      else if (level === 4) headingLevel = HeadingLevel.HEADING_4
      else if (level === 5) headingLevel = HeadingLevel.HEADING_5
      else if (level === 6) headingLevel = HeadingLevel.HEADING_6

      const textRuns = (node.content || []).map(mapMarks)
      children.push(
        new Paragraph({
          heading: headingLevel,
          alignment: mapAlignment(node.attrs?.textAlign),
          children: textRuns.length > 0 ? textRuns : [new TextRun('')],
          spacing: { before: 200, after: 120 },
        })
      )
    } else if (node.type === 'paragraph') {
      const textRuns = (node.content || []).map(mapMarks)
      children.push(
        new Paragraph({
          alignment: mapAlignment(node.attrs?.textAlign),
          children: textRuns.length > 0 ? textRuns : [new TextRun('')],
          spacing: { before: 60, after: 120 },
        })
      )
    } else if (node.type === 'bulletList' || node.type === 'orderedList') {
      const items = node.content || []
      items.forEach((itemNode: any) => {
        const itemParas = itemNode.content || []
        itemParas.forEach((pNode: any) => {
          const textRuns = (pNode.content || []).map(mapMarks)
          children.push(
            new Paragraph({
              bullet: node.type === 'bulletList' ? { level: 0 } : undefined,
              numbering: node.type === 'orderedList' ? { reference: 'numbered-list', level: 0 } : undefined,
              children: textRuns.length > 0 ? textRuns : [new TextRun('')],
              spacing: { before: 40, after: 60 },
            })
          )
        })
      })
    } else if (node.type === 'table') {
      const rows = (node.content || []).map((rowNode: any) => {
        const cells = (rowNode.content || []).map((cellNode: any) => {
          const cellParas = (cellNode.content || []).map((cp: any) => {
            const textRuns = (cp.content || []).map(mapMarks)
            return new Paragraph({
              children: textRuns.length > 0 ? textRuns : [new TextRun('')],
            })
          })
          return new TableCell({
            children: cellParas.length > 0 ? cellParas : [new Paragraph('')],
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1, color: 'D3D3D3' },
              bottom: { style: BorderStyle.SINGLE, size: 1, color: 'D3D3D3' },
              left: { style: BorderStyle.SINGLE, size: 1, color: 'D3D3D3' },
              right: { style: BorderStyle.SINGLE, size: 1, color: 'D3D3D3' },
            },
            width: {
              size: 2000,
              type: WidthType.DXA,
            },
          })
        })
        return new TableRow({
          children: cells,
        })
      })

      if (rows.length > 0) {
        children.push(
          new Table({
            rows,
          })
        )
      }
    }
  }

  // Ensure at least one paragraph exists
  if (children.length === 0) {
    children.push(new Paragraph({ children: [new TextRun('')] }))
  }

  const doc = new Document({
    title: docTitle,
    creator: 'ArcWord',
    description: 'Dokument utworzony w programie ArcWord',
    sections: [
      {
        properties: {},
        children,
      },
    ],
  })

  return await Packer.toBlob(doc)
}
