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
  userName?: string
  setUserName?: (name: string) => void
}

export const OptionsModal: React.FC<OptionsModalProps> = ({
  isOpen,
  onClose,
  autosave,
  setAutosave,
  pageTheme,
  setPageTheme,
  onUpdateFound,
  userName = 'Sebastian',
  setUserName,
}) => {
  const [activeCategory, setActiveCategory] = useState<
    'general' | 'display' | 'save' | 'updates' | 'language'
  >('general')

  const [updateStatus, setUpdateStatus] = useState<UpdateStatus>('idle')
  const [updateMessage, setUpdateMessage] = useState<string>('')
  const [foundRelease, setFoundRelease] = useState<ReleaseInfo | null>(null)
  const [autoCheckUpdates, setAutoCheckUpdates] = useState<boolean>(true)
  const [isClosing, setIsClosing] = useState(false)

  if (!isOpen) return null

  const handleAnimatedClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      onClose()
      setIsClosing(false)
    }, 200)
  }

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
    <div
      className={`fixed inset-0 z-50 bg-black/65 backdrop-blur-md flex items-center justify-center p-4 select-none ${
        isClosing ? 'anim-backdrop-out' : 'animate-in fade-in duration-200'
      }`}
    >
      <div className="absolute inset-0" onClick={handleAnimatedClose} />
      <div
        className={`w-[680px] h-[540px] bg-[#22262f]/95 text-neutral-200 border border-white/10 rounded-xl shadow-[0_24px_70px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden relative z-10 backdrop-blur-xl ${
          isClosing ? 'anim-modal-out' : 'anim-modal-in'
        }`}
      >
        {/* Title */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#1a1d24]/90 border-b border-white/8">
          <div className="flex items-center gap-2.5">
            <Settings size={16} className="text-[#388bfd]" />
            <span className="text-sm font-semibold text-white">Opcje programu ArcWord</span>
          </div>
          <button
            onClick={handleAnimatedClose}
            className="p-1 hover:bg-white/10 rounded text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        {/* Body with sidebar & main */}
        <div className="flex flex-1 overflow-hidden">
          {/* Categories Sidebar */}
          <div className="w-52 bg-[#181b22]/90 border-r border-white/8 p-2.5 space-y-1 text-xs">
            <button
              onClick={() => setActiveCategory('general')}
              className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                activeCategory === 'general'
                  ? 'bg-[#388bfd] text-white font-medium shadow-sm'
                  : 'text-neutral-300 hover:bg-white/5'
              }`}
            >
              Ogólne
            </button>
            <button
              onClick={() => setActiveCategory('display')}
              className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                activeCategory === 'display'
                  ? 'bg-[#388bfd] text-white font-medium shadow-sm'
                  : 'text-neutral-300 hover:bg-white/5'
              }`}
            >
              Wyświetlanie
            </button>
            <button
              onClick={() => setActiveCategory('save')}
              className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                activeCategory === 'save'
                  ? 'bg-[#388bfd] text-white font-medium shadow-sm'
                  : 'text-neutral-300 hover:bg-white/5'
              }`}
            >
              Zapisywanie
            </button>
            <button
              onClick={() => setActiveCategory('updates')}
              className={`w-full text-left px-3 py-2 rounded-lg transition-all flex items-center justify-between ${
                activeCategory === 'updates'
                  ? 'bg-[#388bfd] text-white font-medium shadow-sm'
                  : 'text-neutral-300 hover:bg-white/5'
              }`}
            >
              <span>Aktualizacje</span>
              <Sparkles size={12} className={activeCategory === 'updates' ? 'text-white' : 'text-amber-400'} />
            </button>
            <button
              onClick={() => setActiveCategory('language')}
              className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                activeCategory === 'language'
                  ? 'bg-[#388bfd] text-white font-medium shadow-sm'
                  : 'text-neutral-300 hover:bg-white/5'
              }`}
            >
              Język
            </button>
          </div>

          {/* Details Panel with animated transition */}
          <div className="flex-1 p-6 overflow-y-auto text-xs space-y-4">
            {activeCategory === 'general' && (
              <div key="general" className="space-y-4 anim-scale-in">
                <h4 className="text-sm font-semibold text-white border-b border-white/8 pb-1.5">
                  Opcje interfejsu użytkownika
                </h4>
                <div className="space-y-2.5">
                  <label className="flex items-center gap-2.5 text-neutral-300 cursor-pointer hover:text-white transition-colors">
                    <input
                      type="checkbox"
                      checked={autosave}
                      onChange={e => setAutosave(e.target.checked)}
                      className="accent-[#388bfd]"
                    />
                    <span>Włącz automatyczny zapis w tle (Autozapis co 5 sekund)</span>
                  </label>
                  <label className="flex items-center gap-2.5 text-neutral-300 cursor-pointer hover:text-white transition-colors">
                    <input type="checkbox" defaultChecked className="accent-[#388bfd]" />
                    <span>Płynne animacje przejść Fluent Motion (60 FPS)</span>
                  </label>
                  <label className="flex items-center gap-2.5 text-neutral-300 cursor-pointer hover:text-white transition-colors">
                    <input type="checkbox" defaultChecked className="accent-[#388bfd]" />
                    <span>Pokaż podgląd stylów nagłówków na żywo w galerii stylów</span>
                  </label>
                </div>

                <h4 className="text-sm font-semibold text-white border-b border-white/8 pb-1.5 pt-3">
                  Personalizacja użytkownika
                </h4>
                <div className="space-y-2">
                  <div>
                    <label className="block text-neutral-400 mb-1">Nazwa użytkownika:</label>
                    <input
                      type="text"
                      value={userName}
                      onChange={e => setUserName && setUserName(e.target.value)}
                      className={`w-full ${
                        pageTheme === 'light'
                          ? 'bg-white border-neutral-300 text-neutral-900'
                          : 'bg-[#181b22] border-white/10 text-white'
                      } border rounded-lg px-3 py-1.5 outline-none focus:border-[#388bfd]`}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeCategory === 'display' && (
              <div key="display" className="space-y-4 anim-scale-in">
                <h4 className="text-sm font-semibold text-white border-b border-white/8 pb-1.5">
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
                        className={`flex items-center gap-2.5 px-4 py-3 rounded-lg border transition-all ${
                          pageTheme === 'dark'
                            ? 'border-[#388bfd] bg-[#388bfd]/20 text-white shadow-sm ring-1 ring-[#388bfd]/50'
                            : 'border-white/10 bg-[#181b22] text-neutral-400 hover:text-white'
                        }`}
                      >
                        <div className="w-4 h-4 rounded bg-[#242424] border border-neutral-600" />
                        <span>Ciemny arkusz (Tryb nocny)</span>
                      </button>

                      <button
                        onClick={() => setPageTheme('light')}
                        className={`flex items-center gap-2.5 px-4 py-3 rounded-lg border transition-all ${
                          pageTheme === 'light'
                            ? 'border-[#388bfd] bg-[#388bfd]/20 text-white shadow-sm ring-1 ring-[#388bfd]/50'
                            : 'border-white/10 bg-[#181b22] text-neutral-400 hover:text-white'
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
              <div key="save" className="space-y-4 anim-scale-in">
                <h4 className="text-sm font-semibold text-white border-b border-white/8 pb-1.5">
                  Zapisywanie dokumentów
                </h4>
                <div className="space-y-2 text-neutral-300 leading-relaxed bg-[#181b22] p-4 rounded-lg border border-white/6">
                  <p>• Format domyślny: Dokument zgodny z formatem DOCX / HTML</p>
                  <p>• Interwał autozapisu: co 5 sekund podczas wprowadzania zmian</p>
                  <p>• Przechowywanie lokalne: Bezpieczna pamięć offline bez chmury</p>
                </div>
              </div>
            )}

            {/* UPDATES CATEGORY */}
            {activeCategory === 'updates' && (
              <div key="updates" className="space-y-4 anim-scale-in">
                <h4 className="text-sm font-semibold text-white border-b border-white/8 pb-1.5 flex items-center justify-between">
                  <span>Aktualizacje programu ArcWord</span>
                  <span className="text-[11px] font-mono text-[#388bfd] font-medium">
                    Wersja: v{CURRENT_VERSION}
                  </span>
                </h4>

                <div className="p-4 bg-[#181b22] rounded-lg border border-white/8 space-y-3">
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
                      className="flex items-center gap-2 px-3.5 py-1.5 bg-[#0078d4] hover:bg-[#106ebe] active:scale-95 disabled:bg-neutral-700 text-white rounded-lg font-medium transition-all cursor-pointer shadow-md"
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
                      className={`p-3 rounded-lg border text-xs leading-relaxed flex items-center justify-between ${
                        updateStatus === 'available'
                          ? 'bg-blue-950/60 border-blue-800/60 text-blue-200'
                          : updateStatus === 'up-to-date'
                            ? 'bg-green-950/40 border-green-800/50 text-green-300'
                            : 'bg-neutral-800/60 border-neutral-700 text-neutral-300'
                      }`}
                    >
                      <span>{updateMessage}</span>
                      {updateStatus === 'available' && foundRelease && (
                        <button
                          onClick={() => {
                            handleAnimatedClose()
                            setTimeout(() => {
                              onUpdateFound?.(foundRelease)
                            }, 220)
                          }}
                          className="flex items-center gap-1.5 px-3 py-1 bg-[#0078d4] hover:bg-[#106ebe] active:scale-95 text-white rounded text-[11px] font-medium ml-2 shrink-0 cursor-pointer shadow-md transition-all"
                        >
                          <Download size={12} />
                          <span>Zainstaluj nową wersję</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-2 pt-1">
                  <label className="flex items-center gap-2 text-neutral-300 cursor-pointer hover:text-white transition-colors">
                    <input
                      type="checkbox"
                      checked={autoCheckUpdates}
                      onChange={e => setAutoCheckUpdates(e.target.checked)}
                      className="accent-[#388bfd]"
                    />
                    <span>Automatycznie sprawdzaj aktualizacje w tle po uruchomieniu</span>
                  </label>
                </div>

                <div className="pt-2 border-t border-white/8 text-[11px] text-neutral-400">
                  ArcWord jest wolnym oprogramowaniem Open-Source. Wszelkie nowe wersje oraz instalatory
                  są publikowane bezpośrednio w{' '}
                  <a
                    href={`${GITHUB_REPO_URL}/releases`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#388bfd] hover:underline inline-flex items-center gap-0.5"
                  >
                    sekcji Releases <ExternalLink size={10} />
                  </a>
                  .
                </div>
              </div>
            )}

            {activeCategory === 'language' && (
              <div key="language" className="space-y-4 anim-scale-in">
                <h4 className="text-sm font-semibold text-white border-b border-white/8 pb-1.5">
                  Preferencje językowe
                </h4>
                <div className="space-y-2 text-neutral-300">
                  <div className="p-3 bg-[#181b22] rounded-lg border border-white/8 flex items-center justify-between">
                    <span className="font-medium text-white">Polski (Polska) [Domyślny]</span>
                    <span className="text-emerald-400 flex items-center gap-1.5 text-xs font-medium">
                      <Check size={14} /> Włączony
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2.5 px-4 py-3 bg-[#1a1d24]/90 border-t border-white/8">
          <button
            onClick={handleAnimatedClose}
            className="px-4 py-1.5 bg-[#0078d4] hover:bg-[#106ebe] active:scale-95 text-white rounded-lg transition-all text-xs font-medium shadow-md cursor-pointer"
          >
            OK
          </button>
          <button
            onClick={handleAnimatedClose}
            className="px-3.5 py-1.5 bg-neutral-800/80 hover:bg-neutral-700 active:scale-95 text-neutral-300 rounded-lg transition-all text-xs cursor-pointer"
          >
            Anuluj
          </button>
        </div>
      </div>
    </div>
  )
}
