import React from 'react'
import { X, User, Code2, ExternalLink, GitBranch, Heart } from 'lucide-react'
import { GITHUB_REPO_URL } from '../services/updater'

interface AccountModalProps {
  isOpen: boolean
  onClose: () => void
}

export const AccountModal: React.FC<AccountModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-[500px] bg-[#2b2b2b] text-neutral-200 border border-neutral-700 rounded shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-top-3 duration-200">
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#242424] border-b border-neutral-700">
          <div className="flex items-center gap-2">
            <User size={16} className="text-[#0078d4]" />
            <span className="text-sm font-semibold text-white">Konto użytkownika</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-neutral-700 rounded text-neutral-400 hover:text-white transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        <div className="p-6 space-y-5 text-xs">
          {/* User profile card (No email, no pro subscription) */}
          <div className="flex items-center gap-4 bg-[#202020] p-4 rounded border border-neutral-700/60">
            <div className="w-14 h-14 rounded-full bg-[#d83b01] text-white font-semibold text-xl flex items-center justify-center shadow-md">
              S
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-white">Sebastian</h3>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-blue-950/60 text-blue-400 border border-blue-800/40 rounded text-[11px] font-medium">
                <Code2 size={12} />
                <span>Użytkownik lokalny</span>
              </div>
            </div>
          </div>

          {/* Open-Source project information */}
          <div className="space-y-2 border-t border-neutral-700/60 pt-4">
            <div className="flex items-center justify-between">
              <h4 className="text-neutral-200 font-semibold text-xs flex items-center gap-1.5">
                <GitBranch size={14} className="text-[#0078d4]" />
                <span>Informacje o projekcie</span>
              </h4>
              <span className="text-[10px] text-green-400 bg-green-950/50 border border-green-800/40 px-2 py-0.5 rounded">
                Open Source
              </span>
            </div>

            <div className="bg-[#202020] p-3.5 rounded border border-neutral-700/40 space-y-2 text-neutral-300">
              <p className="text-white font-medium">ArcWord — Edytor dokumentów</p>
              <p className="text-neutral-400">
                Projekt o otwartym kodzie źródłowym, stworzony dla społeczności. Darmowy i wolny od opłat subskrypcyjnych.
              </p>
              <div className="pt-1 flex items-center justify-between text-[11px]">
                <span className="text-neutral-400">Repozytorium GitHub:</span>
                <a
                  href={GITHUB_REPO_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#2b88d8] hover:underline flex items-center gap-1 font-mono"
                >
                  github.com/zcharka/ArcWord <ExternalLink size={11} />
                </a>
              </div>
              <div className="flex items-center justify-between text-[11px] border-t border-neutral-700/30 pt-1.5">
                <span className="text-neutral-400">Licencja:</span>
                <span className="text-neutral-200">Wolne Oprogramowanie (Open Source)</span>
              </div>
            </div>
          </div>

          {/* Theme setting */}
          <div className="space-y-2 border-t border-neutral-700/60 pt-4">
            <h4 className="text-neutral-300 font-semibold">Motyw pakietu Office</h4>
            <div className="bg-[#202020] p-2.5 rounded border border-neutral-700/40 flex items-center justify-between">
              <span className="text-neutral-300">Ciemnoszary / Czarny (Aktywny)</span>
              <span className="text-neutral-400 text-[11px]">Domyślny dla ArcWord</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center px-4 py-3 bg-[#242424] border-t border-neutral-700">
          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-xs text-[#2b88d8] hover:text-blue-300 transition-colors"
          >
            <Heart size={13} className="text-pink-400" />
            <span>Wspieraj projekt na GitHub</span>
          </a>
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
