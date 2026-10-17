import React, { useState } from 'react'
import { X } from 'lucide-react'
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

  if (!isOpen || !editor) return null

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
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="w-[440px] bg-[#2b2b2b] text-neutral-200 border border-neutral-700 rounded shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#242424] border-b border-neutral-700">
          <span className="text-sm font-semibold text-white">Znajdowanie i zamienianie</span>
          <button
            onClick={onClose}
            className="p-1 hover:bg-neutral-700 rounded text-neutral-400 hover:text-white"
          >
            <X size={15} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-neutral-700 bg-[#262626] text-xs px-2 pt-1">
          <button
            onClick={() => setActiveTab('find')}
            className={`px-4 py-1.5 font-medium border-b-2 transition-colors ${
              activeTab === 'find'
                ? 'border-[#0078d4] text-white bg-[#2b2b2b]'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            Znajdź
          </button>
          <button
            onClick={() => setActiveTab('replace')}
            className={`px-4 py-1.5 font-medium border-b-2 transition-colors ${
              activeTab === 'replace'
                ? 'border-[#0078d4] text-white bg-[#2b2b2b]'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            Zamień
          </button>
        </div>

        {/* Inputs */}
        <div className="p-4 space-y-3 text-xs">
          <div>
            <label className="block text-neutral-300 mb-1">Znajdź:</label>
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Wpisz szukany tekst..."
              className="w-full bg-[#1e1e1e] border border-neutral-600 rounded px-2.5 py-1.5 text-white focus:outline-none focus:border-[#0078d4]"
              autoFocus
            />
          </div>

          {activeTab === 'replace' && (
            <div>
              <label className="block text-neutral-300 mb-1">Zamień na:</label>
              <input
                type="text"
                value={replaceTerm}
                onChange={e => setReplaceTerm(e.target.value)}
                placeholder="Nowy tekst..."
                className="w-full bg-[#1e1e1e] border border-neutral-600 rounded px-2.5 py-1.5 text-white focus:outline-none focus:border-[#0078d4]"
              />
            </div>
          )}

          {statusMessage && (
            <p className="text-[11px] text-blue-400 bg-blue-950/40 p-2 rounded border border-blue-900/40">
              {statusMessage}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#242424] border-t border-neutral-700">
          <div className="text-[11px] text-neutral-400">
            {activeTab === 'replace' ? 'Dostępne operacje zamiany' : 'Wyszukiwanie w treści'}
          </div>
          <div className="flex gap-2">
            {activeTab === 'find' ? (
              <button
                onClick={handleFind}
                className="px-4 py-1.5 text-xs bg-[#0078d4] hover:bg-[#106ebe] text-white rounded transition-colors font-medium"
              >
                Znajdź
              </button>
            ) : (
              <>
                <button
                  onClick={handleReplace}
                  className="px-3 py-1.5 text-xs bg-neutral-700 hover:bg-neutral-600 text-white rounded transition-colors"
                >
                  Zamień
                </button>
                <button
                  onClick={handleReplaceAll}
                  className="px-3 py-1.5 text-xs bg-[#0078d4] hover:bg-[#106ebe] text-white rounded transition-colors font-medium"
                >
                  Zamień wszystko
                </button>
              </>
            )}
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
