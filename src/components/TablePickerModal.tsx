import React, { useState } from 'react'
import { X, Table as TableIcon } from 'lucide-react'
import { Editor } from '@tiptap/react'

interface TablePickerModalProps {
  isOpen: boolean
  onClose: () => void
  editor: Editor | null
}

export const TablePickerModal: React.FC<TablePickerModalProps> = ({
  isOpen,
  onClose,
  editor,
}) => {
  const [hoveredRow, setHoveredRow] = useState(0)
  const [hoveredCol, setHoveredCol] = useState(0)
  const [isClosing, setIsClosing] = useState(false)

  if (!isOpen || !editor) return null

  const maxRows = 8
  const maxCols = 10

  const handleAnimatedClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      onClose()
      setIsClosing(false)
    }, 200)
  }

  const handleInsert = (rows: number, cols: number) => {
    editor
      .chain()
      .focus()
      .insertTable({ rows, cols, withHeaderRow: true })
      .run()
    handleAnimatedClose()
  }

  return (
    <div
      className={`fixed inset-0 z-50 bg-black/65 backdrop-blur-md flex items-center justify-center p-4 select-none ${
        isClosing ? 'anim-backdrop-out' : 'animate-in fade-in duration-200'
      }`}
    >
      <div className="absolute inset-0" onClick={handleAnimatedClose} />
      <div
        className={`w-[340px] bg-[#22262f]/95 text-neutral-200 border border-white/10 rounded-xl shadow-[0_24px_70px_rgba(0,0,0,0.85)] overflow-hidden relative z-10 backdrop-blur-xl ${
          isClosing ? 'anim-modal-out' : 'anim-modal-in'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3 bg-[#1a1d24]/90 border-b border-white/8">
          <div className="flex items-center gap-2.5">
            <TableIcon size={16} className="text-[#388bfd]" />
            <span className="text-sm font-semibold text-white">Wstaw tabelę</span>
          </div>
          <button
            onClick={handleAnimatedClose}
            className="p-1 hover:bg-white/10 rounded text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        <div className="p-5 flex flex-col items-center">
          <div className="text-xs text-neutral-300 font-medium mb-3 h-5">
            {hoveredRow > 0 && hoveredCol > 0
              ? `Tabela ${hoveredCol} × ${hoveredRow}`
              : 'Wskaż rozmiar tabeli'}
          </div>

          <div
            className="grid grid-cols-10 gap-1.5 p-3 bg-[#181b22] border border-white/8 rounded-lg shadow-inner"
            onMouseLeave={() => {
              setHoveredRow(0)
              setHoveredCol(0)
            }}
          >
            {Array.from({ length: maxRows }).map((_, r) =>
              Array.from({ length: maxCols }).map((_, c) => {
                const isSelected = r < hoveredRow && c < hoveredCol
                return (
                  <div
                    key={`${r}-${c}`}
                    onMouseEnter={() => {
                      setHoveredRow(r + 1)
                      setHoveredCol(c + 1)
                    }}
                    onClick={() => handleInsert(r + 1, c + 1)}
                    className={`w-5 h-5 rounded-[3px] cursor-pointer transition-colors border ${
                      isSelected
                        ? 'bg-[#388bfd] border-blue-400 shadow-sm'
                        : 'bg-neutral-800 border-neutral-700 hover:border-neutral-500'
                    }`}
                  />
                )
              })
            )}
          </div>
        </div>

        <div className="flex justify-between items-center px-4 py-3 bg-[#1a1d24]/90 border-t border-white/8 text-xs">
          <span className="text-neutral-400 text-[11px]">Maksymalnie 10 × 8</span>
          <button
            onClick={handleAnimatedClose}
            className="px-3.5 py-1.5 bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 rounded-lg transition-colors text-xs cursor-pointer"
          >
            Anuluj
          </button>
        </div>
      </div>
    </div>
  )
}
