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
  const [isClosing, setIsClosing] = useState(false)

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

  const handleAnimatedClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      onClose()
      setIsClosing(false)
    }, 200)
  }

  const handleApply = () => {
    if (!url.trim()) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      handleAnimatedClose()
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
    handleAnimatedClose()
  }

  const handleRemove = () => {
    editor.chain().focus().extendMarkRange('link').unsetLink().run()
    handleAnimatedClose()
  }

  return (
    <div
      className={`fixed inset-0 z-50 bg-black/65 backdrop-blur-md flex items-center justify-center p-4 select-none ${
        isClosing ? 'anim-backdrop-out' : 'animate-in fade-in duration-200'
      }`}
    >
      <div className="absolute inset-0" onClick={handleAnimatedClose} />
      <div
        className={`w-[440px] bg-[#22262f]/95 text-neutral-200 border border-white/10 rounded-xl shadow-[0_24px_70px_rgba(0,0,0,0.85)] overflow-hidden relative z-10 backdrop-blur-xl ${
          isClosing ? 'anim-modal-out' : 'anim-modal-in'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3 bg-[#1a1d24]/90 border-b border-white/8">
          <div className="flex items-center gap-2.5">
            <Link2 size={16} className="text-[#388bfd]" />
            <span className="text-sm font-semibold text-white">Wstawianie hiperłącza</span>
          </div>
          <button
            onClick={handleAnimatedClose}
            className="p-1 hover:bg-white/10 rounded text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        <div className="p-5 space-y-3.5 text-xs">
          <div>
            <label className="block text-neutral-300 mb-1.5 font-medium">Tekst do wyświetlenia:</label>
            <input
              type="text"
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Wprowadź tekst łącza..."
              className="w-full bg-[#181b22] border border-white/10 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-[#388bfd]"
            />
          </div>

          <div>
            <label className="block text-neutral-300 mb-1.5 font-medium">Adres internetowy (URL):</label>
            <input
              type="text"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full bg-[#181b22] border border-white/10 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-[#388bfd]"
            />
          </div>
        </div>

        <div className="flex items-center justify-between px-4 py-3 bg-[#1a1d24]/90 border-t border-white/8">
          <button
            onClick={handleRemove}
            className="px-3 py-1.5 text-xs text-red-400 hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer"
          >
            Usuń łącze
          </button>
          <div className="flex gap-2">
            <button
              onClick={handleApply}
              className="px-4 py-1.5 text-xs bg-[#0078d4] hover:bg-[#106ebe] active:scale-95 text-white rounded-lg transition-all font-medium cursor-pointer shadow-md"
            >
              Wstaw
            </button>
            <button
              onClick={handleAnimatedClose}
              className="px-3.5 py-1.5 text-xs bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 rounded-lg transition-colors cursor-pointer"
            >
              Anuluj
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
