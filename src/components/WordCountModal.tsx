import React from 'react'
import { X } from 'lucide-react'

interface WordCountModalProps {
  isOpen: boolean
  onClose: () => void
  stats: {
    pages: number
    words: number
    charsWithoutSpaces: number
    charsWithSpaces: number
    paragraphs: number
    lines: number
  }
}

export const WordCountModal: React.FC<WordCountModalProps> = ({
  isOpen,
  onClose,
  stats,
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="w-[380px] bg-[#2b2b2b] text-neutral-200 border border-neutral-700 rounded shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#242424] border-b border-neutral-700/80">
          <span className="text-sm font-semibold text-white">Statystyka wyrazów</span>
          <button
            onClick={onClose}
            className="p-1 hover:bg-neutral-700 rounded text-neutral-400 hover:text-white"
          >
            <X size={15} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3 text-xs">
          <div className="flex justify-between border-b border-neutral-700/50 pb-1.5">
            <span className="text-neutral-400">Strony</span>
            <span className="font-semibold text-white">{stats.pages}</span>
          </div>
          <div className="flex justify-between border-b border-neutral-700/50 pb-1.5">
            <span className="text-neutral-400">Wyrazy</span>
            <span className="font-semibold text-white">{stats.words}</span>
          </div>
          <div className="flex justify-between border-b border-neutral-700/50 pb-1.5">
            <span className="text-neutral-400">Znaki (bez spacji)</span>
            <span className="font-semibold text-white">{stats.charsWithoutSpaces}</span>
          </div>
          <div className="flex justify-between border-b border-neutral-700/50 pb-1.5">
            <span className="text-neutral-400">Znaki (ze spacjami)</span>
            <span className="font-semibold text-white">{stats.charsWithSpaces}</span>
          </div>
          <div className="flex justify-between border-b border-neutral-700/50 pb-1.5">
            <span className="text-neutral-400">Akapity</span>
            <span className="font-semibold text-white">{stats.paragraphs}</span>
          </div>
          <div className="flex justify-between pb-1">
            <span className="text-neutral-400">Wiersze</span>
            <span className="font-semibold text-white">{stats.lines}</span>
          </div>

          <div className="pt-2 text-[11px] text-neutral-400 flex items-center gap-2">
            <input type="checkbox" defaultChecked className="rounded bg-neutral-800 border-neutral-600 accent-[#0078d4]" id="inc-box" />
            <label htmlFor="inc-box">Dołącz pola tekstowe, przypisy dolne i końcowe</label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end px-4 py-3 bg-[#242424] border-t border-neutral-700/80">
          <button
            onClick={onClose}
            className="px-5 py-1 text-xs bg-[#0078d4] hover:bg-[#106ebe] text-white rounded transition-colors"
          >
            Zamknij
          </button>
        </div>
      </div>
    </div>
  )
}
