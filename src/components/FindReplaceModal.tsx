import React, { useState } from 'react'
import { X, Search } from 'lucide-react'
import { Editor } from '@tiptap/react'

interface FindReplaceModalProps {
  isOpen: boolean
  onClose: () => void
  editor: Editor | null
  initialTab?: 'find' | 'replace'
}

export const FindReplaceModal: React.FC<FindReplaceModalProps> = ({
  isOpen,
  onClose,
  editor,
  initialTab = 'find',
}) => {
  const [activeTab, setActiveTab] = useState<'find' | 'replace'>(initialTab)
  const [searchTerm, setSearchTerm] = useState('')
  const [replaceTerm, setReplaceTerm] = useState('')
  const [statusMessage, setStatusMessage] = useState('')
  const [isClosing, setIsClosing] = useState(false)

  if (!isOpen || !editor) return null

  const handleAnimatedClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      onClose()
      setIsClosing(false)
    }, 200)
  }

  const handleFind = () => {
    if (!searchTerm.trim()) return
    const content = editor.getText()
    const regex = new RegExp(searchTerm, 'gi')
    const matches = [...content.matchAll(regex)]
    if (matches.length > 0) {
      setStatusMessage(`Znaleziono ${matches.length} wystąpień tekstu "${searchTerm}"`)
    } else {
      setStatusMessage(`Nie znaleziono tekstu "${searchTerm}"`)
    }
  }

  const handleReplace = () => {
    if (!searchTerm.trim()) return
    const html = editor.getHTML()
    if (!html.includes(searchTerm)) {
      setStatusMessage(`Nie znaleziono tekstu "${searchTerm}"`)
      return
    }
    const updatedHtml = html.replace(searchTerm, replaceTerm)
    editor.commands.setContent(updatedHtml)
    setStatusMessage(`Zamieniono 1 wystąpienie`)
  }

  const handleReplaceAll = () => {
    if (!searchTerm.trim()) return
    const html = editor.getHTML()
    const count = (html.match(new RegExp(searchTerm, 'g')) || []).length
    if (count === 0) {
      setStatusMessage(`Nie znaleziono tekstu "${searchTerm}"`)
      return
    }
    const updatedHtml = html.replaceAll(searchTerm, replaceTerm)
    editor.commands.setContent(updatedHtml)
    setStatusMessage(`Pomyślnie zamieniono ${count} wystąpień`)
  }

  return (
    <div
      className={`fixed inset-0 z-50 bg-black/65 backdrop-blur-md flex items-center justify-center p-4 select-none ${
        isClosing ? 'anim-backdrop-out' : 'animate-in fade-in duration-200'
      }`}
    >
      <div className="absolute inset-0" onClick={handleAnimatedClose} />
      <div
        className={`w-[480px] bg-[#22262f]/95 text-neutral-200 border border-white/10 rounded-xl shadow-[0_24px_70px_rgba(0,0,0,0.85)] overflow-hidden relative z-10 backdrop-blur-xl ${
          isClosing ? 'anim-modal-out' : 'anim-modal-in'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#1a1d24]/90 border-b border-white/8">
          <div className="flex items-center gap-2">
            <Search size={16} className="text-[#388bfd]" />
            <span className="text-sm font-semibold text-white">Znajdowanie i zamienianie</span>
          </div>
          <button
            onClick={handleAnimatedClose}
            className="p-1 hover:bg-white/10 rounded text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        {/* Tab Headers */}
        <div className="flex border-b border-white/8 px-4 bg-[#181b22]/90 text-xs">
          <button
            onClick={() => setActiveTab('find')}
            className={`py-2 px-3 font-medium transition-colors border-b-2 ${
              activeTab === 'find'
                ? 'border-[#388bfd] text-white'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Znajdź
          </button>
          <button
            onClick={() => setActiveTab('replace')}
            className={`py-2 px-3 font-medium transition-colors border-b-2 ${
              activeTab === 'replace'
                ? 'border-[#388bfd] text-white'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Zamień
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          <div>
            <label className="block text-neutral-300 mb-1.5 font-medium">Znajdź:</label>
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Wpisz szukany tekst..."
              className="w-full bg-[#181b22] border border-white/10 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-[#388bfd]"
              autoFocus
            />
          </div>

          {activeTab === 'replace' && (
            <div>
              <label className="block text-neutral-300 mb-1.5 font-medium">Zamień na:</label>
              <input
                type="text"
                value={replaceTerm}
                onChange={e => setReplaceTerm(e.target.value)}
                placeholder="Nowy tekst..."
                className="w-full bg-[#181b22] border border-white/10 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-[#388bfd]"
              />
            </div>
          )}

          {statusMessage && (
            <p className="text-[11px] text-[#388bfd] bg-blue-950/40 p-2.5 rounded-lg border border-blue-900/40 anim-scale-in">
              {statusMessage}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#1a1d24]/90 border-t border-white/8">
          <div className="text-[11px] text-neutral-400">
            {activeTab === 'replace' ? 'Dostępne operacje zamiany' : 'Wyszukiwanie w treści'}
          </div>
          <div className="flex gap-2">
            {activeTab === 'find' ? (
              <button
                onClick={handleFind}
                className="px-4 py-1.5 text-xs bg-[#0078d4] hover:bg-[#106ebe] active:scale-95 text-white rounded-lg transition-all font-medium cursor-pointer shadow-md"
              >
                Znajdź
              </button>
            ) : (
              <>
                <button
                  onClick={handleReplace}
                  className="px-3 py-1.5 text-xs bg-neutral-700/80 hover:bg-neutral-600 active:scale-95 text-white rounded-lg transition-all cursor-pointer"
                >
                  Zamień
                </button>
                <button
                  onClick={handleReplaceAll}
                  className="px-3 py-1.5 text-xs bg-[#0078d4] hover:bg-[#106ebe] active:scale-95 text-white rounded-lg transition-all font-medium cursor-pointer shadow-md"
                >
                  Zamień wszystko
                </button>
              </>
            )}
            <button
              onClick={handleAnimatedClose}
              className="px-3 py-1.5 text-xs bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 rounded-lg transition-colors cursor-pointer"
            >
              Anuluj
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
