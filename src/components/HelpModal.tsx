import React, { useState } from 'react'
import { X, HelpCircle, Keyboard, BookOpen } from 'lucide-react'

interface HelpModalProps {
  isOpen: boolean
  onClose: () => void
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
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
        className={`w-[540px] bg-[#22262f]/95 text-neutral-200 border border-white/10 rounded-xl shadow-[0_24px_70px_rgba(0,0,0,0.85)] overflow-hidden relative z-10 backdrop-blur-xl ${
          isClosing ? 'anim-modal-out' : 'anim-modal-in'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3 bg-[#1a1d24]/90 border-b border-white/8">
          <div className="flex items-center gap-2.5">
            <HelpCircle size={16} className="text-[#388bfd]" />
            <span className="text-sm font-semibold text-white">Pomoc i skróty klawiszowe</span>
          </div>
          <button
            onClick={handleAnimatedClose}
            className="p-1 hover:bg-white/10 rounded text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs max-h-[70vh] overflow-y-auto">
          <div className="flex items-center gap-2 text-white font-semibold text-sm border-b border-white/8 pb-1.5">
            <Keyboard size={16} className="text-[#388bfd]" />
            <span>Skróty klawiszowe</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-neutral-300">
            <div className="p-2.5 bg-[#181b22] rounded-lg border border-white/6 flex justify-between items-center">
              <span>Pogrubienie</span>
              <kbd className="bg-neutral-800 border border-neutral-700 px-2 py-0.5 rounded text-[10px] text-white">Ctrl + B</kbd>
            </div>
            <div className="p-2.5 bg-[#181b22] rounded-lg border border-white/6 flex justify-between items-center">
              <span>Kursywa</span>
              <kbd className="bg-neutral-800 border border-neutral-700 px-2 py-0.5 rounded text-[10px] text-white">Ctrl + I</kbd>
            </div>
            <div className="p-2.5 bg-[#181b22] rounded-lg border border-white/6 flex justify-between items-center">
              <span>Podkreślenie</span>
              <kbd className="bg-neutral-800 border border-neutral-700 px-2 py-0.5 rounded text-[10px] text-white">Ctrl + U</kbd>
            </div>
            <div className="p-2.5 bg-[#181b22] rounded-lg border border-white/6 flex justify-between items-center">
              <span>Cofnij</span>
              <kbd className="bg-neutral-800 border border-neutral-700 px-2 py-0.5 rounded text-[10px] text-white">Ctrl + Z</kbd>
            </div>
            <div className="p-2.5 bg-[#181b22] rounded-lg border border-white/6 flex justify-between items-center">
              <span>Ponów</span>
              <kbd className="bg-neutral-800 border border-neutral-700 px-2 py-0.5 rounded text-[10px] text-white">Ctrl + Y</kbd>
            </div>
            <div className="p-2.5 bg-[#181b22] rounded-lg border border-white/6 flex justify-between items-center">
              <span>Zapisz</span>
              <kbd className="bg-neutral-800 border border-neutral-700 px-2 py-0.5 rounded text-[10px] text-white">Ctrl + S</kbd>
            </div>
            <div className="p-2.5 bg-[#181b22] rounded-lg border border-white/6 flex justify-between items-center">
              <span>Drukuj</span>
              <kbd className="bg-neutral-800 border border-neutral-700 px-2 py-0.5 rounded text-[10px] text-white">Ctrl + P</kbd>
            </div>
            <div className="p-2.5 bg-[#181b22] rounded-lg border border-white/6 flex justify-between items-center">
              <span>Znajdź</span>
              <kbd className="bg-neutral-800 border border-neutral-700 px-2 py-0.5 rounded text-[10px] text-white">Ctrl + F</kbd>
            </div>
            <div className="p-2.5 bg-[#181b22] rounded-lg border border-white/6 flex justify-between items-center">
              <span>Zamień</span>
              <kbd className="bg-neutral-800 border border-neutral-700 px-2 py-0.5 rounded text-[10px] text-white">Ctrl + H</kbd>
            </div>
            <div className="p-2.5 bg-[#181b22] rounded-lg border border-white/6 flex justify-between items-center">
              <span>Wstaw link</span>
              <kbd className="bg-neutral-800 border border-neutral-700 px-2 py-0.5 rounded text-[10px] text-white">Ctrl + K</kbd>
            </div>
          </div>

          <div className="flex items-center gap-2 text-white font-semibold text-sm border-b border-white/8 pb-1.5 pt-2">
            <BookOpen size={16} className="text-[#388bfd]" />
            <span>O edytorze ArcWord</span>
          </div>

          <div className="bg-[#181b22] p-3.5 rounded-lg border border-white/6 space-y-2 text-neutral-300">
            <p>
              ArcWord to lekki, nowoczesny edytor tekstu wzorowany na interfejsie Fluent Office.
              Wszystkie pliki zapisywane są lokalnie na komputerze z zachowaniem pełnej prywatności.
            </p>
          </div>
        </div>

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
