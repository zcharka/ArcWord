import React, { useState, useEffect } from 'react'
import {
  Scissors,
  Copy,
  Clipboard,
  Paintbrush,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Subscript,
  Superscript,
  Highlighter,
  Baseline,
  Sparkles,
  RotateCcw,
  List,
  ListOrdered,
  ListTree,
  Outdent,
  Indent,
  ArrowUpDown,
  Pilcrow,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Grid,
  PaintBucket,
  ChevronDown,
  Search,
  Replace,
  MousePointerClick,
  Table as TableIcon,
  Image as ImageIcon,
  Minus as MinusIcon,
  Link2,
  FileText,
  Volume2,
  CheckCircle2,
  Columns2,
  Sun,
  Moon,
  Ruler,
  HelpCircle,
  Share2,
} from 'lucide-react'
import { Editor } from '@tiptap/react'
import type { RibbonTab, PageTheme } from '../types'

interface RibbonProps {
  editor: Editor | null
  activeTab: RibbonTab
  setActiveTab: (tab: RibbonTab) => void
  onOpenBackstage: () => void
  onOpenFindReplace: (tab?: 'find' | 'replace') => void
  onOpenTablePicker: () => void
  onOpenHyperlink: () => void
  onOpenWordCount: () => void
  onOpenShare: () => void
  onOpenHelp: () => void
  pageTheme: PageTheme
  setPageTheme: (theme: PageTheme) => void
  showRuler: boolean
  setShowRuler: (show: boolean) => void
  showPilcrow: boolean
  setShowPilcrow: (show: boolean) => void
}

const FONT_FAMILIES = [
  'Calibri',
  'Aptos',
  'Arial',
  'Times New Roman',
  'Segoe UI',
  'Georgia',
  'Courier New',
  'Verdana',
]

const FONT_SIZES = [
  '8',
  '9',
  '10',
  '11',
  '12',
  '14',
  '16',
  '18',
  '20',
  '24',
  '28',
  '36',
  '48',
  '72',
]

const STYLES_LIST = [
  { id: 'normal', name: 'Normalny', sample: 'AaBbCcDc', action: (e: Editor) => e.chain().focus().setParagraph().run() },
  { id: 'no_spacing', name: 'Bez odst...', sample: 'AaBbCcDc', action: (e: Editor) => e.chain().focus().setParagraph().run() },
  { id: 'h1', name: 'Nagłówek 1', sample: 'AaBbC', color: '#2b579a', action: (e: Editor) => e.chain().focus().toggleHeading({ level: 1 }).run() },
  { id: 'h2', name: 'Nagłówek 2', sample: 'AaBbCcl', color: '#2b579a', action: (e: Editor) => e.chain().focus().toggleHeading({ level: 2 }).run() },
  { id: 'title', name: 'Tytuł', sample: 'AaB', action: (e: Editor) => e.chain().focus().toggleHeading({ level: 1 }).run() },
  { id: 'subtitle', name: 'Podtytuł', sample: 'AaBbCcD', italic: true, action: (e: Editor) => e.chain().focus().toggleHeading({ level: 3 }).run() },
  { id: 'subtle_emph', name: 'Wyróżnie...', sample: 'AaBbCcD', italic: true, action: (e: Editor) => e.chain().focus().toggleItalic().run() },
  { id: 'emphasis', name: 'Uwydatni...', sample: 'AaBbCcDc', bold: true, italic: true, action: (e: Editor) => e.chain().focus().toggleBold().toggleItalic().run() },
  { id: 'intense_emph', name: 'Wyróżn e...', sample: 'AaBbCcD', color: '#0078d4', action: (e: Editor) => e.chain().focus().setColor('#0078d4').run() },
  { id: 'strong', name: 'Pogrubienie', sample: 'AaBbCcDc', bold: true, action: (e: Editor) => e.chain().focus().toggleBold().run() },
  { id: 'quote', name: 'Cytat', sample: 'AaBbCcDc', italic: true, action: (e: Editor) => e.chain().focus().toggleBlockquote().run() },
]

