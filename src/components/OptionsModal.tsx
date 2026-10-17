import React, { useState } from 'react'
import { X, Settings, Check, RefreshCw, Sparkles, ExternalLink, Download } from 'lucide-react'
import {
  checkGitHubRelease,
  CURRENT_VERSION,
  GITHUB_REPO_URL,
  type ReleaseInfo,
  type UpdateStatus,
} from '../services/updater'

interface OptionsModalProps {
  isOpen: boolean
  onClose: () => void
  autosave: boolean
  setAutosave: (val: boolean) => void
  pageTheme: 'dark' | 'light'
  setPageTheme: (theme: 'dark' | 'light') => void
  onUpdateFound?: (release: ReleaseInfo) => void
}

export const OptionsModal: React.FC<OptionsModalProps> = ({
  isOpen,
  onClose,
  autosave,
  setAutosave,
  pageTheme,
  setPageTheme,
  onUpdateFound,
}) => {
  const [activeCategory, setActiveCategory] = useState<
    'general' | 'display' | 'save' | 'updates' | 'language'
  >('general')

  const [updateStatus, setUpdateStatus] = useState<UpdateStatus>('idle')
  const [updateMessage, setUpdateMessage] = useState<string>('')
  const [foundRelease, setFoundRelease] = useState<ReleaseInfo | null>(null)
  const [autoCheckUpdates, setAutoCheckUpdates] = useState<boolean>(true)

  if (!isOpen) return null

  const handleCheckUpdates = async () => {
    setUpdateStatus('checking')
    setUpdateMessage('Łączenie z serwerem GitHub (api.github.com)...')

    const result = await checkGitHubRelease()

    if (result.error && !result.release) {
      setUpdateStatus('error')
      setUpdateMessage(result.error)
      return
    }

    if (result.isUpdateAvailable && result.release) {
      setUpdateStatus('available')
      setFoundRelease(result.release)
      setUpdateMessage(`Dostępna jest nowa wersja: ${result.release.version}!`)
      if (onUpdateFound) {
        onUpdateFound(result.release)
      }
    } else {
      setUpdateStatus('up-to-date')
      setUpdateMessage(`Masz zainstalowaną najnowszą wersję ArcWord (v${CURRENT_VERSION}).`)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-[660px] h-[520px] bg-[#2b2b2b] text-neutral-200 border border-neutral-700 rounded shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-top-3 duration-200">
        {/* Title */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#242424] border-b border-neutral-700">
          <div className="flex items-center gap-2">
            <Settings size={16} className="text-[#0078d4]" />
            <span className="text-sm font-semibold text-white">Opcje programu ArcWord</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-neutral-700 rounded text-neutral-400 hover:text-white transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Body with sidebar & main */}
        <div className="flex flex-1 overflow-hidden">
          {/* Categories Sidebar */}
          <div className="w-48 bg-[#202020] border-r border-neutral-700/80 p-2 space-y-1 text-xs">
            <button
              onClick={() => setActiveCategory('general')}
              className={`w-full text-left px-3 py-2 rounded transition-colors ${
                activeCategory === 'general'
                  ? 'bg-[#0078d4] text-white font-medium'
                  : 'text-neutral-300 hover:bg-neutral-800'
              }`}
            >
              Ogólne
            </button>
            <button
              onClick={() => setActiveCategory('display')}
              className={`w-full text-left px-3 py-2 rounded transition-colors ${
                activeCategory === 'display'
                  ? 'bg-[#0078d4] text-white font-medium'
                  : 'text-neutral-300 hover:bg-neutral-800'
              }`}
            >
              Wyświetlanie
            </button>
            <button
              onClick={() => setActiveCategory('save')}
              className={`w-full text-left px-3 py-2 rounded transition-colors ${
                activeCategory === 'save'
                  ? 'bg-[#0078d4] text-white font-medium'
                  : 'text-neutral-300 hover:bg-neutral-800'
              }`}
            >
              Zapisywanie
            </button>
            <button
              onClick={() => setActiveCategory('updates')}
              className={`w-full text-left px-3 py-2 rounded transition-colors flex items-center justify-between ${
                activeCategory === 'updates'
                  ? 'bg-[#0078d4] text-white font-medium'
                  : 'text-neutral-300 hover:bg-neutral-800'
              }`}
            >
              <span>Aktualizacje</span>
              <Sparkles size={12} className="text-amber-400" />
            </button>
            <button
              onClick={() => setActiveCategory('language')}
              className={`w-full text-left px-3 py-2 rounded transition-colors ${
                activeCategory === 'language'
                  ? 'bg-[#0078d4] text-white font-medium'
                  : 'text-neutral-300 hover:bg-neutral-800'
              }`}
            >
              Język
            </button>
          </div>

          {/* Details */}
          <div className="flex-1 p-6 overflow-y-auto text-xs space-y-4">
            {activeCategory === 'general' && (
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-white border-b border-neutral-700/80 pb-1">
                  Opcje interfejsu użytkownika
                </h4>
                <div className="space-y-2.5">
                  <label className="flex items-center gap-2 text-neutral-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autosave}
                      onChange={e => setAutosave(e.target.checked)}
                      className="accent-[#0078d4]"
                    />
                    <span>Włącz automatyczny zapis w tle (Autozapis co 5 sekund)</span>
                  </label>
                  <label className="flex items-center gap-2 text-neutral-300 cursor-pointer">
                    <input type="checkbox" defaultChecked className="accent-[#0078d4]" />
                    <span>Płynne animacje przejść Fluent Motion (60 FPS)</span>
                  </label>
                  <label className="flex items-center gap-2 text-neutral-300 cursor-pointer">
                    <input type="checkbox" defaultChecked className="accent-[#0078d4]" />
                    <span>Pokaż podgląd stylów nagłówków na żywo</span>
                  </label>
                </div>

                <h4 className="text-sm font-semibold text-white border-b border-neutral-700/80 pb-1 pt-3">
                  Personalizacja użytkownika
                </h4>
                <div className="space-y-2">
                  <div>
                    <label className="block text-neutral-400 mb-1">Nazwa użytkownika:</label>
                    <input
                      type="text"
                      defaultValue="Sebastian"
                      className="w-full bg-[#1e1e1e] border border-neutral-600 rounded px-2.5 py-1 text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeCategory === 'display' && (
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-white border-b border-neutral-700/80 pb-1">
                  Wygląd arkusza dokumentu
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-neutral-300 mb-2 font-medium">
                      Domyślny kolor tła strony:
                    </label>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setPageTheme('dark')}
                        className={`flex items-center gap-2 px-3.5 py-2.5 rounded border transition-all ${
                          pageTheme === 'dark'
                            ? 'border-[#0078d4] bg-[#0078d4]/20 text-white shadow-sm'
                            : 'border-neutral-600 bg-neutral-800 text-neutral-400'
                        }`}
                      >
                        <div className="w-4 h-4 rounded bg-[#242424] border border-neutral-600" />
                        <span>Ciemny arkusz (Tryb nocny Word)</span>
                      </button>

                      <button
                        onClick={() => setPageTheme('light')}
                        className={`flex items-center gap-2 px-3.5 py-2.5 rounded border transition-all ${
                          pageTheme === 'light'
                            ? 'border-[#0078d4] bg-[#0078d4]/20 text-white shadow-sm'
                            : 'border-neutral-600 bg-neutral-800 text-neutral-400'
                        }`}
                      >
                        <div className="w-4 h-4 rounded bg-white border border-neutral-300" />
                        <span>Jasny arkusz (Klasyczny biały)</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeCategory === 'save' && (
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-white border-b border-neutral-700/80 pb-1">
                  Zapisywanie dokumentów
                </h4>
                <div className="space-y-2 text-neutral-300">
                  <p>Format domyślny: Plik HTML / DOCX kompatybilny z MS Word</p>
                  <p>Interwał autozapisu: co 5 sekund podczas pisania</p>
                  <p>Lokalizacja pamięci: Pamięć lokalna (LocalStorage) i pliki systemowe</p>
                </div>
              </div>
            )}

            {/* UPDATES CATEGORY (PRIORYTET) */}
            {activeCategory === 'updates' && (
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-white border-b border-neutral-700/80 pb-1 flex items-center justify-between">
                  <span>Aktualizacje programu ArcWord</span>
                  <span className="text-[11px] font-mono text-neutral-400 font-normal">
                    Wersja: v{CURRENT_VERSION}
                  </span>
                </h4>

                <div className="p-4 bg-[#202020] rounded border border-neutral-700/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-semibold text-white">Sprawdzanie wydań GitHub</h5>
                      <p className="text-neutral-400 text-[11px]">
                        Źródło: github.com/zcharka/ArcWord/releases
                      </p>
                    </div>

                    <button
                      onClick={handleCheckUpdates}
                      disabled={updateStatus === 'checking'}
                      className="flex items-center gap-2 px-3.5 py-1.5 bg-[#0078d4] hover:bg-[#106ebe] disabled:bg-neutral-700 text-white rounded font-medium transition-colors cursor-pointer"
                    >
                      <RefreshCw
                        size={13}
                        className={updateStatus === 'checking' ? 'animate-spin' : ''}
                      />
                      <span>
                        {updateStatus === 'checking'
                          ? 'Sprawdzanie...'
                          : 'Sprawdź dostępność aktualizacji'}
                      </span>
                    </button>
                  </div>

                  {updateMessage && (
                    <div
                      className={`p-3 rounded border text-xs leading-relaxed flex items-center justify-between ${
                        updateStatus === 'available'
                          ? 'bg-blue-950/50 border-blue-800/60 text-blue-200'
                          : updateStatus === 'up-to-date'
                            ? 'bg-green-950/40 border-green-800/50 text-green-300'
                            : 'bg-neutral-800/60 border-neutral-700 text-neutral-300'
                      }`}
                    >
                      <span>{updateMessage}</span>
                      {updateStatus === 'available' && foundRelease && (
                        <button
                          onClick={() => {
                            if (foundRelease.downloadUrl) {
                              window.open(foundRelease.downloadUrl, '_blank')
                            } else {
                              window.open(foundRelease.htmlUrl, '_blank')
                            }
                          }}
                          className="flex items-center gap-1 px-2.5 py-1 bg-[#0078d4] hover:bg-[#106ebe] text-white rounded text-[11px] font-medium ml-2 shrink-0"
                        >
                          <Download size={12} />
                          <span>Pobierz</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-2 pt-1">
                  <label className="flex items-center gap-2 text-neutral-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoCheckUpdates}
                      onChange={e => setAutoCheckUpdates(e.target.checked)}
                      className="accent-[#0078d4]"
                    />
                    <span>Automatycznie sprawdzaj aktualizacje w tle po uruchomieniu</span>
                  </label>
                </div>

                <div className="pt-2 border-t border-neutral-700/40 text-[11px] text-neutral-400">
                  ArcWord jest wolnym oprogramowaniem Open-Source. Wszelkie nowe wersje oraz instalatory
                  są publikowane bezpośrednio w{' '}
                  <a
                    href={`${GITHUB_REPO_URL}/releases`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#2b88d8] hover:underline inline-flex items-center gap-0.5"
                  >
                    sekcji Releases <ExternalLink size={10} />
                  </a>
                  .
                </div>
              </div>
            )}

            {activeCategory === 'language' && (
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-white border-b border-neutral-700/80 pb-1">
                  Preferencje językowe
                </h4>
                <div className="space-y-2 text-neutral-300">
                  <div className="p-2.5 bg-[#202020] rounded border border-neutral-700 flex items-center justify-between">
                    <span>Polski (Polska) [Domyślny]</span>
                    <span className="text-green-400 flex items-center gap-1">
                      <Check size={14} /> Włączony
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-4 py-2.5 bg-[#242424] border-t border-neutral-700">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#0078d4] hover:bg-[#106ebe] text-white rounded transition-colors text-xs font-medium"
          >
            OK
          </button>
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded transition-colors text-xs"
          >
            Anuluj
          </button>
        </div>
      </div>
    </div>
  )
}
