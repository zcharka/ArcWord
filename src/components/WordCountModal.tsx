import React, { useState } from 'react'
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
  const [isClosing, setIsClosing] = useState(false)

  if (!isOpen) return null

  const handleAnimatedClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      onClose()
      setIsClosing(false)
    }, 200)
  }

  return (
    <div
      className={`fixed inset-0 z-50 bg-black/65 backdrop-blur-md flex items-center justify-center p-4 select-none ${
        isClosing ? 'anim-backdrop-out' : 'animate-in fade-in duration-200'
      }`}
    >
      <div className="absolute inset-0" onClick={handleAnimatedClose} />
      <div
        className={`w-[400px] bg-[#22262f]/95 text-neutral-200 border border-white/10 rounded-xl shadow-[0_24px_70px_rgba(0,0,0,0.85)] overflow-hidden relative z-10 backdrop-blur-xl ${
          isClosing ? 'anim-modal-out' : 'anim-modal-in'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#1a1d24]/90 border-b border-white/8">
          <span className="text-sm font-semibold text-white">Statystyka wyrazów</span>
          <button
            onClick={handleAnimatedClose}
            className="p-1 hover:bg-white/10 rounded text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3 text-xs">
          <div className="flex justify-between border-b border-white/6 pb-2">
            <span className="text-neutral-400">Strony</span>
            <span className="font-semibold text-white">{stats.pages}</span>
          </div>
          <div className="flex justify-between border-b border-white/6 pb-2">
            <span className="text-neutral-400">Wyrazy</span>
            <span className="font-semibold text-white">{stats.words}</span>
          </div>
          <div className="flex justify-between border-b border-white/6 pb-2">
            <span className="text-neutral-400">Znaki (bez spacji)</span>
            <span className="font-semibold text-white">{stats.charsWithoutSpaces}</span>
          </div>
          <div className="flex justify-between border-b border-white/6 pb-2">
            <span className="text-neutral-400">Znaki (ze spacjami)</span>
            <span className="font-semibold text-white">{stats.charsWithSpaces}</span>
          </div>
          <div className="flex justify-between border-b border-white/6 pb-2">
            <span className="text-neutral-400">Akapity</span>
            <span className="font-semibold text-white">{stats.paragraphs}</span>
          </div>
          <div className="flex justify-between pb-1">
            <span className="text-neutral-400">Wiersze</span>
            <span className="font-semibold text-white">{stats.lines}</span>
          </div>

          <div className="pt-2 text-[11px] text-neutral-400 flex items-center gap-2">
            <input type="checkbox" defaultChecked className="rounded bg-neutral-800 border-neutral-600 accent-[#388bfd]" id="inc-box" />
            <label htmlFor="inc-box">Dołącz pola tekstowe, przypisy dolne i końcowe</label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end px-4 py-3 bg-[#1a1d24]/90 border-t border-white/8">
          <button
            onClick={handleAnimatedClose}
            className="px-5 py-1.5 text-xs bg-[#0078d4] hover:bg-[#106ebe] active:scale-95 text-white rounded-lg transition-all font-medium cursor-pointer shadow-md"
          >
            Zamknij
          </button>
        </div>
      </div>
    </div>
  )
}
