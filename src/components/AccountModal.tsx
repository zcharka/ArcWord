import React, { useState } from 'react'
import { X, User, Code2, ExternalLink, GitBranch, Heart } from 'lucide-react'
import { GITHUB_REPO_URL } from '../services/updater'

interface AccountModalProps {
  isOpen: boolean
  onClose: () => void
  userName?: string
  setUserName?: (name: string) => void
  pageTheme?: 'dark' | 'light'
}

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  userName = 'Sebastian',
  setUserName,
  pageTheme = 'dark',
}) => {
  const [isClosing, setIsClosing] = useState(false)
  const [isEditingName, setIsEditingName] = useState(false)
  const [editNameVal, setEditNameVal] = useState(userName)

  if (!isOpen) return null

  const avatarInitial = (userName?.trim()?.charAt(0) || 'U').toUpperCase()
  const isLight = pageTheme === 'light'

  const handleAnimatedClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      onClose()
      setIsClosing(false)
    }, 200)
  }

  const handleSaveName = () => {
    if (editNameVal.trim() && setUserName) {
      setUserName(editNameVal.trim())
    }
    setIsEditingName(false)
  }

  return (
    <div
      className={`fixed inset-0 z-50 bg-black/65 backdrop-blur-md flex items-center justify-center p-4 select-none ${
        isClosing ? 'anim-backdrop-out' : 'animate-in fade-in duration-200'
      }`}
    >
      <div className="absolute inset-0" onClick={handleAnimatedClose} />
      <div
        className={`w-[520px] ${
          isLight
            ? 'bg-white/95 text-neutral-800 border-neutral-200 shadow-[0_24px_70px_rgba(0,0,0,0.18)]'
            : 'bg-[#22262f]/95 text-neutral-200 border-white/10 shadow-[0_24px_70px_rgba(0,0,0,0.85)]'
        } border rounded-xl overflow-hidden relative z-10 backdrop-blur-xl ${
          isClosing ? 'anim-modal-out' : 'anim-modal-in'
        }`}
      >
        <div
          className={`flex items-center justify-between px-4 py-3 ${
            isLight ? 'bg-neutral-100 border-neutral-200' : 'bg-[#1a1d24]/90 border-white/8'
          } border-b`}
        >
          <div className="flex items-center gap-2.5">
            <User size={16} className="text-[#388bfd]" />
            <span className={`text-sm font-semibold ${isLight ? 'text-neutral-900' : 'text-white'}`}>
              Konto użytkownika
            </span>
          </div>
          <button
            onClick={handleAnimatedClose}
            className={`p-1 rounded transition-colors cursor-pointer ${
              isLight ? 'hover:bg-neutral-200 text-neutral-600' : 'hover:bg-white/10 text-neutral-400 hover:text-white'
            }`}
          >
            <X size={15} />
          </button>
        </div>

        <div className="p-6 space-y-5 text-xs">
          {/* User profile card (No email, no pro subscription) */}
          <div
            className={`flex items-center gap-4 ${
              isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#181b22] border-white/8'
            } p-4 rounded-xl border shadow-inner`}
          >
            <div className="w-14 h-14 rounded-full bg-[#d83b01] text-white font-semibold text-xl flex items-center justify-center shadow-lg ring-2 ring-white/10">
              {avatarInitial}
            </div>
            <div className="space-y-1 flex-1">
              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editNameVal}
                    onChange={e => setEditNameVal(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') handleSaveName()
                      if (e.key === 'Escape') setIsEditingName(false)
                    }}
                    autoFocus
                    className={`px-2 py-1 rounded text-sm font-semibold border ${
                      isLight
                        ? 'bg-white border-neutral-300 text-neutral-900'
                        : 'bg-[#12141a] border-neutral-700 text-white'
                    } focus:outline-hidden focus:ring-1 focus:ring-[#388bfd]`}
                  />
                  <button
                    onClick={handleSaveName}
                    className="px-2.5 py-1 bg-[#0078d4] text-white rounded text-xs font-medium cursor-pointer"
                  >
                    Zapisz
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h3 className={`text-base font-semibold ${isLight ? 'text-neutral-900' : 'text-white'}`}>
                    {userName}
                  </h3>
                  <button
                    onClick={() => {
                      setEditNameVal(userName)
                      setIsEditingName(true)
                    }}
                    className="text-[11px] text-[#388bfd] hover:underline cursor-pointer"
                  >
                    (zmień nazwę)
                  </button>
                </div>
              )}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-blue-950/60 text-[#388bfd] border border-blue-800/40 rounded-md text-[11px] font-medium">
                <Code2 size={12} />
                <span>Użytkownik lokalny</span>
              </div>
            </div>
          </div>

          {/* Open-Source project information */}
          <div className="space-y-2 border-t border-white/8 pt-4">
            <div className="flex items-center justify-between">
              <h4 className="text-neutral-200 font-semibold text-xs flex items-center gap-1.5">
                <GitBranch size={14} className="text-[#388bfd]" />
                <span>Informacje o projekcie</span>
              </h4>
              <span className="text-[10px] text-green-400 bg-green-950/50 border border-green-800/40 px-2 py-0.5 rounded">
                Open Source
              </span>
            </div>

            <div className="bg-[#181b22] p-4 rounded-xl border border-white/6 space-y-2 text-neutral-300">
              <p className="text-white font-medium">ArcWord — Edytor dokumentów</p>
              <p className="text-neutral-400 leading-relaxed">
                Projekt o otwartym kodzie źródłowym, stworzony dla społeczności. Darmowy i wolny od wszelkich opłat subskrypcyjnych.
              </p>
              <div className="pt-1 flex items-center justify-between text-[11px]">
                <span className="text-neutral-400">Repozytorium GitHub:</span>
                <a
                  href={GITHUB_REPO_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#388bfd] hover:underline flex items-center gap-1 font-mono"
                >
                  github.com/zcharka/ArcWord <ExternalLink size={11} />
                </a>
              </div>
              <div className="flex items-center justify-between text-[11px] border-t border-white/6 pt-2">
                <span className="text-neutral-400">Licencja:</span>
                <span className="text-neutral-200 font-medium">Wolne Oprogramowanie (Open Source)</span>
              </div>
            </div>
          </div>

          {/* Theme setting */}
          <div className="space-y-2 border-t border-white/8 pt-4">
            <h4 className="text-neutral-300 font-semibold">Motyw pakietu Office</h4>
            <div className="bg-[#181b22] p-3 rounded-lg border border-white/6 flex items-center justify-between">
              <span className="text-neutral-300">Ciemnoszary / Czarny mica (Aktywny)</span>
              <span className="text-neutral-400 text-[11px]">Domyślny dla ArcWord</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center px-4 py-3 bg-[#1a1d24]/90 border-t border-white/8">
          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-xs text-[#388bfd] hover:text-blue-300 transition-colors"
          >
            <Heart size={13} className="text-pink-400" />
            <span>Wspieraj projekt na GitHub</span>
          </a>
          <button
            onClick={handleAnimatedClose}
            className="px-4 py-1.5 bg-[#0078d4] hover:bg-[#106ebe] active:scale-95 text-white rounded-lg transition-all text-xs font-medium cursor-pointer shadow-md"
          >
            Zamknij
          </button>
        </div>
      </div>
    </div>
  )
}
