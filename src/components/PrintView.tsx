import React, { useState } from 'react'
import {
  Printer,
  ChevronDown,
  Info,
  FileText,
  Layers,
  Maximize2,
  Minus,
  Plus,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

interface PrintViewProps {
  docTitle: string
  docContent: string
  onPrint: () => void
}

export const PrintView: React.FC<PrintViewProps> = ({
  docTitle,
  docContent,
  onPrint,
}) => {
  const [copies, setCopies] = useState(1)
  const [pagesInput, setPagesInput] = useState('')
  const [zoom, setZoom] = useState(65)
  const [currentPage, setCurrentPage] = useState(1)

  return (
    <div className="flex-1 flex overflow-hidden bg-[#181818] text-neutral-200 select-none anim-backstage-in">
      {/* COLUMN 1: Print Settings Panel (Matches Screenshot exactly) */}
      <div className="w-[340px] bg-[#202020] border-r border-[#2b2b2b] p-6 overflow-y-auto space-y-6 text-xs shrink-0">
        <h1 className="text-2xl font-normal text-white">Drukuj</h1>

        {/* Big Print Button & Copies counter */}
        <div className="flex items-center gap-4">
          <button
            onClick={onPrint}
            className="w-[84px] h-[84px] bg-[#2b2b2b] hover:bg-[#383838] active:bg-[#444444] border border-neutral-600 hover:border-neutral-400 rounded flex flex-col items-center justify-center text-white transition-all duration-150 cursor-pointer shadow-md group"
          >
            <Printer size={32} className="text-neutral-200 group-hover:text-white mb-1 transition-transform group-hover:scale-105" />
            <span className="text-xs font-medium">Drukuj</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-neutral-300">Kopie:</span>
            <div className="flex items-center bg-[#1e1e1e] border border-neutral-600 rounded overflow-hidden">
              <input
                type="number"
                min="1"
                max="99"
                value={copies}
                onChange={e => setCopies(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-12 px-2 py-1 bg-transparent text-white text-center outline-none"
              />
              <div className="flex flex-col border-l border-neutral-700">
                <button
                  onClick={() => setCopies(c => c + 1)}
                  className="px-1.5 py-0.5 hover:bg-neutral-700 text-neutral-400 hover:text-white text-[9px]"
                >
                  ▲
                </button>
                <button
                  onClick={() => setCopies(c => Math.max(1, c - 1))}
                  className="px-1.5 py-0.5 hover:bg-neutral-700 text-neutral-400 hover:text-white text-[9px]"
                >
                  ▼
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Section: Drukarka */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-white text-xs">Drukarka</h3>
            <Info size={14} className="text-[#2b88d8] cursor-pointer" />
          </div>

          <div className="p-2.5 bg-[#2b2b2b] hover:bg-[#333333] border border-neutral-700 rounded flex items-center justify-between cursor-pointer transition-colors">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <Printer size={20} className="text-neutral-300" />
                <CheckCircle2 size={10} className="text-green-500 absolute -bottom-0.5 -right-0.5 fill-current" />
              </div>
              <div>
                <span className="font-medium text-white block">Microsoft Print to PDF</span>
                <span className="text-neutral-400 text-[11px] block">Gotowość</span>
              </div>
            </div>
            <ChevronDown size={14} className="text-neutral-400" />
          </div>

          <div className="pt-0.5">
            <button
              onClick={() => alert('Właściwości drukarki: Standardowe ustawienia formatu PDF / A4')}
              className="text-[#2b88d8] hover:underline text-[11px]"
            >
              Właściwości drukarki
            </button>
          </div>
        </div>

        {/* Section: Ustawienia */}
        <div className="space-y-2.5">
          <h3 className="font-semibold text-white text-xs">Ustawienia</h3>

          {/* Setting 1: Drukuj wszystkie strony */}
          <div className="p-2 bg-[#2b2b2b] hover:bg-[#333333] border border-neutral-700 rounded flex items-center justify-between cursor-pointer transition-colors">
            <div className="flex items-center gap-2.5">
              <FileText size={18} className="text-neutral-400" />
              <div>
                <span className="font-medium text-white block">Drukuj wszystkie strony</span>
                <span className="text-neutral-400 text-[11px] block">Cały dokument</span>
              </div>
            </div>
            <ChevronDown size={14} className="text-neutral-400" />
          </div>

          {/* Strony input */}
          <div className="flex items-center gap-2 px-1">
            <span className="text-neutral-300 w-14">Strony:</span>
            <input
              type="text"
              placeholder="np. 1-5, 8, 11-13"
              value={pagesInput}
              onChange={e => setPagesInput(e.target.value)}
              className="flex-1 bg-[#1e1e1e] border border-neutral-600 rounded px-2.5 py-1 text-white outline-none focus:border-[#0078d4]"
            />
            <Info size={14} className="text-[#2b88d8] cursor-pointer" />
          </div>

          {/* Setting 2: Druk jednostronny */}
          <div className="p-2 bg-[#2b2b2b] hover:bg-[#333333] border border-neutral-700 rounded flex items-center justify-between cursor-pointer transition-colors">
            <div className="flex items-center gap-2.5">
              <FileText size={18} className="text-neutral-400" />
              <div>
                <span className="font-medium text-white block">Druk jednostronny</span>
                <span className="text-neutral-400 text-[11px] block truncate max-w-[200px]">
                  Drukuj tylko na jednej stronie...
                </span>
              </div>
            </div>
            <ChevronDown size={14} className="text-neutral-400" />
          </div>

          {/* Setting 3: Posortowane */}
          <div className="p-2 bg-[#2b2b2b] hover:bg-[#333333] border border-neutral-700 rounded flex items-center justify-between cursor-pointer transition-colors">
            <div className="flex items-center gap-2.5">
              <Layers size={18} className="text-neutral-400" />
              <div>
                <span className="font-medium text-white block">Posortowane</span>
                <span className="text-neutral-400 text-[11px] block font-mono">
                  1,2,3  1,2,3  1,2,3
                </span>
              </div>
            </div>
            <ChevronDown size={14} className="text-neutral-400" />
          </div>

          {/* Setting 4: Orientacja pionowa */}
          <div className="p-2 bg-[#2b2b2b] hover:bg-[#333333] border border-neutral-700 rounded flex items-center justify-between cursor-pointer transition-colors">
            <div className="flex items-center gap-2.5">
              <FileText size={18} className="text-neutral-400" />
              <span className="font-medium text-white">Orientacja pionowa</span>
            </div>
            <ChevronDown size={14} className="text-neutral-400" />
          </div>

          {/* Setting 5: A4 */}
          <div className="p-2 bg-[#2b2b2b] hover:bg-[#333333] border border-neutral-700 rounded flex items-center justify-between cursor-pointer transition-colors">
            <div className="flex items-center gap-2.5">
              <FileText size={18} className="text-neutral-400" />
              <div>
                <span className="font-medium text-white block">A4</span>
                <span className="text-neutral-400 text-[11px] block">21 cm x 29,7 cm</span>
              </div>
            </div>
            <ChevronDown size={14} className="text-neutral-400" />
          </div>

          {/* Setting 6: Marginesy normalne */}
          <div className="p-2 bg-[#2b2b2b] hover:bg-[#333333] border border-neutral-700 rounded flex items-center justify-between cursor-pointer transition-colors">
            <div className="flex items-center gap-2.5">
              <FileText size={18} className="text-neutral-400" />
              <div>
                <span className="font-medium text-white block">Marginesy normalne</span>
                <span className="text-neutral-400 text-[11px] block truncate max-w-[200px]">
                  U góry: 2,5 cm dół: 2,5 cm...
                </span>
              </div>
            </div>
            <ChevronDown size={14} className="text-neutral-400" />
          </div>

          {/* Setting 7: 1 strona na arkusz */}
          <div className="p-2 bg-[#2b2b2b] hover:bg-[#333333] border border-neutral-700 rounded flex items-center justify-between cursor-pointer transition-colors">
            <div className="flex items-center gap-2.5">
              <FileText size={18} className="text-neutral-400" />
              <span className="font-medium text-white">1 strona na arkusz</span>
            </div>
            <ChevronDown size={14} className="text-neutral-400" />
          </div>

          <div className="pt-1">
            <button
              onClick={() => alert('Ustawienia strony: Marginesy 2,54 cm, Format A4, Papier standardowy')}
              className="text-[#2b88d8] hover:underline text-[11px]"
            >
              Ustawienia strony
            </button>
          </div>
        </div>
      </div>

      {/* COLUMN 2: Large Print Preview Canvas (Live Document Sheet) */}
      <div className="flex-1 flex flex-col bg-[#181818] overflow-hidden">
        {/* Preview Viewport */}
        <div className="flex-1 overflow-auto flex items-center justify-center p-8">
          <div
            style={{
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'center center',
              transition: 'transform 0.15s ease-out',
            }}
            className="w-[794px] min-h-[1123px] bg-white text-neutral-900 shadow-2xl p-16 select-text relative border border-neutral-300"
          >
            {/* Header in preview */}
            <div className="text-[10px] text-neutral-400 flex justify-between border-b border-neutral-200 pb-2 mb-6">
              <span>{docTitle || 'Dokument'}</span>
              <span>Wydruk ArcWord</span>
            </div>

            {/* Document Rendered Content */}
            <div
              className="tiptap-content text-black leading-relaxed"
              dangerouslySetInnerHTML={{ __html: docContent || '<p>Dokument jest pusty.</p>' }}
            />

            {/* Footer in preview */}
            <div className="absolute bottom-10 left-16 right-16 text-[10px] text-neutral-400 flex justify-between border-t border-neutral-200 pt-2">
              <span>Poufne</span>
              <span>Strona 1 z 1</span>
            </div>
          </div>
        </div>

        {/* Bottom Preview Controls Bar */}
        <div className="h-8 bg-[#1f1f1f] border-t border-neutral-800 flex items-center justify-between px-6 text-xs text-neutral-400 select-none">
          {/* Page nav */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="p-1 hover:bg-neutral-800 disabled:opacity-40 rounded"
            >
              <ChevronLeft size={14} />
            </button>

            <span className="px-2 py-0.5 bg-[#2b2b2b] rounded text-white font-mono text-[11px]">
              {currentPage}
            </span>
            <span>z 1</span>

            <button
              onClick={() => setCurrentPage(p => p + 1)}
              disabled={currentPage >= 1}
              className="p-1 hover:bg-neutral-800 disabled:opacity-40 rounded"
            >
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Zoom controls */}
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] min-w-[32px] text-right">{zoom}%</span>
            <button
              onClick={() => setZoom(z => Math.max(30, z - 5))}
              className="p-0.5 hover:bg-neutral-800 rounded"
            >
              <Minus size={12} />
            </button>
            <input
              type="range"
              min="30"
              max="150"
              step="5"
              value={zoom}
              onChange={e => setZoom(Number(e.target.value))}
              className="w-24 h-1 bg-neutral-700 accent-[#0078d4] cursor-pointer"
            />
            <button
              onClick={() => setZoom(z => Math.min(150, z + 5))}
              className="p-0.5 hover:bg-neutral-800 rounded"
            >
              <Plus size={12} />
            </button>
            <button
              onClick={() => setZoom(65)}
              title="Dopasuj stronę do okna"
              className="p-1 hover:bg-neutral-800 rounded ml-1"
            >
              <Maximize2 size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
