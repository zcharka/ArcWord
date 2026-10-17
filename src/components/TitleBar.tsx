import React, { useState } from 'react'
import {
  Save,
  Undo2,
  Redo2,
  Search,
  AlertTriangle,
  HelpCircle,
  Minus,
  Square,
  X,
  Share2,
  User,
  GitBranch,
  ExternalLink,
} from 'lucide-react'
import type { ScreenMode } from '../types'

interface TitleBarProps {
  screenMode: ScreenMode
  docTitle: string
  setDocTitle: (title: string) => void
  autosave: boolean
  setAutosave: (val: boolean) => void
  onSave: () => void
  onUndo: () => void
  onRedo: () => void
  canUndo: boolean
  canRedo: boolean
  onOpenHelp: () => void
  onOpenAccount: () => void
  onOpenShare: () => void
  onSearchFocus: () => void
  onCloseApp: () => void
}

export const TitleBar: React.FC<TitleBarProps> = ({
  screenMode,
  docTitle,
  setDocTitle,
  autosave,
  setAutosave,
  onSave,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onOpenHelp,
  onOpenAccount,
  onOpenShare,
  onSearchFocus,
  onCloseApp,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [tempTitle, setTempTitle] = useState(docTitle)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isAccountFlyoutOpen, setIsAccountFlyoutOpen] = useState(false)

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {})
      setIsFullscreen(true)
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {})
      }
      setIsFullscreen(false)
    }
  }

  const handleTitleSubmit = () => {
    if (tempTitle.trim()) {
      setDocTitle(tempTitle.trim())
    }
    setIsEditingTitle(false)
  }

  const handleMinimize = () => {
    if (window.electronAPI?.minimize) {
      window.electronAPI.minimize()
    }
  }

  const handleMaximize = () => {
    if (window.electronAPI?.maximize) {
      window.electronAPI.maximize()
      setIsFullscreen(!isFullscreen)
    } else {
      toggleFullscreen()
    }
  }

  const handleClose = () => {
    if (window.electronAPI?.close) {
      window.electronAPI.close()
    } else {
      onCloseApp()
    }
  }

  return (
    <div
      style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
      className="h-10 bg-[#1f1f1f] text-neutral-300 flex items-center justify-between px-2 select-none border-b border-[#2b2b2b] text-xs shrink-0 z-30"
    >
      {/* Left section */}
      <div
        style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
        className="flex items-center gap-1 min-w-[240px]"
      >
        {screenMode === 'editor' ? (
          <>
            {/* Autosave Switch */}
            <div className="flex items-center gap-1.5 mr-2 pl-1">
              <span className="text-[11px] text-neutral-300">Autozapis</span>
              <button
                onClick={() => setAutosave(!autosave)}
                title={autosave ? 'Autozapis jest włączony' : 'Autozapis jest wyłączony'}
                className={`w-7 h-4 rounded-full transition-colors relative flex items-center px-0.5 ${
                  autosave ? 'bg-[#0078d4]' : 'bg-neutral-600'
                }`}
              >
                <div
                  className={`w-3 h-3 rounded-full bg-white transition-transform ${
                    autosave ? 'translate-x-3' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Quick Access Toolbar */}
            <div className="flex items-center gap-0.5">
              <button
                onClick={onSave}
                title="Zapisz (Ctrl+S)"
                className="p-1.5 hover:bg-[#333333] active:bg-[#404040] rounded text-neutral-300 hover:text-white transition-colors"
              >
                <Save size={15} />
              </button>
              <button
                onClick={onUndo}
                disabled={!canUndo}
                title="Cofnij (Ctrl+Z)"
                className={`p-1.5 rounded transition-colors ${
                  canUndo
                    ? 'hover:bg-[#333333] active:bg-[#404040] text-neutral-300 hover:text-white'
                    : 'text-neutral-600 cursor-not-allowed'
                }`}
              >
                <Undo2 size={15} />
              </button>
              <button
                onClick={onRedo}
                disabled={!canRedo}
                title="Ponów (Ctrl+Y)"
                className={`p-1.5 rounded transition-colors ${
                  canRedo
                    ? 'hover:bg-[#333333] active:bg-[#404040] text-neutral-300 hover:text-white'
                    : 'text-neutral-600 cursor-not-allowed'
                }`}
              >
                <Redo2 size={15} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2 pl-2">
            <span className="text-sm font-semibold tracking-wide text-white">Word</span>
          </div>
        )}
      </div>

      {/* Center Section: Title & Search */}
      <div
        style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
        className="flex items-center justify-center gap-4 flex-1 max-w-xl"
      >
        {screenMode === 'editor' && (
          <div className="flex items-center gap-1.5">
            {isEditingTitle ? (
              <input
                type="text"
                value={tempTitle}
                onChange={e => setTempTitle(e.target.value)}
                onBlur={handleTitleSubmit}
                onKeyDown={e => e.key === 'Enter' && handleTitleSubmit()}
                autoFocus
                className="bg-[#2a2a2a] border border-[#0078d4] text-white px-2 py-0.5 rounded text-xs outline-none"
              />
            ) : (
              <span
                onClick={() => {
                  setTempTitle(docTitle)
                  setIsEditingTitle(true)
                }}
                title="Kliknij, aby zmienić nazwę dokumentu"
                className="text-neutral-200 hover:bg-[#2b2b2b] px-2 py-0.5 rounded cursor-pointer font-medium truncate max-w-[200px]"
              >
                {docTitle} - Word
              </span>
            )}
          </div>
        )}

        {screenMode === 'backstage' && (
          <span className="text-neutral-300 font-medium truncate">{docTitle} - Word</span>
        )}

        {screenMode === 'editor' && (
          <div
            onClick={onSearchFocus}
            className="flex items-center gap-2 bg-[#2a2a2a] hover:bg-[#333333] border border-neutral-700/60 rounded px-2.5 py-1 w-64 cursor-pointer text-neutral-400 hover:text-neutral-200 transition-colors"
          >
            <Search size={14} className="text-neutral-400" />
            <span className="text-[11px]">Wyszukaj</span>
          </div>
        )}
      </div>

      {/* Right Section: User & Window Controls */}
      <div
        style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
        className="flex items-center gap-1 min-w-[240px] justify-end"
      >
        {/* Warning badge */}
        <button
          title="Stan synchronizacji i ostrzeżenia"
          className="p-1.5 hover:bg-[#333333] active:scale-90 rounded text-amber-500 hover:text-amber-400 transition-all duration-150 cursor-pointer"
        >
          <AlertTriangle size={15} />
        </button>

        {/* User profile with animated flyout */}
        <div className="relative">
          <button
            onClick={() => setIsAccountFlyoutOpen(!isAccountFlyoutOpen)}
            title="Konto: Sebastian"
            className={`flex items-center gap-1.5 px-2 py-1 rounded cursor-pointer transition-all duration-150 hover:bg-[#2b2b2b] active:scale-85 group select-none shadow-xs ${
              isAccountFlyoutOpen ? 'bg-[#2b2b2b] ring-2 ring-[#0078d4]' : ''
            }`}
          >
            <span className="text-xs text-neutral-200 hidden sm:inline group-hover:text-white transition-colors">
              Sebastian
            </span>
            <div className="w-5 h-5 rounded-full bg-[#d83b01] group-hover:bg-[#f04f14] text-white font-semibold text-[10px] flex items-center justify-center shadow-sm transition-transform duration-200 group-hover:rotate-12 group-hover:scale-110">
              S
            </div>
          </button>

          {/* Animated Flyout Dropdown Menu */}
          {isAccountFlyoutOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsAccountFlyoutOpen(false)}
              />
              <div className="fixed top-10 right-16 z-50 w-76 bg-[#2b2b2b] border border-neutral-700 rounded-lg shadow-2xl p-4 anim-flyout text-neutral-200">
                <div className="flex items-center gap-3 pb-3 border-b border-neutral-700/70">
                  <div className="w-11 h-11 rounded-full bg-[#d83b01] text-white font-bold text-lg flex items-center justify-center shadow-md shrink-0">
                    S
                  </div>
                  <div className="overflow-hidden">
                    <h3 className="text-sm font-semibold text-white truncate">Sebastian</h3>
                    <p className="text-[11px] text-neutral-400">Użytkownik lokalny</p>
                    <span className="inline-block px-1.5 py-0.5 bg-blue-950/60 text-blue-400 border border-blue-800/40 rounded text-[9px] font-medium mt-0.5">
                      ArcWord Open Source
                    </span>
                  </div>
                </div>

                <div className="py-2 space-y-1 text-xs">
                  <a
                    href="https://github.com/zcharka/ArcWord"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-2 hover:bg-[#383838] rounded text-neutral-300 hover:text-white transition-colors group"
                  >
                    <span className="flex items-center gap-2">
                      <GitBranch size={14} className="text-[#0078d4]" />
                      <span>Repozytorium GitHub</span>
                    </span>
                    <ExternalLink size={12} className="text-neutral-500 group-hover:text-neutral-300" />
                  </a>

                  <button
                    onClick={() => {
                      setIsAccountFlyoutOpen(false)
                      onOpenAccount()
                    }}
                    className="w-full flex items-center gap-2 p-2 hover:bg-[#383838] rounded text-neutral-300 hover:text-white transition-colors text-left cursor-pointer"
                  >
                    <User size={14} className="text-emerald-400" />
                    <span>Szczegóły konta</span>
                  </button>
                </div>

                <div className="pt-2 border-t border-neutral-700/70 text-[10px] text-neutral-400 text-center">
                  ArcWord v1.0.0 — Wolne oprogramowanie
                </div>
              </div>
            </>
          )}
        </div>

        {screenMode === 'editor' && (
          <button
            onClick={onOpenShare}
            title="Udostępnij dokument"
            className="p-1.5 hover:bg-[#333333] active:scale-90 rounded text-neutral-300 hover:text-white transition-all duration-150 cursor-pointer"
          >
            <Share2 size={15} />
          </button>
        )}

        {/* Help */}
        <button
          onClick={onOpenHelp}
          title="Pomoc"
          className="p-1.5 hover:bg-[#333333] active:scale-90 rounded text-neutral-300 hover:text-white transition-all duration-150 cursor-pointer"
        >
          <HelpCircle size={15} />
        </button>


        {/* Window Controls */}
        <div
          style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
          className="flex items-center ml-2 border-l border-neutral-700 pl-1"
        >
          <button
            onClick={handleMinimize}
            title="Minimalizuj"
            className="w-8 h-8 flex items-center justify-center hover:bg-[#333333] text-neutral-400 hover:text-white transition-colors rounded"
          >
            <Minus size={14} />
          </button>
          <button
            onClick={handleMaximize}
            title={isFullscreen ? 'Przywróć okno' : 'Maksymalizuj'}
            className="w-8 h-8 flex items-center justify-center hover:bg-[#333333] text-neutral-400 hover:text-white transition-colors rounded"
          >
            <Square size={12} />
          </button>
          <button
            onClick={handleClose}
            title="Zamknij"
            className="w-8 h-8 flex items-center justify-center hover:bg-[#c42b1c] hover:text-white text-neutral-400 transition-colors rounded"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
