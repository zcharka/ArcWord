import React, { useState } from 'react'
import {
  Save,
  Undo2,
  Redo2,
  Search,
  Minus,
  Square,
  X,
  Share2,
  User,
  GitBranch,
  ExternalLink,
} from 'lucide-react'
import type { ScreenMode } from '../types'
import { CURRENT_VERSION } from '../services/updater'

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
  onOpenHelp?: () => void
  onOpenAccount: () => void
  onOpenShare: () => void
  onSearchFocus: () => void
  onCloseApp: () => void
  userName?: string
  pageTheme?: 'dark' | 'light'
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
  onOpenHelp: _onOpenHelp,
  onOpenAccount,
  onOpenShare,
  onSearchFocus,
  onCloseApp,
  userName = 'Sebastian',
  pageTheme = 'dark',
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

  const isLight = pageTheme === 'light'
  const avatarInitial = (userName?.trim()?.charAt(0) || 'U').toUpperCase()

  return (
    <div
      style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
      className={`h-10 ${
        isLight
          ? 'bg-[#f3f3f3] text-neutral-800 border-neutral-300'
          : 'bg-[#181b22]/95 backdrop-blur-md text-neutral-300 border-white/6'
      } flex items-center justify-between px-2.5 select-none border-b text-xs shrink-0 z-30`}
    >
      {/* Left section */}
      <div
        style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
        className="flex items-center gap-1.5 min-w-[240px]"
      >
        {screenMode === 'editor' ? (
          <>
            {/* Autosave Switch */}
            <div className="flex items-center gap-2 mr-2 pl-1">
              <span className="text-[11px] text-neutral-300 font-medium">Autozapis</span>
              <button
                onClick={() => setAutosave(!autosave)}
                title={autosave ? 'Autozapis jest włączony' : 'Autozapis jest wyłączony'}
                className={`w-7 h-4 rounded-full transition-colors relative flex items-center px-0.5 cursor-pointer ${
                  autosave ? 'bg-[#388bfd]' : 'bg-neutral-600'
                }`}
              >
                <div
                  className={`w-3 h-3 rounded-full bg-white transition-transform shadow-xs ${
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
                className="p-1.5 hover:bg-white/10 active:scale-95 rounded text-neutral-300 hover:text-white transition-all cursor-pointer"
              >
                <Save size={15} />
              </button>
              <button
                onClick={onUndo}
                disabled={!canUndo}
                title="Cofnij (Ctrl+Z)"
                className={`p-1.5 rounded transition-all ${
                  canUndo
                    ? 'hover:bg-white/10 active:scale-95 text-neutral-300 hover:text-white cursor-pointer'
                    : 'text-neutral-600 cursor-not-allowed'
                }`}
              >
                <Undo2 size={15} />
              </button>
              <button
                onClick={onRedo}
                disabled={!canRedo}
                title="Ponów (Ctrl+Y)"
                className={`p-1.5 rounded transition-all ${
                  canRedo
                    ? 'hover:bg-white/10 active:scale-95 text-neutral-300 hover:text-white cursor-pointer'
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
                className="bg-[#242831] border border-[#388bfd] text-white px-2.5 py-0.5 rounded-md text-xs outline-none"
              />
            ) : (
              <span
                onClick={() => {
                  setTempTitle(docTitle)
                  setIsEditingTitle(true)
                }}
                title="Kliknij, aby zmienić nazwę dokumentu"
                className="text-neutral-200 hover:bg-white/5 px-2.5 py-1 rounded-md cursor-pointer font-medium truncate max-w-[220px] transition-colors"
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
            className="flex items-center gap-2 bg-[#252831]/80 hover:bg-[#2c303a]/90 border border-white/10 rounded-md px-3 py-1 w-72 cursor-pointer text-neutral-300 hover:text-white transition-all shadow-inner group"
          >
            <Search size={14} className="text-neutral-400 group-hover:text-white transition-colors" />
            <span className="text-[11px] text-neutral-300">Wyszukaj</span>
          </div>
        )}
      </div>

      {/* Right Section: User & Window Controls */}
      <div
        style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
        className="flex items-center gap-1 min-w-[240px] justify-end"
      >

        {/* User profile with animated flyout */}
        <div className="relative">
          <button
            onClick={() => setIsAccountFlyoutOpen(!isAccountFlyoutOpen)}
            title={`Konto: ${userName}`}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-lg cursor-pointer transition-all duration-150 active:scale-95 group select-none ${
              isLight ? 'hover:bg-neutral-200' : 'hover:bg-white/10'
            } ${
              isAccountFlyoutOpen
                ? isLight
                  ? 'bg-neutral-200 ring-2 ring-[#388bfd]'
                  : 'bg-white/10 ring-2 ring-[#388bfd]'
                : ''
            }`}
          >
            <span
              className={`text-xs hidden sm:inline transition-colors ${
                isLight
                  ? 'text-neutral-800 group-hover:text-black font-medium'
                  : 'text-neutral-200 group-hover:text-white'
              }`}
            >
              {userName}
            </span>
            <div className="w-5 h-5 rounded-full bg-[#d83b01] group-hover:bg-[#f04f14] text-white font-semibold text-[10px] flex items-center justify-center shadow-md transition-transform duration-200 group-hover:scale-105 ring-1 ring-white/20">
              {avatarInitial}
            </div>
          </button>

          {/* Animated Flyout Dropdown Menu */}
          {isAccountFlyoutOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsAccountFlyoutOpen(false)}
              />
              <div
                className={`fixed top-10 right-16 z-50 w-80 border rounded-xl p-4 anim-flyout backdrop-blur-xl ${
                  isLight
                    ? 'bg-white/95 border-neutral-200 text-neutral-800 shadow-[0_24px_70px_rgba(0,0,0,0.18)]'
                    : 'bg-[#22262f]/95 border-white/10 text-neutral-200 shadow-[0_24px_70px_rgba(0,0,0,0.85)]'
                }`}
              >
                <div
                  className={`flex items-center gap-3 pb-3 border-b ${
                    isLight ? 'border-neutral-200' : 'border-white/8'
                  }`}
                >
                  <div className="w-11 h-11 rounded-full bg-[#d83b01] text-white font-bold text-lg flex items-center justify-center shadow-md shrink-0 ring-2 ring-white/10">
                    {avatarInitial}
                  </div>
                  <div className="overflow-hidden">
                    <h3
                      className={`text-sm font-semibold truncate ${
                        isLight ? 'text-neutral-900' : 'text-white'
                      }`}
                    >
                      {userName}
                    </h3>
                    <p className={`text-[11px] ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>
                      Użytkownik lokalny
                    </p>
                    <span className="inline-block px-2 py-0.5 bg-blue-950/60 text-[#388bfd] border border-blue-800/40 rounded-md text-[9px] font-medium mt-1">
                      ArcWord Open Source
                    </span>
                  </div>
                </div>

                <div className="py-2 space-y-1 text-xs">
                  <a
                    href="https://github.com/zcharka/ArcWord"
                    target="_blank"
                    rel="noreferrer"
                    className={`flex items-center justify-between p-2 rounded-lg transition-colors group ${
                      isLight
                        ? 'hover:bg-neutral-100 text-neutral-700 hover:text-black'
                        : 'hover:bg-white/5 text-neutral-300 hover:text-white'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <GitBranch size={14} className="text-[#388bfd]" />
                      <span>Repozytorium GitHub</span>
                    </span>
                    <ExternalLink
                      size={12}
                      className={
                        isLight
                          ? 'text-neutral-400 group-hover:text-neutral-700'
                          : 'text-neutral-500 group-hover:text-neutral-300'
                      }
                    />
                  </a>

                  <button
                    onClick={() => {
                      setIsAccountFlyoutOpen(false)
                      onOpenAccount()
                    }}
                    className={`w-full flex items-center gap-2 p-2 rounded-lg transition-colors text-left cursor-pointer ${
                      isLight
                        ? 'hover:bg-neutral-100 text-neutral-700 hover:text-black'
                        : 'hover:bg-white/5 text-neutral-300 hover:text-white'
                    }`}
                  >
                    <User size={14} className="text-emerald-500" />
                    <span>Szczegóły konta</span>
                  </button>
                </div>

                <div
                  className={`pt-2 border-t text-[10px] text-center font-mono ${
                    isLight ? 'border-neutral-200 text-neutral-500' : 'border-white/8 text-neutral-400'
                  }`}
                >
                  ArcWord v{CURRENT_VERSION} — Wolne oprogramowanie
                </div>
              </div>
            </>
          )}
        </div>

        {screenMode === 'editor' && (
          <button
            onClick={onOpenShare}
            title="Udostępnij dokument"
            className={`p-1.5 active:scale-90 rounded transition-all duration-150 cursor-pointer ${
              isLight
                ? 'hover:bg-neutral-200 text-neutral-700'
                : 'hover:bg-[#333333] text-neutral-300 hover:text-white'
            }`}
          >
            <Share2 size={15} />
          </button>
        )}


        {/* Window Controls */}
        <div
          style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
          className={`flex items-center ml-2 border-l pl-1 ${
            isLight ? 'border-neutral-300' : 'border-neutral-700'
          }`}
        >
          <button
            onClick={handleMinimize}
            title="Minimalizuj"
            className={`w-8 h-8 flex items-center justify-center transition-colors rounded ${
              isLight ? 'hover:bg-neutral-200 text-neutral-600 hover:text-black' : 'hover:bg-[#333333] text-neutral-400 hover:text-white'
            }`}
          >
            <Minus size={14} />
          </button>
          <button
            onClick={handleMaximize}
            title={isFullscreen ? 'Przywróć okno' : 'Maksymalizuj'}
            className={`w-8 h-8 flex items-center justify-center transition-colors rounded ${
              isLight ? 'hover:bg-neutral-200 text-neutral-600 hover:text-black' : 'hover:bg-[#333333] text-neutral-400 hover:text-white'
            }`}
          >
            <Square size={12} />
          </button>
          <button
            onClick={handleClose}
            title="Zamknij"
            className={`w-8 h-8 flex items-center justify-center hover:bg-[#c42b1c] hover:text-white transition-colors rounded ${
              isLight ? 'text-neutral-600' : 'text-neutral-400'
            }`}
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
