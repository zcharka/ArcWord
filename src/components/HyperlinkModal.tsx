import React, { useState, useEffect } from 'react'
import { X, Link2 } from 'lucide-react'
import { Editor } from '@tiptap/react'

interface HyperlinkModalProps {
  isOpen: boolean
  onClose: () => void
  editor: Editor | null
}

export const HyperlinkModal: React.FC<HyperlinkModalProps> = ({
  isOpen,
  onClose,
  editor,
}) => {
  const [text, setText] = useState('')
  const [url, setUrl] = useState('')

  useEffect(() => {
    if (isOpen && editor) {
      const selectedText = editor.state.doc.textBetween(
        editor.state.selection.from,
        editor.state.selection.to,
        ' '
      )
      setText(selectedText || '')
      const previousUrl = editor.getAttributes('link').href || ''
      setUrl(previousUrl || 'https://')
    }
  }, [isOpen, editor])

  if (!isOpen || !editor) return null

  const handleApply = () => {
    if (!url.trim()) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      onClose()
      return
    }

    if (text.trim() && editor.state.selection.empty) {
      editor
        .chain()
        .focus()
        .insertContent(`<a href="${url}">${text}</a>`)
        .run()
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: url })
        .run()
    }
    onClose()
  }

  const handleRemove = () => {
    editor.chain().focus().extendMarkRange('link').unsetLink().run()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="w-[420px] bg-[#2b2b2b] text-neutral-200 border border-neutral-700 rounded shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#242424] border-b border-neutral-700">
          <div className="flex items-center gap-2">
            <Link2 size={16} className="text-[#0078d4]" />
            <span className="text-sm font-semibold text-white">Wstawianie hiperłącza</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-neutral-700 rounded text-neutral-400 hover:text-white"
          >
            <X size={15} />
          </button>
        </div>

        <div className="p-4 space-y-3 text-xs">
          <div>
            <label className="block text-neutral-300 mb-1">Tekst do wyświetlenia:</label>
            <input
              type="text"
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Wprowadź tekst łącza..."
              className="w-full bg-[#1e1e1e] border border-neutral-600 rounded px-2.5 py-1.5 text-white focus:outline-none focus:border-[#0078d4]"
            />
          </div>

          <div>
            <label className="block text-neutral-300 mb-1">Adres internetowy (URL):</label>
            <input
              type="text"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full bg-[#1e1e1e] border border-neutral-600 rounded px-2.5 py-1.5 text-white focus:outline-none focus:border-[#0078d4]"
            />
          </div>
        </div>

        <div className="flex items-center justify-between px-4 py-3 bg-[#242424] border-t border-neutral-700">
          <button
            onClick={handleRemove}
            className="px-3 py-1.5 text-xs text-red-400 hover:bg-red-950/40 rounded transition-colors"
          >
            Usuń łącze
          </button>
          <div className="flex gap-2">
            <button
              onClick={handleApply}
              className="px-4 py-1.5 text-xs bg-[#0078d4] hover:bg-[#106ebe] text-white rounded transition-colors font-medium"
            >
              Wstaw
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded transition-colors"
            >
              Anuluj
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
