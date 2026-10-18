import * as mammoth from 'mammoth'

export interface DocxImportResult {
  html: string
  messages: string[]
}

/**
 * Converts DOCX ArrayBuffer into clean HTML compatible with TipTap / ProseMirror.
 * Images are converted inline into base64 data URIs.
 */
export async function convertDocxArrayBufferToHtml(arrayBuffer: ArrayBuffer): Promise<DocxImportResult> {
  try {
    const options: any = {
      convertImage: (mammoth as any).images?.imgElement
        ? (mammoth as any).images.imgElement(async (image: any) => {
            const base64 = await image.read('base64')
            return {
              src: `data:${image.contentType || 'image/png'};base64,${base64}`,
            }
          })
        : undefined,
    }

    const result = await mammoth.convertToHtml({ arrayBuffer }, options)
    return {
      html: result.value || '<p></p>',
      messages: (result.messages || []).map((m: any) => m.message || String(m)),
    }
  } catch (error) {
    console.error('Błąd podczas konwersji DOCX:', error)
    throw error
  }
}
