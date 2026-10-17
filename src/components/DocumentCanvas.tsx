import React from 'react'
import { EditorContent, Editor } from '@tiptap/react'
import type { PageTheme, ViewMode } from '../types'

interface DocumentCanvasProps {
  editor: Editor | null
  pageTheme: PageTheme
  viewMode: ViewMode
  zoom: number
  showRuler: boolean
  showPilcrow: boolean
}

export const DocumentCanvas: React.FC<DocumentCanvasProps> = ({
  editor,
  pageTheme,
  viewMode,
  zoom,
  showRuler,
  showPilcrow,
}) => {
  return (
    <div className="flex-1 flex flex-col bg-[#1e1e1e] overflow-hidden relative">
      {/* Top Ruler (optional) */}
      {showRuler && viewMode !== 'read' && (
        <div className="h-6 bg-[#262626] border-b border-neutral-700/80 flex items-center justify-center shrink-0 select-none text-[9px] text-neutral-400 overflow-hidden">
          <div className="w-[816px] h-full flex items-center justify-between px-16 relative">
            {/* Margin markers */}
            <div className="absolute left-16 top-1 text-white font-bold cursor-ew-resize">▼</div>
            <div className="absolute right-16 top-1 text-white font-bold cursor-ew-resize">▼</div>

            {/* Ruler ticks */}
            {Array.from({ length: 17 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="leading-none">{i + 1}</span>
                <div className="h-1.5 w-[1px] bg-neutral-600 mt-0.5" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Scrollable Canvas */}
      <div className="flex-1 overflow-y-auto overflow-x-auto p-8 flex justify-center items-start">
        <div
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center',
            transition: 'transform 0.1s ease-out',
          }}
          className={`printable-document anim-page-open transition-colors duration-150 relative ${
            viewMode === 'web'
              ? 'w-full max-w-4xl min-h-[90vh] px-12 py-8'
              : 'w-[816px] min-h-[1056px] px-20 py-20 my-4'
          } ${
            pageTheme === 'dark'
              ? 'page-dark bg-[#232323] text-neutral-100 border border-neutral-700/70 shadow-[0_8px_30px_rgb(0,0,0,0.6)]'
              : 'page-light bg-white text-neutral-900 border border-neutral-300 shadow-[0_8px_30px_rgb(0,0,0,0.25)]'
          } ${showPilcrow ? 'show-pilcrow' : ''}`}
        >
          {/* Page Header placeholder */}
          <div className="absolute top-6 left-20 right-20 text-[10px] text-neutral-500 flex justify-between border-b border-neutral-700/30 pb-1 select-none">
            <span>Nagłówek dokumentu</span>
            <span>ArcWord</span>
          </div>

          {/* Actual TipTap Rich Text Editor */}
          <div className="pt-4">
            <EditorContent editor={editor} />
          </div>

          {/* Page Footer placeholder */}
          <div className="absolute bottom-6 left-20 right-20 text-[10px] text-neutral-500 flex justify-between border-t border-neutral-700/30 pt-1 select-none">
            <span>Poufne</span>
            <span>Strona 1</span>
          </div>
        </div>
      </div>
    </div>
  )
}
