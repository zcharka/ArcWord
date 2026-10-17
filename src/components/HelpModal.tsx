import React from 'react'
import { X, HelpCircle, Keyboard, BookOpen } from 'lucide-react'

interface HelpModalProps {
  isOpen: boolean
  onClose: () => void
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="w-[520px] bg-[#2b2b2b] text-neutral-200 border border-neutral-700 rounded shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#242424] border-b border-neutral-700">
          <div className="flex items-center gap-2">
            <HelpCircle size={16} className="text-[#0078d4]" />
            <span className="text-sm font-semibold text-white">Pomoc i skróty klawiszowe</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-neutral-700 rounded text-neutral-400 hover:text-white"
          >
            <X size={15} />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs max-h-[70vh] overflow-y-auto">
          <div className="flex items-center gap-2 text-white font-semibold text-sm border-b border-neutral-700 pb-1">
            <Keyboard size={16} className="text-[#0078d4]" />
            <span>Skróty klawiszowe</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-neutral-300">
            <div className="p-2 bg-[#202020] rounded border border-neutral-700/60 flex justify-between">
              <span>Pogrubienie</span>
              <kbd className="bg-neutral-800 px-1.5 py-0.5 rounded text-[10px] text-white">Ctrl + B</kbd>
            </div>
            <div className="p-2 bg-[#202020] rounded border border-neutral-700/60 flex justify-between">
              <span>Kursywa</span>
              <kbd className="bg-neutral-800 px-1.5 py-0.5 rounded text-[10px] text-white">Ctrl + I</kbd>
            </div>
            <div className="p-2 bg-[#202020] rounded border border-neutral-700/60 flex justify-between">
              <span>Podkreślenie</span>
              <kbd className="bg-neutral-800 px-1.5 py-0.5 rounded text-[10px] text-white">Ctrl + U</kbd>
            </div>
            <div className="p-2 bg-[#202020] rounded border border-neutral-700/60 flex justify-between">
              <span>Cofnij</span>
              <kbd className="bg-neutral-800 px-1.5 py-0.5 rounded text-[10px] text-white">Ctrl + Z</kbd>
            </div>
            <div className="p-2 bg-[#202020] rounded border border-neutral-700/60 flex justify-between">
              <span>Ponów</span>
              <kbd className="bg-neutral-800 px-1.5 py-0.5 rounded text-[10px] text-white">Ctrl + Y</kbd>
            </div>
            <div className="p-2 bg-[#202020] rounded border border-neutral-700/60 flex justify-between">
              <span>Zapisz</span>
              <kbd className="bg-neutral-800 px-1.5 py-0.5 rounded text-[10px] text-white">Ctrl + S</kbd>
            </div>
            <div className="p-2 bg-[#202020] rounded border border-neutral-700/60 flex justify-between">
              <span>Drukuj</span>
              <kbd className="bg-neutral-800 px-1.5 py-0.5 rounded text-[10px] text-white">Ctrl + P</kbd>
            </div>
            <div className="p-2 bg-[#202020] rounded border border-neutral-700/60 flex justify-between">
              <span>Wyszukaj</span>
              <kbd className="bg-neutral-800 px-1.5 py-0.5 rounded text-[10px] text-white">Ctrl + F</kbd>
            </div>
          </div>

          <div className="flex items-center gap-2 text-white font-semibold text-sm border-b border-neutral-700 pb-1 pt-2">
            <BookOpen size={16} className="text-[#0078d4]" />
            <span>O programie ArcWord</span>
          </div>
          <p className="text-neutral-400 leading-relaxed">
            ArcWord to wierna i w pełni interaktywna implementacja edytora tekstu opartego na Microsoft Word w ciemnym motywie Fluent UI. Oferuje pełną obsługę formatowania tekstu, stylów nagłówków, tabel, autozapisu, szablony dokumentów oraz eksport do popularnych formatów biurowych.
          </p>
        </div>

        <div className="flex justify-end px-4 py-2.5 bg-[#242424] border-t border-neutral-700">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#0078d4] hover:bg-[#106ebe] text-white rounded transition-colors text-xs font-medium"
          >
            Zamknij
          </button>
        </div>
      </div>
    </div>
  )
}
