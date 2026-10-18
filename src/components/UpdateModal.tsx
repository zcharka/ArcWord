import React, { useState } from 'react'
import { X, Sparkles, Download, ExternalLink, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import type { ReleaseInfo } from '../services/updater'
import { CURRENT_VERSION } from '../services/updater'

interface UpdateModalProps {
  isOpen: boolean
  onClose: () => void
  release: ReleaseInfo | null
}

export const UpdateModal: React.FC<UpdateModalProps> = ({ isOpen, onClose, release }) => {
  const [updateState, setUpdateState] = useState<'idle' | 'downloading' | 'installing' | 'error'>('idle')
  const [progress, setProgress] = useState<{ percent: number; transferred: number; total: number }>({
    percent: 0,
    transferred: 0,
    total: 0,
  })
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [isClosing, setIsClosing] = useState(false)

  if (!isOpen || !release) return null

  const handleAnimatedClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      onClose()
      setIsClosing(false)
    }, 200)
  }

  const formatMB = (bytes: number) => {
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const handleStartUpdate = async () => {
    if (!release.downloadUrl) {
      window.open(release.htmlUrl, '_blank')
      return
    }

    if (window.electronAPI?.installUpdate) {
      setUpdateState('downloading')
      setErrorMessage('')
      setProgress({ percent: 0, transferred: 0, total: 0 })

      let unsub: (() => void) | undefined
      if (window.electronAPI.onUpdateProgress) {
        unsub = window.electronAPI.onUpdateProgress(data => {
          setProgress({
            percent: data.percent,
            transferred: data.transferred,
            total: data.total,
          })
          if (data.status === 'installing') {
            setUpdateState('installing')
          }
        })
      }

      try {
        const result = await window.electronAPI.installUpdate(release.downloadUrl)
        if (!result.success) {
          setUpdateState('error')
          setErrorMessage(result.error || 'Wystąpił błąd podczas pobierania aktualizacji.')
          if (unsub) unsub()
        }
      } catch (err: any) {
        setUpdateState('error')
        setErrorMessage(err.message || 'Nieoczekiwany błąd instalacji.')
        if (unsub) unsub()
      }
    } else {
      // Fallback for browser / dev mode
      window.open(release.downloadUrl, '_blank')
    }
  }

  return (
    <div
      className={`fixed inset-0 z-50 bg-black/65 backdrop-blur-md flex items-center justify-center p-4 select-none ${
        isClosing ? 'anim-backdrop-out' : 'animate-in fade-in duration-200'
      }`}
    >
      <div
        className="absolute inset-0"
        onClick={updateState !== 'downloading' && updateState !== 'installing' ? handleAnimatedClose : undefined}
      />
      <div
        className={`w-[520px] bg-[#22262f]/95 text-neutral-200 border border-white/10 rounded-xl shadow-[0_24px_70px_rgba(0,0,0,0.85)] overflow-hidden relative z-10 backdrop-blur-xl ${
          isClosing ? 'anim-modal-out' : 'anim-modal-in'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#1a1d24]/90 border-b border-white/8">
          <div className="flex items-center gap-2.5">
            <Sparkles size={16} className="text-[#388bfd]" />
            <span className="text-sm font-semibold text-white">Aktualizacja programu ArcWord</span>
          </div>
          {updateState !== 'downloading' && updateState !== 'installing' && (
            <button
              onClick={handleAnimatedClose}
              className="p-1 hover:bg-white/10 rounded text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          {/* Versions bar */}
          <div className="flex items-center justify-between p-3 bg-[#181b22] rounded-lg border border-white/6 shadow-inner">
            <div>
              <span className="text-neutral-400 block text-[11px]">Bieżąca wersja:</span>
              <span className="text-neutral-300 font-mono font-medium">v{CURRENT_VERSION}</span>
            </div>
            <div className="text-right">
              <span className="text-neutral-400 block text-[11px]">Nowa wersja:</span>
              <span className="text-[#388bfd] font-mono font-bold text-sm">{release.version}</span>
            </div>
          </div>

          {/* Downloading state view */}
          {updateState === 'downloading' && (
            <div className="p-4 bg-[#181b22] border border-blue-900/60 rounded-lg space-y-3">
              <div className="flex items-center justify-between text-white font-medium">
                <span className="flex items-center gap-2">
                  <Loader2 size={15} className="animate-spin text-[#388bfd]" />
                  <span>Pobieranie aktualizacji w toku...</span>
                </span>
                <span className="text-[#388bfd] font-mono font-bold text-sm">{progress.percent}%</span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2.5 bg-neutral-800 rounded-full overflow-hidden border border-neutral-700">
                <div
                  className="h-full bg-linear-to-r from-[#0078d4] to-[#388bfd] transition-all duration-200 rounded-full"
                  style={{ width: `${Math.max(2, Math.min(100, progress.percent))}%` }}
                />
              </div>

              <div className="flex justify-between text-[11px] text-neutral-400">
                <span>
                  {progress.total > 0
                    ? `${formatMB(progress.transferred)} z ${formatMB(progress.total)}`
                    : 'Łączenie z serwerem wydań...'}
                </span>
                <span>Instalator zostanie uruchomiony samoczynnie</span>
              </div>
            </div>
          )}

          {/* Installing state view */}
          {updateState === 'installing' && (
            <div className="p-4 bg-[#181b22] border border-green-900/60 rounded-lg space-y-3 text-center">
              <div className="flex flex-col items-center justify-center gap-2 text-white">
                <CheckCircle2 size={32} className="text-emerald-400 animate-pulse" />
                <h4 className="text-sm font-semibold">Aktualizacja pobrana!</h4>
                <p className="text-xs text-neutral-300">
                  Zamykanie aplikacji i automatyczne uruchamianie nowej wersji ArcWord...
                </p>
              </div>
            </div>
          )}

          {/* Error state view */}
          {updateState === 'error' && (
            <div className="p-3 bg-red-950/40 border border-red-800/60 rounded-lg flex items-start gap-2 text-red-200">
              <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-medium text-xs">Błąd aktualizacji</p>
                <p className="text-[11px] text-red-300/80">{errorMessage}</p>
                {release.downloadUrl && (
                  <a
                    href={release.downloadUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-red-300 hover:text-white underline mt-1"
                  >
                    Pobierz instalator bezpośrednio przez przeglądarkę <ExternalLink size={11} />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Release Notes */}
          {updateState === 'idle' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-neutral-300">
                <span className="font-medium">Nowości w tym wydaniu:</span>
                <span className="text-neutral-500 text-[11px]">
                  {new Date(release.publishedAt).toLocaleDateString('pl-PL')}
                </span>
              </div>
              <div className="max-h-48 overflow-y-auto p-3 bg-[#181b22] rounded-lg border border-white/6 text-neutral-300 space-y-1 leading-relaxed text-[11px]">
                {release.body ? (
                  release.body.split('\n').map((line, i) => (
                    <p key={i} className={line.startsWith('#') ? 'font-bold text-white pt-1' : ''}>
                      {line}
                    </p>
                  ))
                ) : (
                  <p className="text-neutral-500 italic">Brak szczegółowego opisu zmian.</p>
                )}
              </div>
            </div>
          )}

          {/* Footer actions */}
          <div className="flex items-center justify-between pt-2 border-t border-white/8">
            <a
              href={release.htmlUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-[11px] text-[#388bfd] hover:text-blue-300 transition-colors"
            >
              Zobacz na GitHub <ExternalLink size={11} />
            </a>

            <div className="flex items-center gap-2">
              {updateState !== 'downloading' && updateState !== 'installing' && (
                <button
                  onClick={handleAnimatedClose}
                  className="px-3 py-1.5 bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 rounded text-xs transition-colors cursor-pointer"
                >
                  Przypomnij później
                </button>
              )}

              {updateState === 'idle' && (
                <button
                  onClick={handleStartUpdate}
                  className="flex items-center gap-1.5 px-4 py-1.5 bg-[#0078d4] hover:bg-[#106ebe] active:scale-95 text-white rounded text-xs font-medium transition-all shadow-md cursor-pointer"
                >
                  <Download size={14} />
                  <span>Zainstaluj aktualizację</span>
                </button>
              )}

              {updateState === 'error' && (
                <button
                  onClick={handleStartUpdate}
                  className="flex items-center gap-1.5 px-4 py-1.5 bg-[#0078d4] hover:bg-[#106ebe] text-white rounded text-xs font-medium transition-colors cursor-pointer"
                >
                  Spróbuj ponownie
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