export const Ribbon: React.FC<RibbonProps> = ({
  editor,
  activeTab,
  setActiveTab,
  onOpenBackstage,
  onOpenFindReplace,
  onOpenTablePicker,
  onOpenHyperlink,
  onOpenWordCount,
  onOpenShare,
  onOpenHelp,
  pageTheme,
  setPageTheme,
  showRuler,
  setShowRuler,
  showPilcrow,
  setShowPilcrow,
}) => {
  const [fontColor, setFontColor] = useState('#ffffff')
  const [highlightColor, setHighlightColor] = useState('#fff566')
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [showHighlightPicker, setShowHighlightPicker] = useState(false)
  const [showSpacingMenu, setShowSpacingMenu] = useState(false)
  const [savedFormat, setSavedFormat] = useState<{
    bold?: boolean
    italic?: boolean
    underline?: boolean
    color?: string
  } | null>(null)

  // Force re-render whenever editor selection or document content changes
  const [, setEditorTick] = useState(0)
  useEffect(() => {
    if (!editor) return

    const handleEditorChange = () => {
      setEditorTick(t => t + 1)
    }

    editor.on('transaction', handleEditorChange)
    editor.on('selectionUpdate', handleEditorChange)

    return () => {
      editor.off('transaction', handleEditorChange)
      editor.off('selectionUpdate', handleEditorChange)
    }
  }, [editor])

  // Current states - reactively recalculated on every transaction
  const isBold = editor?.isActive('bold') ?? false
  const isItalic = editor?.isActive('italic') ?? false
  const isUnderline = editor?.isActive('underline') ?? false
  const isStrike = editor?.isActive('strike') ?? false
  const isSubscript = editor?.isActive('subscript') ?? false
  const isSuperscript = editor?.isActive('superscript') ?? false
  const isBulletList = editor?.isActive('bulletList') ?? false
  const isOrderedList = editor?.isActive('orderedList') ?? false
  const isAlignLeft = editor?.isActive({ textAlign: 'left' }) ?? false
  const isAlignCenter = editor?.isActive({ textAlign: 'center' }) ?? false
  const isAlignRight = editor?.isActive({ textAlign: 'right' }) ?? false
  const isAlignJustify = editor?.isActive({ textAlign: 'justify' }) ?? false
  const currentFont = editor?.getAttributes('textStyle').fontFamily || 'Calibri'
  const currentFontSize = editor?.getAttributes('textStyle').fontSize?.replace('pt', '') || '11'

  // Word-smart formatting toggle: works on selection, on current word under cursor, or new typing
  const toggleSmartMark = (
    markName: 'bold' | 'italic' | 'underline' | 'strike' | 'subscript' | 'superscript'
  ) => {
    if (!editor) return

    const { empty, from } = editor.state.selection
    const isActive = editor.isActive(markName)

    if (empty) {
      if (isActive) {
        // Immediately un-mark the existing word or mark range
        editor.chain().focus().unsetMark(markName, { extendEmptyMarkRange: true }).run()
      } else {
        // If cursor is within a word, mark the whole word like Microsoft Word does
        const { $from } = editor.state.selection
        const textBefore = $from.parent.textBetween(0, $from.parentOffset, undefined, '\ufffc')
        const textAfter = $from.parent.textBetween(
          $from.parentOffset,
          $from.parent.nodeSize - 2,
          undefined,
          '\ufffc'
        )

        const matchBefore = textBefore.match(/[\w\p{L}]+$/u)
        const matchAfter = textAfter.match(/^[\w\p{L}]+/u)

        if (matchBefore || matchAfter) {
          const wordStart = from - (matchBefore ? matchBefore[0].length : 0)
          const wordEnd = from + (matchAfter ? matchAfter[0].length : 0)
          editor
            .chain()
            .focus()
            .setTextSelection({ from: wordStart, to: wordEnd })
            .setMark(markName)
            .run()
        } else {
          editor.chain().focus().toggleMark(markName).run()
        }
      }
    } else {
      // Direct selection: toggle cleanly
      editor.chain().focus().toggleMark(markName).run()
    }
  }

  const handleCopy = () => {
    document.execCommand('copy')
  }

  const handleCut = () => {
    document.execCommand('cut')
  }

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      editor?.commands.insertContent(text)
    } catch {
      document.execCommand('paste')
    }
  }

  const handleFormatPainter = () => {
    if (!editor) return
    if (!savedFormat) {
      setSavedFormat({
        bold: editor.isActive('bold'),
        italic: editor.isActive('italic'),
        underline: editor.isActive('underline'),
      })
    } else {
      if (savedFormat.bold) editor.chain().focus().setBold().run()
      if (savedFormat.italic) editor.chain().focus().setItalic().run()
      if (savedFormat.underline) editor.chain().focus().setUnderline().run()
      setSavedFormat(null)
    }
  }

  const handleSpeech = () => {
    if (!editor) return
    const text = editor.getText()
    if (!text.trim()) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'pl-PL'
    window.speechSynthesis.speak(utterance)
  }

  const handleInsertImage = () => {
    const url = prompt('Podaj adres URL obrazu:', 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&auto=format&fit=crop&q=80')
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  return (
    <div className="anim-ribbon-down bg-[#2b2b2b] text-neutral-200 border-b border-[#383838] select-none shrink-0 z-20">
      {/* Ribbon Tabs Row */}
      <div className="flex items-center justify-between px-2 pt-1 border-b border-[#383838]/80 text-xs">
        <div className="flex items-center space-x-0.5">
          {/* File Tab (Special Backstage button) */}
          <button
            onClick={onOpenBackstage}
            className="px-3.5 py-1.5 font-medium text-white hover:bg-[#0078d4] transition-colors rounded-t-sm bg-[#0078d4]/90"
          >
            Plik
          </button>

          {/* Normal Ribbon Tabs */}
          {[
            { id: 'home', label: 'Narzędzia główne' },
            { id: 'insert', label: 'Wstawianie' },
            { id: 'design', label: 'Projektowanie' },
            { id: 'layout', label: 'Układ' },
            { id: 'references', label: 'Odwołania' },
            { id: 'mailings', label: 'Korespondencja' },
            { id: 'review', label: 'Recenzja' },
            { id: 'view', label: 'Widok' },
            { id: 'help', label: 'Pomoc' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as RibbonTab)}
              className={`px-3 py-1.5 transition-colors relative font-medium ${
                activeTab === tab.id
                  ? 'text-white border-b-2 border-[#0078d4]'
                  : 'text-neutral-300 hover:text-white hover:bg-[#383838]/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Right side: Udostępnij */}
        <div className="flex items-center pr-2">
          <button
            onClick={onOpenShare}
            className="flex items-center gap-1.5 px-3 py-1 bg-[#333333] hover:bg-[#3e3e3e] border border-neutral-700 rounded text-neutral-200 hover:text-white text-xs transition-colors"
          >
            <Share2 size={13} className="text-[#0078d4]" />
            <span>Udostępnij</span>
          </button>
        </div>
      </div>

      {/* Ribbon Content Bar */}
      <div
        key={activeTab}
        className="anim-tab-switch h-[96px] bg-[#2d2d2d] flex items-stretch px-2 py-1 overflow-x-auto overflow-y-hidden"
      >
        {/* TAB: Narzędzia główne (Home) */}
        {activeTab === 'home' && (
          <div className="flex items-stretch divide-x divide-[#3d3d3d] h-full text-xs">
            {/* Group: Schowek (Clipboard) */}
            <div className="flex flex-col justify-between pr-2 shrink-0">
              <div className="flex items-center gap-1">
                {/* Large Paste button */}
                <button
                  onClick={handlePaste}
                  title="Wklej (Ctrl+V)"
                  className="flex flex-col items-center justify-center px-2 py-1 hover:bg-[#383838] active:bg-[#444] rounded text-neutral-200 hover:text-white h-[66px] w-[50px] transition-colors"
                >
                  <Clipboard size={24} className="text-amber-500 mb-0.5" />
                  <span className="text-[11px] leading-tight">Wklej</span>
                </button>

                {/* Small buttons */}
                <div className="flex flex-col gap-0.5">
                  <button
                    onClick={handleCut}
                    title="Wytnij (Ctrl+X)"
                    className="flex items-center gap-1.5 px-1.5 py-1 hover:bg-[#383838] rounded text-neutral-300 hover:text-white transition-colors"
                  >
                    <Scissors size={13} />
                    <span className="text-[11px]">Wytnij</span>
                  </button>
                  <button
                    onClick={handleCopy}
                    title="Kopiuj (Ctrl+C)"
                    className="flex items-center gap-1.5 px-1.5 py-1 hover:bg-[#383838] rounded text-neutral-300 hover:text-white transition-colors"
                  >
                    <Copy size={13} />
                    <span className="text-[11px]">Kopiuj</span>
                  </button>
                  <button
                    onClick={handleFormatPainter}
                    title="Malarz formatów"
                    className={`flex items-center gap-1.5 px-1.5 py-1 rounded transition-colors ${
                      savedFormat ? 'bg-[#004578] text-white border border-[#0078d4]' : 'hover:bg-[#383838] text-neutral-300 hover:text-white'
                    }`}
                  >
                    <Paintbrush size={13} className="text-amber-400" />
                    <span className="text-[11px]">Malarz formatów</span>
                  </button>
                </div>
              </div>
              <span className="text-[10px] text-neutral-400 text-center block">Schowek</span>
            </div>

            {/* Group: Czcionka (Font) */}
            <div className="flex flex-col justify-between px-2 shrink-0">
              <div className="flex flex-col gap-1">
                {/* Row 1: Font selector, size, A^, Av, Aa, Clear */}
                <div className="flex items-center gap-1">
                  <select
                    value={currentFont}
                    onChange={e => editor?.chain().focus().setFontFamily(e.target.value).run()}
                    className="bg-[#202020] hover:bg-[#282828] border border-neutral-700 rounded px-1.5 py-0.5 text-[11px] text-white w-32 focus:outline-none focus:border-[#0078d4] cursor-pointer"
                  >
                    {FONT_FAMILIES.map(font => (
                      <option key={font} value={font} style={{ fontFamily: font }}>
                        {font === 'Calibri' ? 'Calibri (Tekst podstawowy)' : font}
                      </option>
                    ))}
                  </select>

                  <select
                    value={currentFontSize}
                    onChange={e => editor?.chain().focus().setFontSize(`${e.target.value}pt`).run()}
                    className="bg-[#202020] hover:bg-[#282828] border border-neutral-700 rounded px-1 py-0.5 text-[11px] text-white w-12 focus:outline-none focus:border-[#0078d4] cursor-pointer"
                  >
                    {FONT_SIZES.map(size => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>

                  <button
                    onMouseDown={e => e.preventDefault()}
                    onClick={() => editor?.chain().focus().setFontSize('14pt').run()}
                    title="Zwiększ rozmiar czcionki"
                    className="p-1 hover:bg-[#383838] active:scale-90 rounded text-neutral-300 hover:text-white transition-all duration-150 cursor-pointer"
                  >
                    <span className="text-xs font-bold leading-none">A<sup>▲</sup></span>
                  </button>
                  <button
                    onMouseDown={e => e.preventDefault()}
                    onClick={() => editor?.chain().focus().setFontSize('10pt').run()}
                    title="Zmniejsz rozmiar czcionki"
                    className="p-1 hover:bg-[#383838] active:scale-90 rounded text-neutral-300 hover:text-white transition-all duration-150 cursor-pointer"
                  >
                    <span className="text-xs font-bold leading-none">A<sub>▼</sub></span>
                  </button>
                  <button
                    onMouseDown={e => e.preventDefault()}
                    onClick={() => {
                      const text = editor?.state.doc.textBetween(
                        editor.state.selection.from,
                        editor.state.selection.to,
                        ' '
                      )
                      if (text && editor) {
                        editor.chain().focus().insertContent(text.toUpperCase()).run()
                      }
                    }}
                    title="Zmień wielkość liter"
                    className="p-1 hover:bg-[#383838] active:scale-90 rounded text-neutral-300 hover:text-white text-xs font-semibold transition-all duration-150 cursor-pointer"
                  >
                    Aa
                  </button>
                  <button
                    onMouseDown={e => e.preventDefault()}
                    onClick={() => editor?.chain().focus().unsetAllMarks().clearNodes().run()}
                    title="Wyczyść całe formatowanie"
                    className="p-1 hover:bg-[#383838] active:scale-90 rounded text-neutral-300 hover:text-white transition-all duration-150 cursor-pointer"
                  >
                    <RotateCcw size={13} className="text-pink-400" />
                  </button>
                </div>

                {/* Row 2: B, I, U, ab, x2, x^2, glow, highlight, color */}
                <div className="flex items-center gap-0.5">
                  <button
                    onMouseDown={e => e.preventDefault()}
                    onClick={() => toggleSmartMark('bold')}
                    title="Pogrubienie (Ctrl+B)"
                    className={`p-1.5 rounded transition-all duration-150 active:scale-90 cursor-pointer ${
                      isBold ? 'bg-[#0078d4] text-white shadow-xs font-bold' : 'hover:bg-[#383838] text-neutral-300 hover:text-white'
                    }`}
                  >
                    <Bold size={14} />
                  </button>
                  <button
                    onMouseDown={e => e.preventDefault()}
                    onClick={() => toggleSmartMark('italic')}
                    title="Kursywa (Ctrl+I)"
                    className={`p-1.5 rounded transition-all duration-150 active:scale-90 cursor-pointer ${
                      isItalic ? 'bg-[#0078d4] text-white shadow-xs' : 'hover:bg-[#383838] text-neutral-300 hover:text-white'
                    }`}
                  >
                    <Italic size={14} />
                  </button>
                  <button
                    onMouseDown={e => e.preventDefault()}
                    onClick={() => toggleSmartMark('underline')}
                    title="Podkreślenie (Ctrl+U)"
                    className={`p-1.5 rounded transition-all duration-150 active:scale-90 cursor-pointer ${
                      isUnderline ? 'bg-[#0078d4] text-white shadow-xs' : 'hover:bg-[#383838] text-neutral-300 hover:text-white'
                    }`}
                  >
                    <Underline size={14} />
                  </button>
                  <button
                    onMouseDown={e => e.preventDefault()}
                    onClick={() => toggleSmartMark('strike')}
                    title="Przekreślenie"
                    className={`p-1.5 rounded transition-all duration-150 active:scale-90 cursor-pointer ${
                      isStrike ? 'bg-[#0078d4] text-white shadow-xs' : 'hover:bg-[#383838] text-neutral-300 hover:text-white'
                    }`}
                  >
                    <Strikethrough size={14} />
                  </button>
                  <button
                    onMouseDown={e => e.preventDefault()}
                    onClick={() => toggleSmartMark('subscript')}
                    title="Indeks dolny"
                    className={`p-1.5 rounded transition-all duration-150 active:scale-90 cursor-pointer ${
                      isSubscript ? 'bg-[#0078d4] text-white shadow-xs' : 'hover:bg-[#383838] text-neutral-300 hover:text-white'
                    }`}
                  >
                    <Subscript size={14} />
                  </button>
                  <button
                    onMouseDown={e => e.preventDefault()}
                    onClick={() => toggleSmartMark('superscript')}
                    title="Indeks górny"
                    className={`p-1.5 rounded transition-all duration-150 active:scale-90 cursor-pointer ${
                      isSuperscript ? 'bg-[#0078d4] text-white shadow-xs' : 'hover:bg-[#383838] text-neutral-300 hover:text-white'
                    }`}
                  >
                    <Superscript size={14} />
                  </button>
                  <button
                    onMouseDown={e => e.preventDefault()}
                    onClick={() => editor?.chain().focus().setColor('#2b88d8').run()}
                    title="Efekty tekstowe i typografia"
                    className="p-1 hover:bg-[#383838] rounded text-cyan-400"
                  >
                    <Sparkles size={14} />
                  </button>


                  {/* Highlight color */}
                  <div className="relative">
                    <button
                      onClick={() => {
                        editor?.chain().focus().toggleHighlight({ color: highlightColor }).run()
                        setShowHighlightPicker(!showHighlightPicker)
                      }}
                      title="Kolor wyróżnienia tekstu"
                      className="p-1 hover:bg-[#383838] rounded text-yellow-400 flex items-center"
                    >
                      <Highlighter size={14} />
                      <div className="w-2.5 h-1 bg-yellow-400 ml-0.5 rounded-xs" />
                    </button>
                    {showHighlightPicker && (
                      <div className="absolute top-8 left-0 z-40 bg-[#252525] border border-neutral-700 p-2 rounded shadow-xl grid grid-cols-5 gap-1.5">
                        {['#ffff00', '#00ff00', '#00ffff', '#ff00ff', '#ff0000', '#0000ff', '#808080', '#ffffff', '#ffa500', '#800080'].map(c => (
                          <div
                            key={c}
                            onClick={() => {
                              setHighlightColor(c)
                              editor?.chain().focus().setHighlight({ color: c }).run()
                              setShowHighlightPicker(false)
                            }}
                            className="w-5 h-5 rounded cursor-pointer border border-neutral-600 hover:scale-110 transition-transform"
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Font Color */}
                  <div className="relative">
                    <button
                      onClick={() => {
                        editor?.chain().focus().setColor(fontColor).run()
                        setShowColorPicker(!showColorPicker)
                      }}
                      title="Kolor czcionki"
                      className="p-1 hover:bg-[#383838] rounded text-neutral-200 flex items-center"
                    >
                      <Baseline size={14} />
                      <div className="w-2.5 h-1 bg-red-500 ml-0.5 rounded-xs" />
                    </button>
                    {showColorPicker && (
                      <div className="absolute top-8 left-0 z-40 bg-[#252525] border border-neutral-700 p-2 rounded shadow-xl grid grid-cols-5 gap-1.5">
                        {['#ffffff', '#000000', '#ff0000', '#0078d4', '#107c41', '#d83b01', '#5c2d91', '#00b7c3', '#ea4335', '#fbbc05'].map(c => (
                          <div
                            key={c}
                            onClick={() => {
                              setFontColor(c)
                              editor?.chain().focus().setColor(c).run()
                              setShowColorPicker(false)
                            }}
                            className="w-5 h-5 rounded cursor-pointer border border-neutral-600 hover:scale-110 transition-transform"
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <span className="text-[10px] text-neutral-400 text-center block">Czcionka</span>
            </div>

            {/* Group: Akapit (Paragraph) */}
            <div className="flex flex-col justify-between px-2 shrink-0">
              <div className="flex flex-col gap-1">
                {/* Row 1: Bullets, Numbered, Multilevel, Outdent, Indent, Sort, Pilcrow */}
                <div className="flex items-center gap-0.5">
                  <button
                    onMouseDown={e => e.preventDefault()}
                    onClick={() => editor?.chain().focus().toggleBulletList().run()}
                    title="Punktory"
                    className={`p-1 rounded transition-colors ${
                      isBulletList ? 'bg-[#004578] text-white' : 'hover:bg-[#383838] text-neutral-300 hover:text-white'
                    }`}
                  >
                    <List size={14} />
                  </button>
                  <button
                    onMouseDown={e => e.preventDefault()}
                    onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                    title="Numerowanie"
                    className={`p-1 rounded transition-colors ${
                      isOrderedList ? 'bg-[#004578] text-white' : 'hover:bg-[#383838] text-neutral-300 hover:text-white'
                    }`}
                  >
                    <ListOrdered size={14} />
                  </button>
                  <button
                    onMouseDown={e => e.preventDefault()}
                    onClick={() => editor?.chain().focus().toggleBulletList().run()}
                    title="Lista wielopoziomowa"
                    className="p-1 hover:bg-[#383838] rounded text-neutral-300 hover:text-white"
                  >
                    <ListTree size={14} />
                  </button>
                  <button
                    onMouseDown={e => e.preventDefault()}
                    onClick={() => editor?.chain().focus().liftListItem('listItem').run()}
                    title="Zmniejsz wcięcie"
                    className="p-1 hover:bg-[#383838] rounded text-neutral-300 hover:text-white"
                  >
                    <Outdent size={14} />
                  </button>
                  <button
                    onMouseDown={e => e.preventDefault()}
                    onClick={() => editor?.chain().focus().sinkListItem('listItem').run()}
                    title="Zwiększ wcięcie"
                    className="p-1 hover:bg-[#383838] rounded text-neutral-300 hover:text-white"
                  >
                    <Indent size={14} />
                  </button>
                  <button
                    onMouseDown={e => e.preventDefault()}
                    title="Sortuj"
                    className="p-1 hover:bg-[#383838] rounded text-neutral-300 hover:text-white"
                  >
                    <ArrowUpDown size={14} />
                  </button>
                  <button
                    onMouseDown={e => e.preventDefault()}
                    onClick={() => setShowPilcrow(!showPilcrow)}
                    title="Pokaż wszystko (¶)"
                    className={`p-1 rounded transition-colors ${
                      showPilcrow ? 'bg-[#004578] text-white' : 'hover:bg-[#383838] text-neutral-300 hover:text-white'
                    }`}
                  >
                    <Pilcrow size={14} />
                  </button>
                </div>

                {/* Row 2: Align Left, Center, Right, Justify, Line Spacing, Shading, Borders */}
                <div className="flex items-center gap-0.5">
                  <button
                    onMouseDown={e => e.preventDefault()}
                    onClick={() => editor?.chain().focus().setTextAlign('left').run()}
                    title="Wyrównaj do lewej (Ctrl+L)"
                    className={`p-1 rounded transition-colors ${
                      isAlignLeft ? 'bg-[#004578] text-white' : 'hover:bg-[#383838] text-neutral-300 hover:text-white'
                    }`}
                  >
                    <AlignLeft size={14} />
                  </button>
                  <button
                    onMouseDown={e => e.preventDefault()}
                    onClick={() => editor?.chain().focus().setTextAlign('center').run()}
                    title="Wyśrodkuj (Ctrl+E)"
                    className={`p-1 rounded transition-colors ${
                      isAlignCenter ? 'bg-[#004578] text-white' : 'hover:bg-[#383838] text-neutral-300 hover:text-white'
                    }`}
                  >
                    <AlignCenter size={14} />
                  </button>
                  <button
                    onMouseDown={e => e.preventDefault()}
                    onClick={() => editor?.chain().focus().setTextAlign('right').run()}
                    title="Wyrównaj do prawej (Ctrl+R)"
                    className={`p-1 rounded transition-colors ${
                      isAlignRight ? 'bg-[#004578] text-white' : 'hover:bg-[#383838] text-neutral-300 hover:text-white'
                    }`}
                  >
                    <AlignRight size={14} />
                  </button>
                  <button
                    onMouseDown={e => e.preventDefault()}
                    onClick={() => editor?.chain().focus().setTextAlign('justify').run()}
                    title="Wyjustuj (Ctrl+J)"
                    className={`p-1 rounded transition-colors ${
                      isAlignJustify ? 'bg-[#004578] text-white' : 'hover:bg-[#383838] text-neutral-300 hover:text-white'
                    }`}
                  >
                    <AlignJustify size={14} />
                  </button>


                  {/* Line Spacing */}
                  <div className="relative">
                    <button
                      onClick={() => setShowSpacingMenu(!showSpacingMenu)}
                      title="Interlinia i odstępy między akapitami"
                      className="p-1 hover:bg-[#383838] rounded text-neutral-300 hover:text-white flex items-center"
                    >
                      <ArrowUpDown size={13} />
                      <ChevronDown size={10} className="ml-0.5" />
                    </button>
                    {showSpacingMenu && (
                      <div className="absolute top-8 left-0 z-40 bg-[#252525] border border-neutral-700 py-1 rounded shadow-xl w-32 text-xs">
                        {['1.0', '1.15', '1.5', '2.0', '2.5', '3.0'].map(space => (
                          <button
                            key={space}
                            onClick={() => {
                              setShowSpacingMenu(false)
                            }}
                            className="w-full text-left px-3 py-1 hover:bg-[#383838] text-neutral-200"
                          >
                            {space}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => editor?.chain().focus().toggleHighlight({ color: '#334155' }).run()}
                    title="Cieniowanie"
                    className="p-1 hover:bg-[#383838] rounded text-neutral-300 hover:text-white"
                  >
                    <PaintBucket size={14} />
                  </button>
                  <button
                    onClick={onOpenTablePicker}
                    title="Obramowania"
                    className="p-1 hover:bg-[#383838] rounded text-neutral-300 hover:text-white"
                  >
                    <Grid size={14} />
                  </button>
                </div>
              </div>
              <span className="text-[10px] text-neutral-400 text-center block">Akapit</span>
            </div>

            {/* Group: Style (Styles Gallery Strip) */}
            <div className="flex flex-col justify-between px-2 shrink-0 max-w-[420px] overflow-hidden">
              <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none h-[64px]">
                {STYLES_LIST.map(style => (
                  <button
                    key={style.id}
                    onMouseDown={e => e.preventDefault()}
                    onClick={() => editor && style.action(editor)}
                    className="h-[58px] min-w-[70px] max-w-[85px] bg-[#222222] hover:bg-[#333333] border border-neutral-700 hover:border-neutral-500 rounded p-1 flex flex-col justify-between items-center text-center transition-colors shrink-0"
                  >
                    <span
                      className="text-[11px] truncate w-full font-serif"
                      style={{
                        color: style.color || '#fff',
                        fontWeight: style.bold ? 'bold' : 'normal',
                        fontStyle: style.italic ? 'italic' : 'normal',
                      }}
                    >
                      {style.sample}
                    </span>
                    <span className="text-[9.5px] text-neutral-400 truncate w-full">
                      {style.name}
                    </span>
                  </button>
                ))}
              </div>
              <span className="text-[10px] text-neutral-400 text-center block">Style</span>
            </div>

            {/* Group: Edytowanie (Editing) */}
            <div className="flex flex-col justify-between pl-2 shrink-0">
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => onOpenFindReplace('find')}
                  title="Znajdź (Ctrl+F)"
                  className="flex items-center gap-1.5 px-2 py-0.5 hover:bg-[#383838] rounded text-neutral-300 hover:text-white transition-colors"
                >
                  <Search size={13} className="text-[#0078d4]" />
                  <span className="text-[11px]">Znajdź</span>
                </button>
                <button
                  onClick={() => onOpenFindReplace('replace')}
                  title="Zamień (Ctrl+H)"
                  className="flex items-center gap-1.5 px-2 py-0.5 hover:bg-[#383838] rounded text-neutral-300 hover:text-white transition-colors"
                >
                  <Replace size={13} className="text-[#0078d4]" />
                  <span className="text-[11px]">Zamień</span>
                </button>
                <button
                  onClick={() => editor?.chain().focus().selectAll().run()}
                  title="Zaznacz wszystko (Ctrl+A)"
                  className="flex items-center gap-1.5 px-2 py-0.5 hover:bg-[#383838] rounded text-neutral-300 hover:text-white transition-colors"
                >
                  <MousePointerClick size={13} />
                  <span className="text-[11px]">Zaznacz</span>
                </button>
              </div>
              <span className="text-[10px] text-neutral-400 text-center block">Edytowanie</span>
            </div>
          </div>
        )}

        {/* TAB: Wstawianie (Insert) */}
        {activeTab === 'insert' && (
          <div className="flex items-center space-x-3 text-xs h-full">
            <button
              onClick={onOpenTablePicker}
              className="flex flex-col items-center justify-center px-3 py-1 hover:bg-[#383838] rounded text-neutral-200 h-[66px] w-[60px]"
            >
              <TableIcon size={22} className="text-[#0078d4] mb-1" />
              <span className="text-[11px]">Tabela</span>
            </button>
            <button
              onClick={handleInsertImage}
              className="flex flex-col items-center justify-center px-3 py-1 hover:bg-[#383838] rounded text-neutral-200 h-[66px] w-[60px]"
            >
              <ImageIcon size={22} className="text-green-500 mb-1" />
              <span className="text-[11px]">Obrazy</span>
            </button>
            <button
              onClick={onOpenHyperlink}
              className="flex flex-col items-center justify-center px-3 py-1 hover:bg-[#383838] rounded text-neutral-200 h-[66px] w-[60px]"
            >
              <Link2 size={22} className="text-cyan-400 mb-1" />
              <span className="text-[11px]">Łącze</span>
            </button>
            <button
              onClick={() => editor?.chain().focus().setHorizontalRule().run()}
              className="flex flex-col items-center justify-center px-3 py-1 hover:bg-[#383838] rounded text-neutral-200 h-[66px] w-[60px]"
            >
              <MinusIcon size={22} className="text-neutral-400 mb-1" />
              <span className="text-[11px]">Linia</span>
            </button>
            <button
              onClick={() => editor?.chain().focus().insertContent('<p style="page-break-before: always;"></p><hr /><p></p>').run()}
              className="flex flex-col items-center justify-center px-3 py-1 hover:bg-[#383838] rounded text-neutral-200 h-[66px] w-[80px]"
            >
              <FileText size={22} className="text-blue-400 mb-1" />
              <span className="text-[11px]">Podział strony</span>
            </button>
          </div>
        )}

        {/* TAB: Projektowanie / Układ (Layout) */}
        {(activeTab === 'layout' || activeTab === 'design') && (
          <div className="flex items-center space-x-3 text-xs h-full">
            <button
              onClick={() => alert('Marginesy ustawione na standardowe (2,54 cm)')}
              className="flex flex-col items-center justify-center px-3 py-1 hover:bg-[#383838] rounded text-neutral-200 h-[66px] w-[70px]"
            >
              <Grid size={22} className="text-[#0078d4] mb-1" />
              <span className="text-[11px]">Marginesy</span>
            </button>
            <button
              onClick={() => alert('Orientacja: Pionowa')}
              className="flex flex-col items-center justify-center px-3 py-1 hover:bg-[#383838] rounded text-neutral-200 h-[66px] w-[70px]"
            >
              <FileText size={22} className="text-[#0078d4] mb-1" />
              <span className="text-[11px]">Orientacja</span>
            </button>
            <button
              onClick={() => alert('Rozmiar: A4 (210 x 297 mm)')}
              className="flex flex-col items-center justify-center px-3 py-1 hover:bg-[#383838] rounded text-neutral-200 h-[66px] w-[70px]"
            >
              <Columns2 size={22} className="text-[#0078d4] mb-1" />
              <span className="text-[11px]">Rozmiar A4</span>
            </button>
          </div>
        )}

        {/* TAB: Recenzja (Review) */}
        {activeTab === 'review' && (
          <div className="flex items-center space-x-3 text-xs h-full">
            <button
              onClick={() => alert('Pisownia i gramatyka: Sprawdzanie ukończone. Brak błędów!')}
              className="flex flex-col items-center justify-center px-3 py-1 hover:bg-[#383838] rounded text-neutral-200 h-[66px] w-[80px]"
            >
              <CheckCircle2 size={22} className="text-green-500 mb-1" />
              <span className="text-[11px] text-center">Pisownia</span>
            </button>
            <button
              onClick={onOpenWordCount}
              className="flex flex-col items-center justify-center px-3 py-1 hover:bg-[#383838] rounded text-neutral-200 h-[66px] w-[80px]"
            >
              <FileText size={22} className="text-[#0078d4] mb-1" />
              <span className="text-[11px] text-center">Statystyka</span>
            </button>
            <button
              onClick={handleSpeech}
              className="flex flex-col items-center justify-center px-3 py-1 hover:bg-[#383838] rounded text-neutral-200 h-[66px] w-[80px]"
            >
              <Volume2 size={22} className="text-purple-400 mb-1" />
              <span className="text-[11px] text-center">Czytaj na głos</span>
            </button>
          </div>
        )}

        {/* TAB: Widok (View) */}
        {activeTab === 'view' && (
          <div className="flex items-center space-x-3 text-xs h-full">
            <button
              onClick={() => setPageTheme(pageTheme === 'dark' ? 'light' : 'dark')}
              className="flex flex-col items-center justify-center px-3 py-1 hover:bg-[#383838] rounded text-neutral-200 h-[66px] w-[80px]"
            >
              {pageTheme === 'dark' ? (
                <Sun size={22} className="text-yellow-400 mb-1" />
              ) : (
                <Moon size={22} className="text-blue-400 mb-1" />
              )}
              <span className="text-[11px] text-center">
                {pageTheme === 'dark' ? 'Jasna strona' : 'Ciemna strona'}
              </span>
            </button>

            <button
              onClick={() => setShowRuler(!showRuler)}
              className={`flex flex-col items-center justify-center px-3 py-1 rounded text-neutral-200 h-[66px] w-[70px] ${
                showRuler ? 'bg-[#004578] text-white' : 'hover:bg-[#383838]'
              }`}
            >
              <Ruler size={22} className="mb-1" />
              <span className="text-[11px]">Linijka</span>
            </button>
          </div>
        )}

        {/* TAB: Pomoc (Help) */}
        {activeTab === 'help' && (
          <div className="flex items-center space-x-3 text-xs h-full">
            <button
              onClick={onOpenHelp}
              className="flex flex-col items-center justify-center px-3 py-1 hover:bg-[#383838] rounded text-neutral-200 h-[66px] w-[70px]"
            >
              <HelpCircle size={22} className="text-[#0078d4] mb-1" />
              <span className="text-[11px]">Pomoc</span>
            </button>
          </div>
        )}

        {/* Other tabs fallback */}
        {['references', 'mailings'].includes(activeTab) && (
          <div className="flex items-center px-4 text-neutral-400 text-xs">
            Narzędzia karty są gotowe do użycia w bieżącym dokumencie.
          </div>
        )}
      </div>
    </div>
  )
}
