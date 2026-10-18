import React, { useState, useEffect } from 'react'
import { EditorContent, Editor } from '@tiptap/react'
import type { PageTheme, ViewMode, DocumentDesignSettings } from '../types'

interface DocumentCanvasProps {
  editor: Editor | null
  pageTheme: PageTheme
  viewMode: ViewMode
  zoom: number
  showRuler: boolean
  showPilcrow: boolean
  designSettings?: DocumentDesignSettings
}

export const DocumentCanvas: React.FC<DocumentCanvasProps> = ({
  editor,
  pageTheme,
  viewMode,
  zoom,
  showRuler,
  showPilcrow,
  designSettings,
}) => {
  // Dimensions based on orientation & page size
  const isLandscape = designSettings?.orientation === 'landscape'
  const pageSize = designSettings?.pageSize || 'A4'

  let baseWidth = isLandscape ? 1056 : 816
  let baseHeight = isLandscape ? 816 : 1056

  if (pageSize === 'A3') {
    baseWidth = isLandscape ? 1440 : 1080
    baseHeight = isLandscape ? 1080 : 1440
  } else if (pageSize === 'A5') {
    baseWidth = isLandscape ? 740 : 540
    baseHeight = isLandscape ? 540 : 740
  } else if (pageSize === 'Letter') {
    baseWidth = isLandscape ? 1056 : 816
    baseHeight = isLandscape ? 800 : 1030
  }

  // Margin padding
  let marginPadding = 'px-16' // Horizontal margin
  if (designSettings?.margins === 'narrow') {
    marginPadding = 'px-8'
  } else if (designSettings?.margins === 'moderate') {
    marginPadding = 'px-12'
  } else if (designSettings?.margins === 'wide') {
    marginPadding = 'px-24'
  }

  // Border class
  let borderClass = ''
  if (designSettings?.pageBorder === 'simple') {
    borderClass = 'doc-border-simple'
  } else if (designSettings?.pageBorder === 'double') {
    borderClass = 'doc-border-double'
  } else if (designSettings?.pageBorder === 'thick') {
    borderClass = 'doc-border-thick'
  }

  // Column class
  let colClass = ''
  if (designSettings?.columns === 2) {
    colClass = 'doc-columns-2'
  } else if (designSettings?.columns === 3) {
    colClass = 'doc-columns-3'
  }

  // Style set class
  const styleSetClass = designSettings?.styleSet ? `style-set-${designSettings.styleSet}` : ''

  // Multi-page calculation
  const [pageCount, setPageCount] = useState<number>(1)
  const topMargin = 72
  const bottomMargin = 72
  const usablePageHeight = Math.max(300, baseHeight - (topMargin + bottomMargin))
  const pageGap = 32
  const sheetStep = baseHeight + pageGap

  useEffect(() => {
    if (!editor || viewMode === 'web') {
      setPageCount(1)
      return
    }

    const dom = editor.view?.dom
    if (!dom) return

    const updatePagination = () => {
      const children = Array.from(dom.children) as HTMLElement[]
      if (children.length === 0) {
        setPageCount(1)
        return
      }

      // First pass: reset custom page margins
      children.forEach(ch => {
        if (ch.dataset.pageMargin) {
          ch.style.marginTop = ''
          delete ch.dataset.pageMargin
        }
      })

      // Second pass: place each element into sheets respecting page boundaries
      let currentSheet = 0

      for (let i = 0; i < children.length; i++) {
        const child = children[i]
        const childTop = child.offsetTop
        const childHeight = child.offsetHeight

        // The usable bottom boundary of the current sheet
        const currentSheetBottom = currentSheet * sheetStep + topMargin + usablePageHeight

        // Check for explicit page break (HR or page-break-before)
        const isExplicitBreak =
          child.tagName === 'HR' ||
          child.style.pageBreakBefore === 'always' ||
          child.classList.contains('page-break')

        if (isExplicitBreak) {
          currentSheet++
          const targetTop = currentSheet * sheetStep + topMargin
          const neededShift = targetTop - childTop
          if (neededShift > 0) {
            child.style.marginTop = `${neededShift}px`
            child.dataset.pageMargin = 'true'
          }
          continue
        }

        // If the element exceeds the current sheet bottom and can fit on the next sheet:
        if (childTop + childHeight > currentSheetBottom && childHeight <= usablePageHeight) {
          currentSheet++
          const targetTop = currentSheet * sheetStep + topMargin
          const neededShift = targetTop - childTop
          if (neededShift > 0) {
            child.style.marginTop = `${neededShift}px`
            child.dataset.pageMargin = 'true'
          }
        } else if (childHeight > usablePageHeight) {
          // If this single block is taller than an entire page (e.g. huge unbroken wall of text or large table)
          const sheetsSpanned = Math.floor(childHeight / usablePageHeight)
          currentSheet += sheetsSpanned
        }
      }

      // Total page count based on the bottom-most position of the content
      const lastChild = children[children.length - 1]
      const totalContentBottom = lastChild ? lastChild.offsetTop + lastChild.offsetHeight : 0
      const calculatedPages = Math.max(
        1,
        currentSheet + 1,
        Math.ceil(totalContentBottom / sheetStep),
        Math.ceil((dom.scrollHeight || 0) / usablePageHeight)
      )

      setPageCount(calculatedPages)
    }

    updatePagination()

    const handleUpdate = () => {
      requestAnimationFrame(updatePagination)
    }

    editor.on('update', handleUpdate)

    return () => {
      editor.off('update', handleUpdate)
    }
  }, [editor, baseHeight, usablePageHeight, sheetStep, topMargin, viewMode, editor?.state.doc])

  const isLight = pageTheme === 'light'

  return (
    <div
      className={`flex-1 flex flex-col ${
        isLight ? 'bg-[#e5e7eb]' : 'bg-[#14161d]'
      } overflow-hidden relative select-none`}
    >
      {/* Top Ruler (optional) */}
      {showRuler && viewMode !== 'read' && (
        <div
          className={`h-6 ${
            isLight
              ? 'bg-[#f0f2f5] border-neutral-300 text-neutral-600'
              : 'bg-[#1a1d24]/90 border-white/6 text-neutral-400'
          } border-b flex items-center justify-center shrink-0 select-none text-[9px] overflow-hidden`}
        >
          <div
            style={{ width: `${baseWidth}px` }}
            className="h-full flex items-center justify-between px-16 relative"
          >
            {/* Margin markers */}
            <div
              className={`absolute left-16 top-1 ${
                isLight ? 'text-neutral-800' : 'text-white'
              } font-bold cursor-ew-resize`}
            >
              ▼
            </div>
            <div
              className={`absolute right-16 top-1 ${
                isLight ? 'text-neutral-800' : 'text-white'
              } font-bold cursor-ew-resize`}
            >
              ▼
            </div>

            {/* Ruler ticks */}
            {Array.from({ length: isLandscape ? 22 : 17 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="leading-none">{i + 1}</span>
                <div
                  className={`h-1.5 w-[1px] ${
                    isLight ? 'bg-neutral-400' : 'bg-neutral-600'
                  } mt-0.5`}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Scrollable Canvas Stage */}
      <div className="flex-1 overflow-y-auto overflow-x-auto p-8 flex justify-center items-start">
        {viewMode === 'web' ? (
          /* Web layout: single continuous flow */
          <div
            style={{
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'top center',
              width: '100%',
              minHeight: '90vh',
              backgroundColor: designSettings?.pageColor || undefined,
            }}
            className={`printable-document w-full max-w-4xl px-12 py-8 my-4 relative select-text ${
              isLight && !designSettings?.pageColor
                ? 'page-light bg-white text-neutral-900 border border-neutral-300 shadow-[0_16px_45px_rgba(0,0,0,0.15)]'
                : !designSettings?.pageColor
                  ? 'page-dark bg-[#212328] text-neutral-100 border border-neutral-700/60 shadow-[0_16px_50px_rgba(0,0,0,0.7)]'
                  : 'text-neutral-100 shadow-[0_16px_50px_rgba(0,0,0,0.7)]'
            } ${showPilcrow ? 'show-pilcrow' : ''} ${borderClass} ${colClass} ${styleSetClass}`}
          >
            {designSettings?.watermark && (
              <div className="doc-watermark">{designSettings.watermark}</div>
            )}
            <div className="pt-4 relative z-10">
              <EditorContent editor={editor} />
            </div>
          </div>
        ) : (
          /* Multi-page Print Layout (LibreOffice / Word style) */
          <div
            style={{
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'top center',
              transition: 'transform 0.1s ease-out',
              width: `${baseWidth}px`,
              minHeight: `${pageCount * baseHeight + (pageCount - 1) * pageGap}px`,
            }}
            className="relative my-4 select-text"
          >
            {/* Background Page Sheets (Cards with headers, footers & shadows) */}
            {Array.from({ length: pageCount }).map((_, index) => (
              <div
                key={index}
                style={{
                  position: 'absolute',
                  top: `${index * (baseHeight + pageGap)}px`,
                  left: 0,
                  width: `${baseWidth}px`,
                  height: `${baseHeight}px`,
                  backgroundColor: designSettings?.pageColor || undefined,
                  zIndex: 1,
                }}
                className={`printable-document rounded-[2px] ${
                  isLight && !designSettings?.pageColor
                    ? 'page-light bg-white text-neutral-900 border border-neutral-300 shadow-[0_12px_40px_rgba(0,0,0,0.14)]'
                    : !designSettings?.pageColor
                      ? 'page-dark bg-[#212328] text-neutral-100 border border-neutral-700/60 shadow-[0_16px_50px_rgba(0,0,0,0.7)]'
                      : 'text-neutral-100 shadow-[0_16px_50px_rgba(0,0,0,0.7)]'
                } ${borderClass} select-none pointer-events-none`}
              >
                {/* Watermark overlay */}
                {designSettings?.watermark && (
                  <div className="doc-watermark">{designSettings.watermark}</div>
                )}
              </div>
            ))}

            {/* Single TipTap Rich Text Editor running continuously across the sheets */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: `${baseWidth}px`,
                paddingTop: `${topMargin}px`,
                paddingBottom: `${bottomMargin}px`,
                marginLeft: designSettings?.indentLeft ? `${designSettings.indentLeft}cm` : undefined,
                marginRight: designSettings?.indentRight ? `${designSettings.indentRight}cm` : undefined,
                marginTop: designSettings?.spaceBefore ? `${designSettings.spaceBefore}pt` : undefined,
                marginBottom: designSettings?.spaceAfter ? `${designSettings.spaceAfter}pt` : undefined,
                zIndex: 5,
              }}
              className={`${marginPadding} ${
                isLight ? 'text-neutral-900' : 'text-neutral-100'
              } ${showPilcrow ? 'show-pilcrow' : ''} ${colClass} ${styleSetClass}`}
            >
              <EditorContent editor={editor} />
            </div>

            {/* Page Header & Footer overlays — sit on top of text (z-20) */}
            {Array.from({ length: pageCount }).map((_, index) => (
              <React.Fragment key={`hf-${index}`}>
                {/* Header zone: covers the topMargin area with page background + header text */}
                <div
                  style={{
                    position: 'absolute',
                    top: `${index * (baseHeight + pageGap)}px`,
                    left: 0,
                    width: `${baseWidth}px`,
                    height: `${topMargin}px`,
                    backgroundColor: designSettings?.pageColor || (isLight ? '#ffffff' : '#212328'),
                    zIndex: 20,
                  }}
                  className="select-none pointer-events-none"
                >
                  <div className="absolute bottom-1 left-16 right-16 text-[10px] text-neutral-500 flex justify-between border-b border-neutral-500/20 pb-1">
                    <span>Nagłówek dokumentu</span>
                    <span>ArcWord</span>
                  </div>
                </div>

                {/* Footer zone: covers the bottomMargin area with page background + footer text */}
                <div
                  style={{
                    position: 'absolute',
                    top: `${index * (baseHeight + pageGap) + baseHeight - bottomMargin}px`,
                    left: 0,
                    width: `${baseWidth}px`,
                    height: `${bottomMargin}px`,
                    backgroundColor: designSettings?.pageColor || (isLight ? '#ffffff' : '#212328'),
                    zIndex: 20,
                  }}
                  className="select-none pointer-events-none"
                >
                  <div className="absolute top-1 left-16 right-16 text-[10px] text-neutral-500 flex justify-between border-t border-neutral-500/20 pt-1">
                    <span>Poufne</span>
                    <span>
                      Strona {index + 1} z {pageCount}
                    </span>
                  </div>
                </div>
              </React.Fragment>
            ))}

            {/* Page gap cover strips — hide text bleeding between pages */}
            {pageCount > 1 &&
              Array.from({ length: pageCount - 1 }).map((_, i) => (
                <div
                  key={`gap-${i}`}
                  style={{
                    position: 'absolute',
                    top: `${(i + 1) * baseHeight + i * pageGap}px`,
                    left: `-${pageGap}px`,
                    width: `${baseWidth + pageGap * 2}px`,
                    height: `${pageGap}px`,
                    backgroundColor: isLight ? '#e5e7eb' : '#14161d',
                    zIndex: 25,
                  }}
                  className="flex items-center justify-center select-none pointer-events-none"
                >
                  <span className="page-indicator-badge">
                    Podział strony • Strona {i + 2} z {pageCount}
                  </span>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  )
}
export default DocumentCanvas
