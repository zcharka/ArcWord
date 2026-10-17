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

  if (!isOpen || !editor) return null

  const maxRows = 8
  const maxCols = 10

  const handleInsert = (rows: number, cols: number) => {
    editor
      .chain()
      .focus()
      .insertTable({ rows, cols, withHeaderRow: true })
      .run()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="w-[320px] bg-[#2b2b2b] text-neutral-200 border border-neutral-700 rounded shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#242424] border-b border-neutral-700">
          <div className="flex items-center gap-2">
            <TableIcon size={16} className="text-[#0078d4]" />
            <span className="text-sm font-semibold text-white">Wstaw tabelę</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-neutral-700 rounded text-neutral-400 hover:text-white"
          >
            <X size={15} />
          </button>
        </div>

        <div className="p-4 flex flex-col items-center">
          <div className="text-xs text-neutral-300 font-medium mb-3 h-5">
            {hoveredRow > 0 && hoveredCol > 0
              ? `Tabela ${hoveredCol} × ${hoveredRow}`
              : 'Wskaż rozmiar tabeli'}
          </div>

          <div
            className="grid grid-cols-10 gap-1 p-2 bg-[#202020] border border-neutral-700 rounded"
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
                    className={`w-5 h-5 rounded-[2px] cursor-pointer transition-colors border ${
                      isSelected
                        ? 'bg-[#0078d4] border-blue-400'
                        : 'bg-neutral-700 border-neutral-600 hover:border-neutral-400'
                    }`}
                  />
                )
              })
            )}
          </div>
        </div>

        <div className="flex justify-between items-center px-4 py-2.5 bg-[#242424] border-t border-neutral-700 text-xs">
          <span className="text-neutral-400 text-[11px]">Maksymalnie 10 × 8</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded transition-colors text-xs"
          >
            Anuluj
          </button>
        </div>
      </div>
    </div>
  )
}
