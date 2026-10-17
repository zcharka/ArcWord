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

  if (!isOpen) return null

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  const handleCopyText = () => {
    // Strip tags or copy raw text
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
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="w-[460px] bg-[#2b2b2b] text-neutral-200 border border-neutral-700 rounded shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#242424] border-b border-neutral-700">
          <div className="flex items-center gap-2">
            <Share2 size={16} className="text-[#0078d4]" />
            <span className="text-sm font-semibold text-white">Udostępnianie: {docTitle}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-neutral-700 rounded text-neutral-400 hover:text-white"
          >
            <X size={15} />
          </button>
        </div>

        <div className="p-4 space-y-4 text-xs">
          <div className="bg-[#202020] p-3 rounded border border-neutral-700/60 flex items-center justify-between">
            <div className="truncate pr-2">
              <span className="text-neutral-400 block text-[11px]">Łącze do bieżącej sesji</span>
              <span className="text-neutral-200 font-mono text-[11px] truncate block">
                {window.location.href}
              </span>
            </div>
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0078d4] hover:bg-[#106ebe] text-white rounded shrink-0 transition-colors font-medium text-xs"
            >
              {copiedLink ? <Check size={13} /> : <Copy size={13} />}
              {copiedLink ? 'Skopiowano' : 'Kopiuj'}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={handleCopyText}
              className="flex items-center justify-center gap-2 p-3 bg-neutral-800 hover:bg-neutral-700 rounded border border-neutral-700 transition-colors text-neutral-200"
            >
              {copiedContent ? <Check size={15} className="text-green-400" /> : <FileText size={15} />}
              <span>{copiedContent ? 'Skopiowano tekst!' : 'Kopiuj cały tekst'}</span>
            </button>

            <button
              onClick={() => handleDownload('doc')}
              className="flex items-center justify-center gap-2 p-3 bg-neutral-800 hover:bg-neutral-700 rounded border border-neutral-700 transition-colors text-neutral-200"
            >
              <Download size={15} className="text-[#0078d4]" />
              <span>Eksportuj jako .doc</span>
            </button>
          </div>

          <div className="text-[11px] text-neutral-400">
            Wszelkie zmiany wprowadzone w dokumencie są automatycznie zapisywane w Twojej przeglądarce.
          </div>
        </div>

        <div className="flex justify-end px-4 py-2.5 bg-[#242424] border-t border-neutral-700">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded transition-colors text-xs"
          >
            Gotowe
          </button>
        </div>
      </div>
    </div>
  )
}
