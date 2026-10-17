import React from 'react'
import { X, Sparkles, Download, ExternalLink } from 'lucide-react'
import type { ReleaseInfo } from '../services/updater'
import { CURRENT_VERSION } from '../services/updater'

interface UpdateModalProps {
  isOpen: boolean
  onClose: () => void
  release: ReleaseInfo | null
}

export const UpdateModal: React.FC<UpdateModalProps> = ({ isOpen, onClose, release }) => {
  if (!isOpen || !release) return null

  const handleDownload = () => {
    if (release.downloadUrl) {
      window.open(release.downloadUrl, '_blank')
    } else {
      window.open(release.htmlUrl, '_blank')
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-[500px] bg-[#2b2b2b] text-neutral-200 border border-neutral-700 rounded shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#242424] border-b border-neutral-700">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-[#0078d4]" />
            <span className="text-sm font-semibold text-white">Dostępna jest nowa wersja!</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-neutral-700 rounded text-neutral-400 hover:text-white transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          <div className="flex items-center justify-between p-3 bg-[#202020] rounded border border-neutral-700/60">
            <div>
              <span className="text-neutral-400 block text-[11px]">Bieżąca wersja:</span>
              <span className="text-neutral-300 font-mono font-medium">v{CURRENT_VERSION}</span>
            </div>
            <div className="text-right">
              <span className="text-neutral-400 block text-[11px]">Nowa wersja:</span>
              <span className="text-[#2b88d8] font-mono font-bold text-sm">{release.version}</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white mb-1.5 flex items-center gap-1.5">
              <span>Opis zmian ({release.name}):</span>
            </h4>
            <div className="bg-[#1e1e1e] border border-neutral-700/70 p-3 rounded text-neutral-300 max-h-48 overflow-y-auto whitespace-pre-wrap leading-relaxed text-[11.5px] font-sans">
              {release.body || 'Wydanie zawiera ulepszenia wydajności oraz poprawki błędów.'}
            </div>
          </div>

          <div className="text-[11px] text-neutral-400">
            Aktualizacja pochodzi z oficjalnego repozytorium GitHub:{' '}
            <a
              href={release.htmlUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[#2b88d8] hover:underline inline-flex items-center gap-0.5"
            >
              zcharka/ArcWord <ExternalLink size={10} />
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#242424] border-t border-neutral-700">
          <button
            onClick={() => window.open(release.htmlUrl, '_blank')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded text-xs transition-colors"
          >
            <ExternalLink size={13} />
            <span>Zobacz na GitHub</span>
          </button>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded text-xs transition-colors"
            >
              Przypomnij później
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-[#0078d4] hover:bg-[#106ebe] text-white rounded text-xs font-medium transition-colors"
            >
              <Download size={14} />
              <span>Pobierz i zaktualizuj</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
