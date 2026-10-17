import React from 'react'
import {
  BookOpen,
  FileText,
  Globe,
  Minus,
  Plus,
  CheckCircle2,
  Maximize2,
} from 'lucide-react'
import type { ViewMode } from '../types'

interface StatusBarProps {
  pageCount: number
  currentPage: number
  wordCount: number
  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void
  zoom: number
  setZoom: (zoom: number) => void
  onOpenWordCount: () => void
  isFocusMode: boolean
  setIsFocusMode: (focus: boolean) => void
}

export const StatusBar: React.FC<StatusBarProps> = ({
  pageCount,
  currentPage,
  wordCount,
  viewMode,
  setViewMode,
  zoom,
  setZoom,
  onOpenWordCount,
  isFocusMode,
  setIsFocusMode,
}) => {
  const handleZoomIn = () => {
    setZoom(Math.min(200, zoom + 10))
  }

  const handleZoomOut = () => {
    setZoom(Math.max(50, zoom - 10))
  }

  return (
    <div className="h-6 bg-[#1f1f1f] text-neutral-300 flex items-center justify-between px-3 select-none border-t border-[#2b2b2b] text-[11px] shrink-0 z-20">
      {/* Left side items */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onOpenWordCount}
          className="hover:bg-[#333333] px-1.5 py-0.5 rounded cursor-pointer transition-colors"
        >
          Strona {currentPage} z {pageCount}
        </button>

        <button
          onClick={onOpenWordCount}
          className="hover:bg-[#333333] px-1.5 py-0.5 rounded cursor-pointer transition-colors"
        >
          Wyrazy: {wordCount}
        </button>

        <div className="hidden sm:flex items-center gap-1 text-neutral-400 hover:text-white cursor-pointer px-1.5 py-0.5 rounded hover:bg-[#333333]">
          <CheckCircle2 size={12} className="text-green-500" />
          <span>Ułatwienia dostępu: dobrze przygotowane</span>
        </div>

        <div className="hidden md:block text-neutral-400 px-1.5 py-0.5">
          Polski (Polska)
        </div>
      </div>

      {/* Right side items */}
      <div className="flex items-center space-x-2">
        {/* Focus Mode button */}
        <button
          onClick={() => setIsFocusMode(!isFocusMode)}
          title="Koncentracja uwagi (Tryb pełnoekranowy)"
          className={`flex items-center gap-1 px-1.5 py-0.5 rounded transition-colors ${
            isFocusMode ? 'bg-[#0078d4] text-white' : 'hover:bg-[#333333] text-neutral-300'
          }`}
        >
          <Maximize2 size={11} />
          <span className="hidden sm:inline">Koncentracja uwagi</span>
        </button>

        {/* View Mode icons */}
        <div className="flex items-center space-x-0.5 border-l border-neutral-700 pl-2">
          <button
            onClick={() => setViewMode('read')}
            title="Tryb czytania"
            className={`p-1 rounded transition-colors ${
              viewMode === 'read' ? 'bg-[#383838] text-white' : 'hover:bg-[#333333] text-neutral-400'
            }`}
          >
            <BookOpen size={12} />
          </button>
          <button
            onClick={() => setViewMode('print')}
            title="Układ wydruku"
            className={`p-1 rounded transition-colors ${
              viewMode === 'print' ? 'bg-[#383838] text-white' : 'hover:bg-[#333333] text-neutral-400'
            }`}
          >
            <FileText size={12} />
          </button>
          <button
            onClick={() => setViewMode('web')}
            title="Układ sieci Web"
            className={`p-1 rounded transition-colors ${
              viewMode === 'web' ? 'bg-[#383838] text-white' : 'hover:bg-[#333333] text-neutral-400'
            }`}
          >
            <Globe size={12} />
          </button>
        </div>

        {/* Zoom controls */}
        <div className="flex items-center space-x-1.5 border-l border-neutral-700 pl-2">
          <button
            onClick={handleZoomOut}
            title="Oddal"
            className="p-0.5 hover:bg-[#333333] rounded text-neutral-400 hover:text-white"
          >
            <Minus size={11} />
          </button>

          <input
            type="range"
            min="50"
            max="200"
            step="5"
            value={zoom}
            onChange={e => setZoom(Number(e.target.value))}
            className="w-16 h-1 bg-neutral-600 rounded appearance-none cursor-pointer accent-[#0078d4]"
          />

          <button
            onClick={handleZoomIn}
            title="Przybliż"
            className="p-0.5 hover:bg-[#333333] rounded text-neutral-400 hover:text-white"
          >
            <Plus size={11} />
          </button>

          <button
            onClick={() => setZoom(100)}
            title="Resetuj powiększenie do 100%"
            className="min-w-[36px] text-right hover:bg-[#333333] px-1 py-0.5 rounded text-neutral-200"
          >
            {zoom}%
          </button>
        </div>
      </div>
    </div>
  )
}
