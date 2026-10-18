import React, { useState } from 'react'
import { X, Share2, Copy, Check, Download, FileText } from 'lucide-react'

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  docTitle: string
  docContent: string
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  docTitle,
  docContent,
}) => {
  const [copiedLink, setCopiedLink] = useState(false)
  const [copiedContent, setCopiedContent] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  if (!isOpen) return null

  const handleAnimatedClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      onClose()
      setIsClosing(false)
    }, 200)
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  const handleCopyText = () => {
    const tempEl = document.createElement('div')
    tempEl.innerHTML = docContent
    navigator.clipboard.writeText(tempEl.textContent || '')
    setCopiedContent(true)
    setTimeout(() => setCopiedContent(false), 2000)
  }

  const handleDownload = (format: 'html' | 'txt' | 'doc') => {
    const filename = `${docTitle || 'Dokument'}.${format === 'doc' ? 'doc' : format}`
    const blob = new Blob([docContent], {
      type:
        format === 'html'
          ? 'text/html'
          : format === 'doc'
            ? 'application/msword'
            : 'text/plain',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div
      className={`fixed inset-0 z-50 bg-black/65 backdrop-blur-md flex items-center justify-center p-4 select-none ${
        isClosing ? 'anim-backdrop-out' : 'animate-in fade-in duration-200'
      }`}
    >
      <div className="absolute inset-0" onClick={handleAnimatedClose} />
      <div
        className={`w-[480px] bg-[#22262f]/95 text-neutral-200 border border-white/10 rounded-xl shadow-[0_24px_70px_rgba(0,0,0,0.85)] overflow-hidden relative z-10 backdrop-blur-xl ${
          isClosing ? 'anim-modal-out' : 'anim-modal-in'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3 bg-[#1a1d24]/90 border-b border-white/8">
          <div className="flex items-center gap-2.5">
            <Share2 size={16} className="text-[#388bfd]" />
            <span className="text-sm font-semibold text-white">Udostępnianie: {docTitle}</span>
          </div>
          <button
            onClick={handleAnimatedClose}
            className="p-1 hover:bg-white/10 rounded text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs">
          <div className="bg-[#181b22] p-3.5 rounded-lg border border-white/6 flex items-center justify-between shadow-inner">
            <div className="truncate pr-2">
              <span className="text-neutral-400 block text-[11px]">Łącze do bieżącej sesji</span>
              <span className="text-neutral-200 font-mono text-[11px] truncate block">
                {window.location.href}
              </span>
            </div>
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0078d4] hover:bg-[#106ebe] active:scale-95 text-white rounded-lg shrink-0 transition-all font-medium text-xs cursor-pointer shadow-md"
            >
              {copiedLink ? <Check size={13} /> : <Copy size={13} />}
              {copiedLink ? 'Skopiowano' : 'Kopiuj'}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <button
              onClick={handleCopyText}
              className="flex items-center justify-center gap-2 p-3 bg-[#181b22] hover:bg-white/5 active:scale-95 rounded-lg border border-white/6 transition-all text-neutral-200 cursor-pointer shadow-sm"
            >
              {copiedContent ? <Check size={15} className="text-emerald-400" /> : <FileText size={15} className="text-[#388bfd]" />}
              <span>{copiedContent ? 'Skopiowano tekst!' : 'Kopiuj cały tekst'}</span>
            </button>

            <button
              onClick={() => handleDownload('doc')}
              className="flex items-center justify-center gap-2 p-3 bg-[#181b22] hover:bg-white/5 active:scale-95 rounded-lg border border-white/6 transition-all text-neutral-200 cursor-pointer shadow-sm"
            >
              <Download size={15} className="text-[#388bfd]" />
              <span>Eksportuj jako .doc</span>
            </button>
          </div>

          <div className="text-[11px] text-neutral-400">
            Wszelkie zmiany wprowadzone w dokumencie są automatycznie zapisywane w Twojej pamięci lokalnej.
          </div>
        </div>

        <div className="flex justify-end px-4 py-3 bg-[#1a1d24]/90 border-t border-white/8">
          <button
            onClick={handleAnimatedClose}
            className="px-4 py-1.5 bg-neutral-800/80 hover:bg-neutral-700 active:scale-95 text-neutral-300 rounded-lg transition-all text-xs cursor-pointer"
          >
            Gotowe
          </button>
        </div>
      </div>
    </div>
  )
}
