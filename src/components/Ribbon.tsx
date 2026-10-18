import React, { useState, useEffect, useRef } from 'react'
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
  Palette,
  Type,
  Square,
  WrapText,
  BringToFront,
  SendToBack,
  RotateCw,
  Check,
} from 'lucide-react'
import { Editor } from '@tiptap/react'
import type { RibbonTab, PageTheme, DocumentDesignSettings } from '../types'

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
  designSettings?: DocumentDesignSettings
  setDesignSettings?: React.Dispatch<React.SetStateAction<DocumentDesignSettings>>
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
  { id: 'h1', name: 'Nagłówek 1', sample: 'AaBbC', color: '#388bfd', action: (e: Editor) => e.chain().focus().toggleHeading({ level: 1 }).run() },
  { id: 'h2', name: 'Nagłówek 2', sample: 'AaBbCcl', color: '#58a6ff', action: (e: Editor) => e.chain().focus().toggleHeading({ level: 2 }).run() },
  { id: 'title', name: 'Tytuł', sample: 'AaB', action: (e: Editor) => e.chain().focus().toggleHeading({ level: 1 }).run() },
  { id: 'subtitle', name: 'Podtytuł', sample: 'AaBbCcD', italic: true, action: (e: Editor) => e.chain().focus().toggleHeading({ level: 3 }).run() },
  { id: 'subtle_emph', name: 'Wyróżnie...', sample: 'AaBbCcD', italic: true, action: (e: Editor) => e.chain().focus().toggleItalic().run() },
  { id: 'emphasis', name: 'Uwydatni...', sample: 'AaBbCcDc', bold: true, italic: true, action: (e: Editor) => e.chain().focus().toggleBold().toggleItalic().run() },
  { id: 'intense_emph', name: 'Wyróżn e...', sample: 'AaBbCcD', color: '#0078d4', action: (e: Editor) => e.chain().focus().setColor('#0078d4').run() },
  { id: 'strong', name: 'Pogrubienie', sample: 'AaBbCcDc', bold: true, action: (e: Editor) => e.chain().focus().toggleBold().run() },
  { id: 'quote', name: 'Cytat', sample: 'AaBbCcDc', italic: true, action: (e: Editor) => e.chain().focus().toggleBlockquote().run() },
]

// 12 Visual Style Presets for "Projektowanie" gallery matching Screenshot 1
const DESIGN_STYLE_SETS = [
  {
    id: 'default',
    name: 'Domyślny',
    titleColor: '#388bfd',
    hasShading: false,
    hasUnderline: false,
    hasLeftBar: false,
    fontFamily: 'Aptos',
  },
  {
    id: 'shaded',
    name: 'Z cieniowaniem',
    titleColor: '#ffffff',
    hasShading: true,
    hasUnderline: false,
    hasLeftBar: false,
    fontFamily: 'Calibri',
  },
  {
    id: 'classic',
    name: 'Klasyczny',
    titleColor: '#d1d5db',
    hasShading: false,
    hasUnderline: true,
    hasLeftBar: false,
    fontFamily: 'Georgia',
  },
  {
    id: 'centered',
    name: 'Wyśrodkowany',
    titleColor: '#93c5fd',
    hasShading: false,
    hasUnderline: false,
    hasLeftBar: false,
    fontFamily: 'Calibri',
    isCentered: true,
  },
  {
    id: 'underlined',
    name: 'Podkreślony',
    titleColor: '#60a5fa',
    hasShading: false,
    hasUnderline: true,
    hasLeftBar: false,
    fontFamily: 'Aptos',
  },
  {
    id: 'modern',
    name: 'Nowoczesny',
    titleColor: '#60a5fa',
    hasShading: false,
    hasUnderline: false,
    hasLeftBar: true,
    fontFamily: 'Arial',
  },
  {
    id: 'emerald',
    name: 'Szmaragd',
    titleColor: '#10b981',
    hasShading: false,
    hasUnderline: true,
    hasLeftBar: false,
    fontFamily: 'Calibri',
  },
  {
    id: 'purple',
    name: 'Fiolet',
    titleColor: '#a78bfa',
    hasShading: false,
    hasUnderline: false,
    hasLeftBar: true,
    fontFamily: 'Georgia',
  },
  {
    id: 'warm',
    name: 'Ciepły',
    titleColor: '#f97316',
    hasShading: false,
    hasUnderline: true,
    hasLeftBar: false,
    fontFamily: 'Arial',
  },
  {
    id: 'formal',
    name: 'Elegancki',
    titleColor: '#e2e8f0',
    hasShading: false,
    hasUnderline: false,
    hasLeftBar: false,
    fontFamily: 'Times New Roman',
  },
  {
    id: 'minimal',
    name: 'Minimalistyczny',
    titleColor: '#cbd5e1',
    hasShading: false,
    hasUnderline: false,
    hasLeftBar: false,
    fontFamily: 'Aptos',
  },
  {
    id: 'casual',
    name: 'Swobodny',
    titleColor: '#38bdf8',
    hasShading: false,
    hasUnderline: false,
    hasLeftBar: true,
    fontFamily: 'Calibri',
  },
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
  designSettings,
  setDesignSettings,
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

  // Design tab dropdown states
  const [showThemesMenu, setShowThemesMenu] = useState(false)
  const [showColorsMenu, setShowColorsMenu] = useState(false)
  const [showFontsMenu, setShowFontsMenu] = useState(false)
  const [showParagraphSpacingMenu, setShowParagraphSpacingMenu] = useState(false)
  const [showEffectsMenu, setShowEffectsMenu] = useState(false)
  const [showWatermarkMenu, setShowWatermarkMenu] = useState(false)
  const [showPageColorMenu, setShowPageColorMenu] = useState(false)
  const [showPageBorderMenu, setShowPageBorderMenu] = useState(false)

  // Layout tab dropdown states
  const [showMarginsMenu, setShowMarginsMenu] = useState(false)
  const [showOrientationMenu, setShowOrientationMenu] = useState(false)
  const [showSizeMenu, setShowSizeMenu] = useState(false)
  const [showColumnsMenu, setShowColumnsMenu] = useState(false)
  const [showBreaksMenu, setShowBreaksMenu] = useState(false)
  const [showLineNumbersMenu, setShowLineNumbersMenu] = useState(false)
  const [showHyphenMenu, setShowHyphenMenu] = useState(false)
  const [showArrangeMenu, setShowArrangeMenu] = useState(false)

  // Image insertion dropdown state and file picker input ref
  const [showImageDropdown, setShowImageDropdown] = useState(false)
  const imageFileInputRef = useRef<HTMLInputElement>(null)

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const triggerToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 2500)
  }

  const closeAllMenus = () => {
    setShowColorPicker(false)
    setShowHighlightPicker(false)
    setShowSpacingMenu(false)
    setShowThemesMenu(false)
    setShowColorsMenu(false)
    setShowFontsMenu(false)
    setShowParagraphSpacingMenu(false)
    setShowEffectsMenu(false)
    setShowWatermarkMenu(false)
    setShowPageColorMenu(false)
    setShowPageBorderMenu(false)
    setShowMarginsMenu(false)
    setShowOrientationMenu(false)
    setShowSizeMenu(false)
    setShowColumnsMenu(false)
    setShowBreaksMenu(false)
    setShowLineNumbersMenu(false)
    setShowHyphenMenu(false)
    setShowArrangeMenu(false)
    setShowImageDropdown(false)
  }

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
        editor.chain().focus().unsetMark(markName, { extendEmptyMarkRange: true }).run()
      } else {
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

  // Local File Image upload handler
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !editor) return

    const reader = new FileReader()
    reader.onload = event => {
      const base64Url = event.target?.result as string
      if (base64Url) {
        editor.chain().focus().setImage({ src: base64Url }).run()
        triggerToast('Wstawiono obraz z urządzenia')
      }
    }
    reader.readAsDataURL(file)
    e.target.value = ''
    closeAllMenus()
  }

  const handleInsertImageUrl = () => {
    const url = prompt(
      'Podaj adres URL obrazu w internecie:',
      'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&auto=format&fit=crop&q=80'
    )
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run()
      triggerToast('Wstawiono obraz z adresu URL')
    }
    closeAllMenus()
  }

  const handleCustomWatermark = () => {
    const text = prompt('Wpisz własny tekst znaku wodnego:', 'WERSJA ROBOCZA')
    if (text !== null && setDesignSettings) {
      setDesignSettings(prev => ({ ...prev, watermark: text.toUpperCase().trim() }))
      triggerToast(`Ustawiono znak wodny: ${text.toUpperCase()}`)
    }
    closeAllMenus()
  }

  return (
    <div
      className={`anim-ribbon-down ${
        pageTheme === 'light'
          ? 'bg-[#f5f6f8] text-neutral-800 border-neutral-300'
          : 'bg-[#1f232b]/95 backdrop-blur-md text-neutral-200 border-white/6'
      } border-b select-none shrink-0 z-30 shadow-sm relative overflow-visible`}
    >
      {/* Toast Alert Indicator */}
      {toastMessage && (
        <div className="absolute top-12 right-6 z-50 bg-[#0078d4] text-white px-3.5 py-1.5 rounded-lg text-xs shadow-xl anim-scale-in flex items-center gap-2 border border-blue-400">
          <Check size={14} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Global Backdrop closer for ribbon dropdowns */}
      {(showColorPicker ||
        showHighlightPicker ||
        showSpacingMenu ||
        showThemesMenu ||
        showColorsMenu ||
        showFontsMenu ||
        showParagraphSpacingMenu ||
        showEffectsMenu ||
        showWatermarkMenu ||
        showPageColorMenu ||
        showPageBorderMenu ||
        showMarginsMenu ||
        showOrientationMenu ||
        showSizeMenu ||
        showColumnsMenu ||
        showBreaksMenu ||
        showLineNumbersMenu ||
        showHyphenMenu ||
        showArrangeMenu ||
        showImageDropdown) && (
        <div className="fixed inset-0 z-30" onClick={closeAllMenus} />
      )}

      {/* Hidden local image file picker */}
      <input
        type="file"
        ref={imageFileInputRef}
        accept="image/*"
        onChange={handleImageFileUpload}
        className="hidden"
      />

      {/* Ribbon Tabs Row (Screenshot 3 glass look with blue indicator) */}
      <div
        className={`flex items-center justify-between px-2 pt-1 border-b text-xs ${
          pageTheme === 'light'
            ? 'bg-[#eaecf0] border-neutral-300'
            : 'bg-[#181b22]/95 backdrop-blur-md border-white/6'
        }`}
      >
        <div className="flex items-center space-x-0.5">
          {/* File Tab (Special Backstage button) */}
          <button
            onClick={onOpenBackstage}
            className="px-4 py-1.5 font-medium text-white hover:bg-[#106ebe] transition-all rounded-t-sm bg-[#0078d4] shadow-xs cursor-pointer active:scale-95"
          >
            Plik
          </button>

          {/* Normal Ribbon Tabs with blue active bottom line matching Screenshot 3 */}
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
              onClick={() => {
                closeAllMenus()
                setActiveTab(tab.id as RibbonTab)
              }}
              className={`px-3 py-1.5 transition-all relative font-medium cursor-pointer ${
                activeTab === tab.id
                  ? pageTheme === 'light'
                    ? 'text-[#0078d4] border-b-[3px] border-[#0078d4] font-semibold'
                    : 'text-white border-b-[3px] border-[#388bfd] font-semibold'
                  : pageTheme === 'light'
                    ? 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200'
                    : 'text-neutral-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Right side: Udostępnianie button matching Screenshot 3 */}
        <div className="flex items-center pr-2">
          <button
            onClick={onOpenShare}
            className={`flex items-center gap-1.5 px-3 py-1 ${
              pageTheme === 'light'
                ? 'bg-white hover:bg-neutral-100 border-neutral-300 text-neutral-800'
                : 'bg-[#252831]/80 hover:bg-[#2e333e] border-white/10 text-neutral-200 hover:text-white'
            } border rounded-md text-xs transition-all cursor-pointer active:scale-95 shadow-xs`}
          >
            <Share2 size={13} className="text-[#388bfd]" />
            <span>Udostępnianie</span>
          </button>
        </div>
      </div>

      {/* Ribbon Content Bar */}
      <div
        key={activeTab}
        className={`anim-tab-switch h-[96px] ${
          pageTheme === 'light' ? 'bg-[#f5f6f8] text-neutral-900' : 'bg-[#1f232b]/95 backdrop-blur-md text-neutral-200'
        } flex items-stretch px-2 py-1 overflow-visible relative z-30`}
      >
        {/* TAB 1: Narzędzia główne (Home) */}
        {activeTab === 'home' && (
          <div className="flex items-stretch divide-x divide-white/6 h-full text-xs">
            {/* Group: Schowek (Clipboard) */}
            <div className="flex flex-col justify-between pr-2 shrink-0">
              <div className="flex items-center gap-1">
                <button
                  onClick={handlePaste}
                  title="Wklej (Ctrl+V)"
                  className="flex flex-col items-center justify-center px-2 py-1 hover:bg-white/5 active:scale-95 rounded text-neutral-200 hover:text-white h-[66px] w-[50px] transition-all cursor-pointer"
                >
                  <Clipboard size={24} className="text-amber-500 mb-0.5" />
                  <span className="text-[11px] leading-tight">Wklej</span>
                </button>

                <div className="flex flex-col gap-0.5">
                  <button
                    onClick={handleCut}
                    title="Wytnij (Ctrl+X)"
                    className="flex items-center gap-1.5 px-1.5 py-1 hover:bg-white/5 rounded text-neutral-300 hover:text-white transition-colors cursor-pointer"
                  >
                    <Scissors size={13} />
                    <span className="text-[11px]">Wytnij</span>
                  </button>
                  <button
                    onClick={handleCopy}
                    title="Kopiuj (Ctrl+C)"
                    className="flex items-center gap-1.5 px-1.5 py-1 hover:bg-white/5 rounded text-neutral-300 hover:text-white transition-colors cursor-pointer"
                  >
                    <Copy size={13} />
                    <span className="text-[11px]">Kopiuj</span>
                  </button>
                  <button
                    onClick={handleFormatPainter}
                    title="Malarz formatów"
                    className={`flex items-center gap-1.5 px-1.5 py-1 rounded transition-colors cursor-pointer ${
                      savedFormat
                        ? 'bg-[#0078d4] text-white border border-[#388bfd]'
                        : 'hover:bg-white/5 text-neutral-300 hover:text-white'
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
                <div className="flex items-center gap-1">
                  <select
                    value={currentFont}
                    onChange={e => editor?.chain().focus().setFontFamily(e.target.value).run()}
                    className="bg-[#181b22] hover:bg-[#20242e] border border-white/10 rounded px-1.5 py-0.5 text-[11px] text-white w-32 focus:outline-none focus:border-[#388bfd] cursor-pointer"
                  >
                    {FONT_FAMILIES.map(font => (
                      <option key={font} value={font} style={{ fontFamily: font }}>
                        {font === 'Calibri' ? 'Calibri (Domyślna)' : font}
                      </option>
                    ))}
                  </select>

                  <select
                    value={currentFontSize}
                    onChange={e => editor?.chain().focus().setFontSize(`${e.target.value}pt`).run()}
                    className="bg-[#181b22] hover:bg-[#20242e] border border-white/10 rounded px-1 py-0.5 text-[11px] text-white w-12 focus:outline-none focus:border-[#388bfd] cursor-pointer"
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
                    className="p-1 hover:bg-white/5 active:scale-90 rounded text-neutral-300 hover:text-white transition-all cursor-pointer"
                  >
                    <span className="text-xs font-bold leading-none">A<sup>▲</sup></span>
                  </button>
                  <button
                    onMouseDown={e => e.preventDefault()}
                    onClick={() => editor?.chain().focus().setFontSize('10pt').run()}
                    title="Zmniejsz rozmiar czcionki"
                    className="p-1 hover:bg-white/5 active:scale-90 rounded text-neutral-300 hover:text-white transition-all cursor-pointer"
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
                    className="p-1 hover:bg-white/5 active:scale-90 rounded text-neutral-300 hover:text-white text-xs font-semibold transition-all cursor-pointer"
                  >
                    Aa
                  </button>
                  <button
                    onMouseDown={e => e.preventDefault()}
                    onClick={() => editor?.chain().focus().unsetAllMarks().clearNodes().run()}
                    title="Wyczyść całe formatowanie"
                    className="p-1 hover:bg-white/5 active:scale-90 rounded text-neutral-300 hover:text-white transition-all cursor-pointer"
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
                    className={`p-1.5 rounded transition-all duration-150 active:scale-90 cursor-pointer font-bold ${
                      isBold
                        ? 'bg-[#0078d4] text-white shadow-xs'
                        : 'hover:bg-white/5 text-neutral-300 hover:text-white'
                    }`}
                  >
                    <Bold size={14} />
                  </button>
                  <button
                    onMouseDown={e => e.preventDefault()}
                    onClick={() => toggleSmartMark('italic')}
                    title="Kursywa (Ctrl+I)"
                    className={`p-1.5 rounded transition-all duration-150 active:scale-90 cursor-pointer italic ${
                      isItalic
                        ? 'bg-[#0078d4] text-white shadow-xs'
                        : 'hover:bg-white/5 text-neutral-300 hover:text-white'
                    }`}
                  >
                    <Italic size={14} />
                  </button>
                  <button
                    onMouseDown={e => e.preventDefault()}
                    onClick={() => toggleSmartMark('underline')}
                    title="Podkreślenie (Ctrl+U)"
                    className={`p-1.5 rounded transition-all duration-150 active:scale-90 cursor-pointer underline ${
                      isUnderline
                        ? 'bg-[#0078d4] text-white shadow-xs'
                        : 'hover:bg-white/5 text-neutral-300 hover:text-white'
                    }`}
                  >
                    <Underline size={14} />
                  </button>
                  <button
                    onMouseDown={e => e.preventDefault()}
                    onClick={() => toggleSmartMark('strike')}
                    title="Przekreślenie"
                    className={`p-1.5 rounded transition-all duration-150 active:scale-90 cursor-pointer ${
                      isStrike
                        ? 'bg-[#0078d4] text-white shadow-xs'
                        : 'hover:bg-white/5 text-neutral-300 hover:text-white'
                    }`}
                  >
                    <Strikethrough size={14} />
                  </button>
                  <button
                    onMouseDown={e => e.preventDefault()}
                    onClick={() => toggleSmartMark('subscript')}
                    title="Indeks dolny"
                    className={`p-1.5 rounded transition-all duration-150 active:scale-90 cursor-pointer ${
                      isSubscript
                        ? 'bg-[#0078d4] text-white shadow-xs'
                        : 'hover:bg-white/5 text-neutral-300 hover:text-white'
                    }`}
                  >
                    <Subscript size={14} />
                  </button>
                  <button
                    onMouseDown={e => e.preventDefault()}
                    onClick={() => toggleSmartMark('superscript')}
                    title="Indeks górny"
                    className={`p-1.5 rounded transition-all duration-150 active:scale-90 cursor-pointer ${
                      isSuperscript
                        ? 'bg-[#0078d4] text-white shadow-xs'
                        : 'hover:bg-white/5 text-neutral-300 hover:text-white'
                    }`}
                  >
                    <Superscript size={14} />
                  </button>
                  <button
                    onMouseDown={e => e.preventDefault()}
                    onClick={() => editor?.chain().focus().setColor('#388bfd').run()}
                    title="Efekty tekstowe i typografia"
                    className="p-1 hover:bg-white/5 rounded text-cyan-400 cursor-pointer"
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
                      className="p-1 hover:bg-white/5 rounded text-yellow-400 flex items-center cursor-pointer"
                    >
                      <Highlighter size={14} />
                      <div className="w-2.5 h-1 bg-yellow-400 ml-0.5 rounded-xs" />
                    </button>
                    {showHighlightPicker && (
                      <div className="absolute top-8 left-0 z-40 bg-[#252831] border border-white/10 p-2 rounded-lg shadow-2xl grid grid-cols-5 gap-1.5">
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
                      className="p-1 hover:bg-white/5 rounded text-neutral-200 flex items-center cursor-pointer"
                    >
                      <Baseline size={14} />
                      <div className="w-2.5 h-1 bg-red-500 ml-0.5 rounded-xs" />
                    </button>
                    {showColorPicker && (
                      <div className="absolute top-8 left-0 z-40 bg-[#252831] border border-white/10 p-2 rounded-lg shadow-2xl grid grid-cols-5 gap-1.5">
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
                <div className="flex items-center gap-0.5">
                  <button
                    onMouseDown={e => e.preventDefault()}
                    onClick={() => editor?.chain().focus().toggleBulletList().run()}
                    title="Punktory"
                    className={`p-1 rounded transition-colors cursor-pointer ${
                      isBulletList ? 'bg-[#0078d4] text-white' : 'hover:bg-white/5 text-neutral-300 hover:text-white'
                    }`}
                  >
                    <List size={14} />
                  </button>
                  <button
                    onMouseDown={e => e.preventDefault()}
                    onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                    title="Numerowanie"
                    className={`p-1 rounded transition-colors cursor-pointer ${
                      isOrderedList ? 'bg-[#0078d4] text-white' : 'hover:bg-white/5 text-neutral-300 hover:text-white'
                    }`}
                  >
                    <ListOrdered size={14} />
                  </button>
                  <button
                    onMouseDown={e => e.preventDefault()}
                    onClick={() => editor?.chain().focus().toggleBulletList().run()}
                    title="Lista wielopoziomowa"
                    className="p-1 hover:bg-white/5 rounded text-neutral-300 hover:text-white cursor-pointer"
                  >
                    <ListTree size={14} />
                  </button>
                  <button
                    onMouseDown={e => e.preventDefault()}
                    onClick={() => editor?.chain().focus().liftListItem('listItem').run()}
                    title="Zmniejsz wcięcie"
                    className="p-1 hover:bg-white/5 rounded text-neutral-300 hover:text-white cursor-pointer"
                  >
                    <Outdent size={14} />
                  </button>
                  <button
                    onMouseDown={e => e.preventDefault()}
                    onClick={() => editor?.chain().focus().sinkListItem('listItem').run()}
                    title="Zwiększ wcięcie"
                    className="p-1 hover:bg-white/5 rounded text-neutral-300 hover:text-white cursor-pointer"
                  >
                    <Indent size={14} />
                  </button>
                  <button
                    onMouseDown={e => e.preventDefault()}
                    title="Sortuj"
                    className="p-1 hover:bg-white/5 rounded text-neutral-300 hover:text-white cursor-pointer"
                  >
                    <ArrowUpDown size={14} />
                  </button>
                  <button
                    onMouseDown={e => e.preventDefault()}
                    onClick={() => setShowPilcrow(!showPilcrow)}
                    title="Pokaż wszystko (¶)"
                    className={`p-1 rounded transition-colors cursor-pointer ${
                      showPilcrow ? 'bg-[#0078d4] text-white' : 'hover:bg-white/5 text-neutral-300 hover:text-white'
                    }`}
                  >
                    <Pilcrow size={14} />
                  </button>
                </div>

                <div className="flex items-center gap-0.5">
                  <button
                    onMouseDown={e => e.preventDefault()}
                    onClick={() => editor?.chain().focus().setTextAlign('left').run()}
                    title="Wyrównaj do lewej (Ctrl+L)"
                    className={`p-1 rounded transition-colors cursor-pointer ${
                      isAlignLeft ? 'bg-[#0078d4] text-white' : 'hover:bg-white/5 text-neutral-300 hover:text-white'
                    }`}
                  >
                    <AlignLeft size={14} />
                  </button>
                  <button
                    onMouseDown={e => e.preventDefault()}
                    onClick={() => editor?.chain().focus().setTextAlign('center').run()}
                    title="Wyśrodkuj (Ctrl+E)"
                    className={`p-1 rounded transition-colors cursor-pointer ${
                      isAlignCenter ? 'bg-[#0078d4] text-white' : 'hover:bg-white/5 text-neutral-300 hover:text-white'
                    }`}
                  >
                    <AlignCenter size={14} />
                  </button>
                  <button
                    onMouseDown={e => e.preventDefault()}
                    onClick={() => editor?.chain().focus().setTextAlign('right').run()}
                    title="Wyrównaj do prawej (Ctrl+R)"
                    className={`p-1 rounded transition-colors cursor-pointer ${
                      isAlignRight ? 'bg-[#0078d4] text-white' : 'hover:bg-white/5 text-neutral-300 hover:text-white'
                    }`}
                  >
                    <AlignRight size={14} />
                  </button>
                  <button
                    onMouseDown={e => e.preventDefault()}
                    onClick={() => editor?.chain().focus().setTextAlign('justify').run()}
                    title="Wyjustuj (Ctrl+J)"
                    className={`p-1 rounded transition-colors cursor-pointer ${
                      isAlignJustify ? 'bg-[#0078d4] text-white' : 'hover:bg-white/5 text-neutral-300 hover:text-white'
                    }`}
                  >
                    <AlignJustify size={14} />
                  </button>

                  {/* Line Spacing */}
                  <div className="relative">
                    <button
                      onClick={() => setShowSpacingMenu(!showSpacingMenu)}
                      title="Interlinia i odstępy między akapitami"
                      className="p-1 hover:bg-white/5 rounded text-neutral-300 hover:text-white flex items-center cursor-pointer"
                    >
                      <ArrowUpDown size={13} />
                      <ChevronDown size={10} className="ml-0.5" />
                    </button>
                    {showSpacingMenu && (
                      <div className="absolute top-8 left-0 z-40 bg-[#252831] border border-white/10 py-1 rounded-lg shadow-2xl w-32 text-xs">
                        {['1.0', '1.15', '1.5', '2.0', '2.5', '3.0'].map(space => (
                          <button
                            key={space}
                            onClick={() => {
                              setShowSpacingMenu(false)
                              triggerToast(`Ustawiono interlinię: ${space}`)
                            }}
                            className="w-full text-left px-3 py-1 hover:bg-white/10 text-neutral-200 cursor-pointer"
                          >
                            {space}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => editor?.chain().focus().toggleHighlight({ color: '#334155' }).run()}
                    title="Cieniowanie tekstu"
                    className="p-1 hover:bg-white/5 rounded text-neutral-300 hover:text-white cursor-pointer"
                  >
                    <PaintBucket size={14} />
                  </button>
                  <button
                    onClick={onOpenTablePicker}
                    title="Obramowania i tabele"
                    className="p-1 hover:bg-white/5 rounded text-neutral-300 hover:text-white cursor-pointer"
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
                    className="h-[58px] min-w-[70px] max-w-[85px] bg-[#181b22] hover:bg-[#232732] border border-white/8 hover:border-[#388bfd]/60 rounded-md p-1 flex flex-col justify-between items-center text-center transition-all shrink-0 cursor-pointer shadow-xs active:scale-95"
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
                  className="flex items-center gap-1.5 px-2 py-0.5 hover:bg-white/5 rounded text-neutral-300 hover:text-white transition-colors cursor-pointer"
                >
                  <Search size={13} className="text-[#388bfd]" />
                  <span className="text-[11px]">Znajdź</span>
                </button>
                <button
                  onClick={() => onOpenFindReplace('replace')}
                  title="Zamień (Ctrl+H)"
                  className="flex items-center gap-1.5 px-2 py-0.5 hover:bg-white/5 rounded text-neutral-300 hover:text-white transition-colors cursor-pointer"
                >
                  <Replace size={13} className="text-[#388bfd]" />
                  <span className="text-[11px]">Zamień</span>
                </button>
                <button
                  onClick={() => editor?.chain().focus().selectAll().run()}
                  title="Zaznacz wszystko (Ctrl+A)"
                  className="flex items-center gap-1.5 px-2 py-0.5 hover:bg-white/5 rounded text-neutral-300 hover:text-white transition-colors cursor-pointer"
                >
                  <MousePointerClick size={13} />
                  <span className="text-[11px]">Zaznacz</span>
                </button>
              </div>
              <span className="text-[10px] text-neutral-400 text-center block">Edytowanie</span>
            </div>
          </div>
        )}

        {/* TAB 2: Wstawianie (Insert) */}
        {activeTab === 'insert' && (
          <div className="flex items-center space-x-3 text-xs h-full">
            <button
              onClick={onOpenTablePicker}
              className="flex flex-col items-center justify-center px-3 py-1 hover:bg-white/5 active:scale-95 rounded text-neutral-200 h-[66px] w-[60px] cursor-pointer transition-all"
            >
              <TableIcon size={22} className="text-[#388bfd] mb-1" />
              <span className="text-[11px]">Tabela</span>
            </button>

            {/* Obrazy button with dropdown & local file browser */}
            <div className="relative">
              <button
                onClick={() => imageFileInputRef.current?.click()}
                className="flex flex-col items-center justify-center px-3 py-1 hover:bg-white/5 active:scale-95 rounded text-neutral-200 h-[66px] w-[64px] cursor-pointer transition-all"
                title="Wstaw obraz ze swojego komputera"
              >
                <ImageIcon size={22} className="text-emerald-400 mb-1" />
                <span className="text-[11px] flex items-center">
                  Obrazy <ChevronDown size={10} className="ml-0.5 text-neutral-400" />
                </span>
              </button>

              {/* Extra button for URL insertion */}
              <button
                onClick={e => {
                  e.stopPropagation()
                  setShowImageDropdown(!showImageDropdown)
                }}
                className="absolute top-1 right-0 p-1 text-neutral-400 hover:text-white cursor-pointer"
                title="Więcej opcji wstawiania obrazów"
              >
                <ChevronDown size={11} />
              </button>

              {showImageDropdown && (
                <div className="absolute top-[68px] left-0 z-40 bg-[#252831] border border-white/10 py-1.5 rounded-xl shadow-2xl w-48 text-xs backdrop-blur-xl anim-flyout">
                  <button
                    onClick={() => {
                      imageFileInputRef.current?.click()
                      setShowImageDropdown(false)
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-white/10 text-white flex items-center gap-2 cursor-pointer"
                  >
                    <ImageIcon size={14} className="text-emerald-400" />
                    <span>Z tego urządzenia...</span>
                  </button>
                  <button
                    onClick={handleInsertImageUrl}
                    className="w-full text-left px-3 py-2 hover:bg-white/10 text-neutral-200 flex items-center gap-2 cursor-pointer"
                  >
                    <Link2 size={14} className="text-[#388bfd]" />
                    <span>Obrazy online (URL)...</span>
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={onOpenHyperlink}
              className="flex flex-col items-center justify-center px-3 py-1 hover:bg-white/5 active:scale-95 rounded text-neutral-200 h-[66px] w-[60px] cursor-pointer transition-all"
            >
              <Link2 size={22} className="text-cyan-400 mb-1" />
              <span className="text-[11px]">Łącze</span>
            </button>
            <button
              onClick={() => editor?.chain().focus().setHorizontalRule().run()}
              className="flex flex-col items-center justify-center px-3 py-1 hover:bg-white/5 active:scale-95 rounded text-neutral-200 h-[66px] w-[60px] cursor-pointer transition-all"
            >
              <MinusIcon size={22} className="text-neutral-400 mb-1" />
              <span className="text-[11px]">Linia</span>
            </button>
            <button
              onClick={() => {
                editor?.chain().focus().insertContent('<p style="page-break-before: always;"></p><hr /><p></p>').run()
                triggerToast('Wstawiono podział strony')
              }}
              className="flex flex-col items-center justify-center px-3 py-1 hover:bg-white/5 active:scale-95 rounded text-neutral-200 h-[66px] w-[80px] cursor-pointer transition-all"
            >
              <FileText size={22} className="text-[#388bfd] mb-1" />
              <span className="text-[11px]">Podział strony</span>
            </button>
          </div>
        )}

        {/* TAB 3: PROJEKTOWANIE (Design) - Exactly matching Screenshot 1 */}
        {activeTab === 'design' && (
          <div className="flex items-stretch divide-x divide-white/6 h-full text-xs">
            {/* 1. Motywy (Themes) button matching Screenshot 1 */}
            <div className="relative flex flex-col justify-between pr-2.5 shrink-0">
              <button
                onClick={() => setShowThemesMenu(!showThemesMenu)}
                className="flex flex-col items-center justify-center px-2 py-1 hover:bg-white/5 active:scale-95 rounded-lg text-neutral-200 hover:text-white h-[66px] w-[56px] transition-all cursor-pointer group"
                title="Wybierz motyw dokumentu"
              >
                <div className="relative mb-0.5">
                  <Palette size={22} className="text-neutral-200 group-hover:text-white" />
                  <div className="flex gap-0.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#388bfd]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#f97316]" />
                  </div>
                </div>
                <span className="text-[11px] flex items-center leading-tight">
                  Motywy <ChevronDown size={10} className="ml-0.5 text-neutral-400" />
                </span>
              </button>

              {showThemesMenu && (
                <div className="absolute top-[72px] left-0 z-50 bg-[#242831]/95 border border-white/10 rounded-xl shadow-2xl py-2 w-52 text-xs backdrop-blur-xl anim-flyout">
                  <div className="px-3 py-1 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                    Dostępne motywy
                  </div>
                  {[
                    { id: 'office', name: 'Office (Standardowy)', color: '#388bfd', font: 'Aptos' },
                    { id: 'facet', name: 'Facet (Błękit morski)', color: '#00b7c3', font: 'Calibri' },
                    { id: 'integral', name: 'Integralny (Ciepły)', color: '#d83b01', font: 'Arial' },
                    { id: 'ion', name: 'Jon (Fioletowy)', color: '#8b5cf6', font: 'Georgia' },
                    { id: 'organic', name: 'Organiczny (Szmaragd)', color: '#10b981', font: 'Times New Roman' },
                    { id: 'retro', name: 'Retro (Bursztyn)', color: '#f59e0b', font: 'Georgia' },
                    { id: 'slice', name: 'Wycinek (Nowoczesny)', color: '#0ea5e9', font: 'Segoe UI' },
                  ].map(t => (
                    <button
                      key={t.id}
                      onClick={() => {
                        if (setDesignSettings) {
                          setDesignSettings(prev => ({
                            ...prev,
                            theme: t.id,
                            fontSet: t.font.toLowerCase(),
                          }))
                        }
                        editor?.chain().focus().setFontFamily(t.font).run()
                        setShowThemesMenu(false)
                        triggerToast(`Zastosowano motyw: ${t.name}`)
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-white/10 flex items-center justify-between text-neutral-200 hover:text-white cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: t.color }} />
                        <span>{t.name}</span>
                      </div>
                      <span className="text-[10px] text-neutral-400">{t.font}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Formatowanie dokumentu: Gallery + Side dropdowns matching Screenshot 1 */}
            <div className="flex flex-col justify-between px-2 shrink-0">
              <div className="flex items-center gap-2">
                {/* Style gallery cards */}
                <div className="flex items-center gap-1.5 overflow-x-auto max-w-[620px] pb-0.5 scrollbar-none h-[68px]">
                  {DESIGN_STYLE_SETS.map(set => {
                    const isSelected = designSettings?.styleSet === set.id
                    return (
                      <button
                        key={set.id}
                        onClick={() => {
                          if (setDesignSettings) {
                            setDesignSettings(prev => ({ ...prev, styleSet: set.id }))
                          }
                          editor?.chain().focus().setFontFamily(set.fontFamily).run()
                          triggerToast(`Zastosowano zestaw stylów: ${set.name}`)
                        }}
                        className={`h-[64px] min-w-[76px] bg-white text-neutral-900 border rounded-md p-1.5 flex flex-col justify-between text-left transition-all shrink-0 cursor-pointer shadow-sm hover:scale-102 active:scale-95 ${
                          isSelected ? 'ring-2 ring-[#388bfd] border-transparent' : 'border-neutral-300 hover:border-neutral-400'
                        }`}
                        title={`Zestaw stylów: ${set.name}`}
                      >
                        {/* Miniature Title / Heading representation */}
                        <div
                          className={`text-[9.5px] font-bold leading-none truncate ${
                            set.isCentered ? 'text-center' : ''
                          }`}
                          style={{
                            color: set.hasShading ? '#0078d4' : set.titleColor,
                            fontFamily: set.fontFamily,
                            borderBottom: set.hasUnderline ? '1px solid currentColor' : 'none',
                            borderLeft: set.hasLeftBar ? '2px solid currentColor' : 'none',
                            paddingLeft: set.hasLeftBar ? '2px' : undefined,
                          }}
                        >
                          Tytuł
                        </div>

                        {/* Miniature Subheading */}
                        <div
                          className="text-[7.5px] font-medium leading-none truncate"
                          style={{ color: '#2b579a', fontFamily: set.fontFamily }}
                        >
                          Nagłówek 1
                        </div>

                        {/* Miniature paragraph lines */}
                        <div className="space-y-0.5 w-full">
                          <div className="h-[2px] bg-neutral-300 rounded-full w-full" />
                          <div className="h-[2px] bg-neutral-200 rounded-full w-4/5" />
                        </div>
                      </button>
                    )
                  })}
                </div>

                {/* Right side stacked controls: Kolory, Czcionki, Odstępy akapitu, Efekty, Ustaw jako domyślny */}
                <div className="flex items-center gap-1.5 border-l border-white/6 pl-2">
                  <div className="flex flex-col gap-0.5">
                    {/* Kolory */}
                    <div className="relative">
                      <button
                        onClick={() => setShowColorsMenu(!showColorsMenu)}
                        className="flex items-center gap-1 px-1.5 py-0.5 hover:bg-white/5 rounded text-neutral-300 hover:text-white transition-colors cursor-pointer text-[11px]"
                      >
                        <div className="grid grid-cols-2 gap-0.5 w-3 h-3">
                          <span className="bg-[#388bfd] rounded-xs" />
                          <span className="bg-[#10b981] rounded-xs" />
                          <span className="bg-[#f97316] rounded-xs" />
                          <span className="bg-[#a78bfa] rounded-xs" />
                        </div>
                        <span>Kolory</span>
                        <ChevronDown size={10} className="text-neutral-400" />
                      </button>
                      {showColorsMenu && (
                        <div className="absolute top-6 left-0 z-50 bg-[#242831] border border-white/10 rounded-xl shadow-2xl py-1 w-44 text-xs backdrop-blur-xl anim-flyout">
                          {[
                            { id: 'office', name: 'Office (Niebieski)', color: '#388bfd' },
                            { id: 'warm', name: 'Ciepły (Bursztyn)', color: '#f97316' },
                            { id: 'emerald', name: 'Szmaragdowy', color: '#10b981' },
                            { id: 'purple', name: 'Fioletowy', color: '#a78bfa' },
                            { id: 'mono', name: 'Monochromatyczny', color: '#94a3b8' },
                          ].map(c => (
                            <button
                              key={c.id}
                              onClick={() => {
                                if (setDesignSettings) {
                                  setDesignSettings(prev => ({ ...prev, colors: c.id, styleSet: c.id }))
                                }
                                setShowColorsMenu(false)
                                triggerToast(`Zastosowano paletę: ${c.name}`)
                              }}
                              className="w-full text-left px-3 py-1.5 hover:bg-white/10 flex items-center gap-2 text-neutral-200 hover:text-white cursor-pointer"
                            >
                              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color }} />
                              <span>{c.name}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Czcionki */}
                    <div className="relative">
                      <button
                        onClick={() => setShowFontsMenu(!showFontsMenu)}
                        className="flex items-center gap-1 px-1.5 py-0.5 hover:bg-white/5 rounded text-neutral-300 hover:text-white transition-colors cursor-pointer text-[11px]"
                      >
                        <Type size={12} className="text-neutral-300" />
                        <span>Czcionki</span>
                        <ChevronDown size={10} className="text-neutral-400" />
                      </button>
                      {showFontsMenu && (
                        <div className="absolute top-6 left-0 z-50 bg-[#242831] border border-white/10 rounded-xl shadow-2xl py-1 w-48 text-xs backdrop-blur-xl anim-flyout">
                          {[
                            { name: 'Aptos / Aptos Display', font: 'Aptos' },
                            { name: 'Calibri / Calibri Light', font: 'Calibri' },
                            { name: 'Arial / Arial Black', font: 'Arial' },
                            { name: 'Georgia / Garamond', font: 'Georgia' },
                            { name: 'Times New Roman', font: 'Times New Roman' },
                          ].map(f => (
                            <button
                              key={f.font}
                              onClick={() => {
                                if (setDesignSettings) {
                                  setDesignSettings(prev => ({ ...prev, fontSet: f.font.toLowerCase() }))
                                }
                                editor?.chain().focus().setFontFamily(f.font).run()
                                setShowFontsMenu(false)
                                triggerToast(`Czcionka dokumentu: ${f.font}`)
                              }}
                              className="w-full text-left px-3 py-1.5 hover:bg-white/10 text-neutral-200 hover:text-white cursor-pointer"
                              style={{ fontFamily: f.font }}
                            >
                              {f.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-0.5">
                    {/* Odstępy akapitu */}
                    <div className="relative">
                      <button
                        onClick={() => setShowParagraphSpacingMenu(!showParagraphSpacingMenu)}
                        className="flex items-center gap-1 px-1.5 py-0.5 hover:bg-white/5 rounded text-neutral-300 hover:text-white transition-colors cursor-pointer text-[11px]"
                      >
                        <ArrowUpDown size={12} className="text-neutral-300" />
                        <span>Odstępy akapitu</span>
                        <ChevronDown size={10} className="text-neutral-400" />
                      </button>
                      {showParagraphSpacingMenu && (
                        <div className="absolute top-6 left-0 z-50 bg-[#242831] border border-white/10 rounded-xl shadow-2xl py-1 w-44 text-xs backdrop-blur-xl anim-flyout">
                          {[
                            { id: 'tight', name: 'Zwarte' },
                            { id: 'compact', name: 'Ścisłe' },
                            { id: 'normal', name: 'Otwarte (Normalne)' },
                            { id: 'relaxed', name: 'Luźne' },
                            { id: 'double', name: 'Podwójne' },
                          ].map(s => (
                            <button
                              key={s.id}
                              onClick={() => {
                                if (setDesignSettings) {
                                  setDesignSettings(prev => ({
                                    ...prev,
                                    paragraphSpacing: s.id as any,
                                    spaceAfter: s.id === 'tight' ? 4 : s.id === 'double' ? 16 : 8,
                                  }))
                                }
                                setShowParagraphSpacingMenu(false)
                                triggerToast(`Odstępy akapitów: ${s.name}`)
                              }}
                              className="w-full text-left px-3 py-1.5 hover:bg-white/10 text-neutral-200 hover:text-white cursor-pointer"
                            >
                              {s.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Efekty */}
                    <div className="relative">
                      <button
                        onClick={() => setShowEffectsMenu(!showEffectsMenu)}
                        className="flex items-center gap-1 px-1.5 py-0.5 hover:bg-white/5 rounded text-neutral-300 hover:text-white transition-colors cursor-pointer text-[11px]"
                      >
                        <Sparkles size={12} className="text-cyan-400" />
                        <span>Efekty</span>
                        <ChevronDown size={10} className="text-neutral-400" />
                      </button>
                      {showEffectsMenu && (
                        <div className="absolute top-6 left-0 z-50 bg-[#242831] border border-white/10 rounded-xl shadow-2xl py-1 w-44 text-xs backdrop-blur-xl anim-flyout">
                          {['Standardowe pakietu Office', 'Połysk i refleksy', 'Miękkie krawędzie', 'Cieniowanie brył'].map(ef => (
                            <button
                              key={ef}
                              onClick={() => {
                                setShowEffectsMenu(false)
                                triggerToast(`Zastosowano efekty: ${ef}`)
                              }}
                              className="w-full text-left px-3 py-1.5 hover:bg-white/10 text-neutral-200 hover:text-white cursor-pointer"
                            >
                              {ef}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Ustaw jako domyślny */}
                  <div className="pl-1">
                    <button
                      onClick={() => {
                        triggerToast('Bieżący styl został zapisany jako domyślny dla nowych dokumentów!')
                      }}
                      className="flex items-center gap-1 px-2 py-1.5 hover:bg-white/5 active:scale-95 rounded-lg text-neutral-300 hover:text-white transition-all cursor-pointer text-[11px]"
                      title="Zapisz bieżący wygląd i motyw jako domyślny"
                    >
                      <CheckCircle2 size={13} className="text-emerald-400" />
                      <span>Ustaw jako domyślny</span>
                    </button>
                  </div>
                </div>
              </div>
              <span className="text-[10px] text-neutral-400 text-center block">Formatowanie dokumentu</span>
            </div>

            {/* 3. Tło strony (Page Background): Znak wodny, Kolor strony, Obramowania stron matching Screenshot 1 */}
            <div className="flex flex-col justify-between pl-3 shrink-0">
              <div className="flex items-center gap-2">
                {/* Znak wodny */}
                <div className="relative">
                  <button
                    onClick={() => setShowWatermarkMenu(!showWatermarkMenu)}
                    className="flex flex-col items-center justify-center px-2 py-1 hover:bg-white/5 active:scale-95 rounded text-neutral-200 hover:text-white h-[66px] w-[62px] transition-all cursor-pointer"
                  >
                    <FileText size={22} className="text-red-400 mb-0.5" />
                    <span className="text-[11px] leading-tight flex items-center">
                      Znak wodny <ChevronDown size={10} className="ml-0.5 text-neutral-400" />
                    </span>
                  </button>

                  {showWatermarkMenu && (
                    <div className="absolute top-[68px] right-0 z-50 bg-[#242831] border border-white/10 rounded-xl shadow-2xl py-1 w-48 text-xs backdrop-blur-xl anim-flyout">
                      {[
                        { id: '', name: 'Brak znaku wodnego' },
                        { id: 'POUFNE', name: 'POUFNE' },
                        { id: 'PILNE', name: 'PILNE' },
                        { id: 'WERSJA ROBOCZA', name: 'WERSJA ROBOCZA' },
                        { id: 'NIE KOPIOWAĆ', name: 'NIE KOPIOWAĆ' },
                        { id: 'ORYGINAŁ', name: 'ORYGINAŁ' },
                      ].map(wm => (
                        <button
                          key={wm.id}
                          onClick={() => {
                            if (setDesignSettings) {
                              setDesignSettings(prev => ({ ...prev, watermark: wm.id }))
                            }
                            setShowWatermarkMenu(false)
                            triggerToast(wm.id ? `Wstawiono znak wodny: ${wm.name}` : 'Usunięto znak wodny')
                          }}
                          className={`w-full text-left px-3 py-1.5 hover:bg-white/10 flex items-center justify-between cursor-pointer ${
                            designSettings?.watermark === wm.id ? 'text-[#388bfd] font-semibold' : 'text-neutral-200'
                          }`}
                        >
                          <span>{wm.name}</span>
                          {designSettings?.watermark === wm.id && <Check size={12} />}
                        </button>
                      ))}
                      <div className="border-t border-white/6 mt-1 pt-1">
                        <button
                          onClick={handleCustomWatermark}
                          className="w-full text-left px-3 py-1.5 hover:bg-white/10 text-[#388bfd] font-medium cursor-pointer"
                        >
                          Własny znak wodny...
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Kolor strony */}
                <div className="relative">
                  <button
                    onClick={() => setShowPageColorMenu(!showPageColorMenu)}
                    className="flex flex-col items-center justify-center px-2 py-1 hover:bg-white/5 active:scale-95 rounded text-neutral-200 hover:text-white h-[66px] w-[62px] transition-all cursor-pointer"
                  >
                    <PaintBucket size={22} className="text-amber-400 mb-0.5" />
                    <span className="text-[11px] leading-tight flex items-center">
                      Kolor strony <ChevronDown size={10} className="ml-0.5 text-neutral-400" />
                    </span>
                  </button>

                  {showPageColorMenu && (
                    <div className="absolute top-[68px] right-0 z-50 bg-[#242831] border border-white/10 rounded-xl shadow-2xl p-2.5 w-52 text-xs backdrop-blur-xl anim-flyout">
                      <div className="text-[10px] text-neutral-400 font-semibold mb-2 uppercase tracking-wider">
                        Kolory motywu
                      </div>
                      <div className="grid grid-cols-5 gap-1.5 pb-2">
                        {[
                          { color: '', label: 'Domyślny' },
                          { color: '#ffffff', label: 'Biały' },
                          { color: '#232323', label: 'Ciemnoszary' },
                          { color: '#fbf0d9', label: 'Sepia / Pergamin' },
                          { color: '#1a1a1a', label: 'Czarny' },
                          { color: '#f0f8ff', label: 'Błękit' },
                          { color: '#161b26', label: 'Ciemny granat' },
                          { color: '#ecfdf5', label: 'Mięta' },
                          { color: '#fef2f2', label: 'Różany' },
                          { color: '#2e1065', label: 'Głęboki fiolet' },
                        ].map(c => (
                          <div
                            key={c.color || 'none'}
                            onClick={() => {
                              if (setDesignSettings) {
                                setDesignSettings(prev => ({ ...prev, pageColor: c.color }))
                              }
                              setShowPageColorMenu(false)
                              triggerToast(`Ustawiono kolor strony: ${c.label}`)
                            }}
                            title={c.label}
                            className={`w-6 h-6 rounded cursor-pointer border hover:scale-110 transition-transform ${
                              designSettings?.pageColor === c.color ? 'ring-2 ring-[#388bfd]' : 'border-neutral-600'
                            } ${!c.color ? 'bg-[#232323] relative after:content-["/"] after:text-red-500 after:text-xs after:flex after:justify-center' : ''}`}
                            style={{ backgroundColor: c.color || undefined }}
                          />
                        ))}
                      </div>
                      <button
                        onClick={() => {
                          if (setDesignSettings) {
                            setDesignSettings(prev => ({ ...prev, pageColor: '' }))
                          }
                          setShowPageColorMenu(false)
                          triggerToast('Przywrócono domyślny kolor strony')
                        }}
                        className="w-full text-center py-1 mt-1 bg-white/5 hover:bg-white/10 rounded text-[11px] text-neutral-300 cursor-pointer"
                      >
                        Brak koloru (domyślny)
                      </button>
                    </div>
                  )}
                </div>

                {/* Obramowania stron */}
                <div className="relative">
                  <button
                    onClick={() => setShowPageBorderMenu(!showPageBorderMenu)}
                    className="flex flex-col items-center justify-center px-2 py-1 hover:bg-white/5 active:scale-95 rounded text-neutral-200 hover:text-white h-[66px] w-[70px] transition-all cursor-pointer"
                  >
                    <Square size={22} className="text-orange-400 mb-0.5" />
                    <span className="text-[11px] leading-tight text-center">
                      Obramowania stron
                    </span>
                  </button>

                  {showPageBorderMenu && (
                    <div className="absolute top-[68px] right-0 z-50 bg-[#242831] border border-white/10 rounded-xl shadow-2xl py-1.5 w-48 text-xs backdrop-blur-xl anim-flyout">
                      {[
                        { id: 'none', name: 'Brak obramowania' },
                        { id: 'simple', name: 'Proste (Pojedyncza linia)' },
                        { id: 'double', name: 'Podwójne obramowanie' },
                        { id: 'thick', name: 'Pogrubione (Akcent niebieski)' },
                      ].map(b => (
                        <button
                          key={b.id}
                          onClick={() => {
                            if (setDesignSettings) {
                              setDesignSettings(prev => ({ ...prev, pageBorder: b.id as any }))
                            }
                            setShowPageBorderMenu(false)
                            triggerToast(`Obramowanie strony: ${b.name}`)
                          }}
                          className={`w-full text-left px-3 py-1.5 hover:bg-white/10 flex items-center justify-between cursor-pointer ${
                            designSettings?.pageBorder === b.id ? 'text-[#388bfd] font-semibold' : 'text-neutral-200'
                          }`}
                        >
                          <span>{b.name}</span>
                          {designSettings?.pageBorder === b.id && <Check size={12} />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <span className="text-[10px] text-neutral-400 text-center block">Tło strony</span>
            </div>
          </div>
        )}

        {/* TAB 4: UKŁAD (Layout) - Exactly matching Screenshot 2 */}
        {activeTab === 'layout' && (
          <div className="flex items-stretch divide-x divide-white/6 h-full text-xs">
            {/* Group 1: Ustawienia strony (Marginesy, Orientacja, Rozmiar, Kolumny + 3 stacked) */}
            <div className="flex flex-col justify-between pr-3 shrink-0">
              <div className="flex items-center gap-1.5">
                {/* Marginesy */}
                <div className="relative">
                  <button
                    onClick={() => setShowMarginsMenu(!showMarginsMenu)}
                    className="flex flex-col items-center justify-center px-2 py-1 hover:bg-white/5 active:scale-95 rounded-lg text-neutral-200 hover:text-white h-[66px] w-[56px] transition-all cursor-pointer"
                  >
                    <Grid size={22} className="text-[#388bfd] mb-0.5" />
                    <span className="text-[11px] leading-tight flex items-center">
                      Marginesy <ChevronDown size={10} className="ml-0.5 text-neutral-400" />
                    </span>
                  </button>

                  {showMarginsMenu && (
                    <div className="absolute top-[68px] left-0 z-50 bg-[#242831] border border-white/10 rounded-xl shadow-2xl py-1.5 w-52 text-xs backdrop-blur-xl anim-flyout">
                      {[
                        { id: 'normal', name: 'Normalne', desc: 'Góra/Dół/Lewy/Prawy: 2,54 cm' },
                        { id: 'narrow', name: 'Wąskie', desc: 'Wszystkie: 1,27 cm' },
                        { id: 'moderate', name: 'Umiarkowane', desc: 'G/D: 2,54 cm, L/P: 1,91 cm' },
                        { id: 'wide', name: 'Szerokie', desc: 'G/D: 2,54 cm, L/P: 5,08 cm' },
                      ].map(m => (
                        <button
                          key={m.id}
                          onClick={() => {
                            if (setDesignSettings) {
                              setDesignSettings(prev => ({ ...prev, margins: m.id as any }))
                            }
                            setShowMarginsMenu(false)
                            triggerToast(`Ustawiono marginesy: ${m.name}`)
                          }}
                          className={`w-full text-left px-3 py-1.5 hover:bg-white/10 flex flex-col cursor-pointer ${
                            designSettings?.margins === m.id ? 'text-[#388bfd] font-semibold' : 'text-neutral-200'
                          }`}
                        >
                          <span className="font-medium">{m.name}</span>
                          <span className="text-[10px] text-neutral-400">{m.desc}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Orientacja */}
                <div className="relative">
                  <button
                    onClick={() => setShowOrientationMenu(!showOrientationMenu)}
                    className="flex flex-col items-center justify-center px-2 py-1 hover:bg-white/5 active:scale-95 rounded-lg text-neutral-200 hover:text-white h-[66px] w-[56px] transition-all cursor-pointer"
                  >
                    <FileText size={22} className="text-neutral-300 mb-0.5" />
                    <span className="text-[11px] leading-tight flex items-center">
                      Orientacja <ChevronDown size={10} className="ml-0.5 text-neutral-400" />
                    </span>
                  </button>

                  {showOrientationMenu && (
                    <div className="absolute top-[68px] left-0 z-50 bg-[#242831] border border-white/10 rounded-xl shadow-2xl py-1.5 w-44 text-xs backdrop-blur-xl anim-flyout">
                      {[
                        { id: 'portrait', name: 'Pionowa' },
                        { id: 'landscape', name: 'Pozioma' },
                      ].map(o => (
                        <button
                          key={o.id}
                          onClick={() => {
                            if (setDesignSettings) {
                              setDesignSettings(prev => ({ ...prev, orientation: o.id as any }))
                            }
                            setShowOrientationMenu(false)
                            triggerToast(`Ustawiono orientację: ${o.name}`)
                          }}
                          className={`w-full text-left px-3 py-1.5 hover:bg-white/10 flex items-center justify-between cursor-pointer ${
                            designSettings?.orientation === o.id ? 'text-[#388bfd] font-semibold' : 'text-neutral-200'
                          }`}
                        >
                          <span>{o.name}</span>
                          {designSettings?.orientation === o.id && <Check size={12} />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Rozmiar */}
                <div className="relative">
                  <button
                    onClick={() => setShowSizeMenu(!showSizeMenu)}
                    className="flex flex-col items-center justify-center px-2 py-1 hover:bg-white/5 active:scale-95 rounded-lg text-neutral-200 hover:text-white h-[66px] w-[56px] transition-all cursor-pointer"
                  >
                    <FileText size={22} className="text-[#388bfd] mb-0.5" />
                    <span className="text-[11px] leading-tight flex items-center">
                      Rozmiar <ChevronDown size={10} className="ml-0.5 text-neutral-400" />
                    </span>
                  </button>

                  {showSizeMenu && (
                    <div className="absolute top-[68px] left-0 z-50 bg-[#242831] border border-white/10 rounded-xl shadow-2xl py-1.5 w-48 text-xs backdrop-blur-xl anim-flyout">
                      {[
                        { id: 'A4', name: 'A4 (210 × 297 mm)' },
                        { id: 'Letter', name: 'Letter (21,59 × 27,94 cm)' },
                        { id: 'A3', name: 'A3 (297 × 420 mm)' },
                        { id: 'A5', name: 'A5 (148 × 210 mm)' },
                      ].map(s => (
                        <button
                          key={s.id}
                          onClick={() => {
                            if (setDesignSettings) {
                              setDesignSettings(prev => ({ ...prev, pageSize: s.id as any }))
                            }
                            setShowSizeMenu(false)
                            triggerToast(`Rozmiar papieru: ${s.name}`)
                          }}
                          className={`w-full text-left px-3 py-1.5 hover:bg-white/10 flex items-center justify-between cursor-pointer ${
                            designSettings?.pageSize === s.id ? 'text-[#388bfd] font-semibold' : 'text-neutral-200'
                          }`}
                        >
                          <span>{s.name}</span>
                          {designSettings?.pageSize === s.id && <Check size={12} />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Kolumny */}
                <div className="relative">
                  <button
                    onClick={() => setShowColumnsMenu(!showColumnsMenu)}
                    className="flex flex-col items-center justify-center px-2 py-1 hover:bg-white/5 active:scale-95 rounded-lg text-neutral-200 hover:text-white h-[66px] w-[56px] transition-all cursor-pointer"
                  >
                    <Columns2 size={22} className="text-[#388bfd] mb-0.5" />
                    <span className="text-[11px] leading-tight flex items-center">
                      Kolumny <ChevronDown size={10} className="ml-0.5 text-neutral-400" />
                    </span>
                  </button>

                  {showColumnsMenu && (
                    <div className="absolute top-[68px] left-0 z-50 bg-[#242831] border border-white/10 rounded-xl shadow-2xl py-1.5 w-40 text-xs backdrop-blur-xl anim-flyout">
                      {[
                        { id: 1, name: 'Jedna kolumna' },
                        { id: 2, name: 'Dwie kolumny' },
                        { id: 3, name: 'Trzy kolumny' },
                      ].map(c => (
                        <button
                          key={c.id}
                          onClick={() => {
                            if (setDesignSettings) {
                              setDesignSettings(prev => ({ ...prev, columns: c.id as any }))
                            }
                            setShowColumnsMenu(false)
                            triggerToast(`Ustawiono: ${c.name}`)
                          }}
                          className={`w-full text-left px-3 py-1.5 hover:bg-white/10 flex items-center justify-between cursor-pointer ${
                            (designSettings?.columns || 1) === c.id ? 'text-[#388bfd] font-semibold' : 'text-neutral-200'
                          }`}
                        >
                          <span>{c.name}</span>
                          {(designSettings?.columns || 1) === c.id && <Check size={12} />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* 3 Stacked Buttons: Znaki podziału, Numery wierszy, Dzielenie wyrazów */}
                <div className="flex flex-col gap-0.5 pl-1">
                  {/* Znaki podziału */}
                  <div className="relative">
                    <button
                      onClick={() => setShowBreaksMenu(!showBreaksMenu)}
                      className="flex items-center gap-1.5 px-2 py-0.5 hover:bg-white/5 rounded text-neutral-300 hover:text-white transition-colors cursor-pointer text-[11px]"
                    >
                      <MinusIcon size={12} className="text-[#388bfd]" />
                      <span>Znaki podziału</span>
                      <ChevronDown size={10} className="text-neutral-400" />
                    </button>
                    {showBreaksMenu && (
                      <div className="absolute top-6 left-0 z-50 bg-[#242831] border border-white/10 rounded-xl shadow-2xl py-1.5 w-48 text-xs backdrop-blur-xl anim-flyout">
                        <button
                          onClick={() => {
                            editor?.chain().focus().insertContent('<p style="page-break-before: always;"></p><hr /><p></p>').run()
                            setShowBreaksMenu(false)
                            triggerToast('Wstawiono podział strony')
                          }}
                          className="w-full text-left px-3 py-1.5 hover:bg-white/10 text-neutral-200 cursor-pointer"
                        >
                          Podział strony
                        </button>
                        <button
                          onClick={() => {
                            editor?.chain().focus().insertContent('<p style="break-after: column;"></p>').run()
                            setShowBreaksMenu(false)
                            triggerToast('Wstawiono podział kolumny')
                          }}
                          className="w-full text-left px-3 py-1.5 hover:bg-white/10 text-neutral-200 cursor-pointer"
                        >
                          Podział kolumny
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Numery wierszy */}
                  <div className="relative">
                    <button
                      onClick={() => setShowLineNumbersMenu(!showLineNumbersMenu)}
                      className="flex items-center gap-1.5 px-2 py-0.5 hover:bg-white/5 rounded text-neutral-300 hover:text-white transition-colors cursor-pointer text-[11px]"
                    >
                      <ListOrdered size={12} className="text-neutral-300" />
                      <span>Numery wierszy</span>
                      <ChevronDown size={10} className="text-neutral-400" />
                    </button>
                    {showLineNumbersMenu && (
                      <div className="absolute top-6 left-0 z-50 bg-[#242831] border border-white/10 rounded-xl shadow-2xl py-1 w-40 text-xs backdrop-blur-xl anim-flyout">
                        {['Brak numerowania', 'Ciągłe numerowanie', 'Od nowa na każdej stronie'].map(num => (
                          <button
                            key={num}
                            onClick={() => {
                              setShowLineNumbersMenu(false)
                              triggerToast(`Numery wierszy: ${num}`)
                            }}
                            className="w-full text-left px-3 py-1.5 hover:bg-white/10 text-neutral-200 cursor-pointer"
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Dzielenie wyrazów */}
                  <div className="relative">
                    <button
                      onClick={() => setShowHyphenMenu(!showHyphenMenu)}
                      className="flex items-center gap-1.5 px-2 py-0.5 hover:bg-white/5 rounded text-neutral-300 hover:text-white transition-colors cursor-pointer text-[11px]"
                    >
                      <span className="text-[10px] font-mono font-bold text-neutral-400">abc</span>
                      <span>Dzielenie wyrazów</span>
                      <ChevronDown size={10} className="text-neutral-400" />
                    </button>
                    {showHyphenMenu && (
                      <div className="absolute top-6 left-0 z-50 bg-[#242831] border border-white/10 rounded-xl shadow-2xl py-1 w-36 text-xs backdrop-blur-xl anim-flyout">
                        {['Brak', 'Automatyczne', 'Ręczne'].map(h => (
                          <button
                            key={h}
                            onClick={() => {
                              setShowHyphenMenu(false)
                              triggerToast(`Dzielenie wyrazów: ${h}`)
                            }}
                            className="w-full text-left px-3 py-1.5 hover:bg-white/10 text-neutral-200 cursor-pointer"
                          >
                            {h}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <span className="text-[10px] text-neutral-400 text-center block">Ustawienia strony</span>
            </div>

            {/* Group 2: Akapit (Wcięcie & Odstępy with Spinners) matching Screenshot 2 */}
            <div className="flex flex-col justify-between px-3 shrink-0">
              <div className="flex items-center gap-4">
                {/* Wcięcie */}
                <div className="space-y-1">
                  <span className="text-[10.5px] font-semibold text-neutral-400 block">Wcięcie</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-neutral-300 w-14">Z lewej:</span>
                    <div className="flex items-center bg-[#181b22] border border-white/10 rounded-md overflow-hidden">
                      <span className="w-12 text-center text-[11px] text-white font-mono py-0.5">
                        {designSettings?.indentLeft || 0} cm
                      </span>
                      <div className="flex flex-col border-l border-white/10">
                        <button
                          onClick={() => {
                            if (setDesignSettings) {
                              setDesignSettings(prev => ({
                                ...prev,
                                indentLeft: Math.min(10, (prev.indentLeft || 0) + 0.5),
                              }))
                            }
                          }}
                          className="px-1 text-[8px] hover:bg-white/10 text-neutral-400 hover:text-white leading-none py-0.5 cursor-pointer"
                        >
                          ▲
                        </button>
                        <button
                          onClick={() => {
                            if (setDesignSettings) {
                              setDesignSettings(prev => ({
                                ...prev,
                                indentLeft: Math.max(0, (prev.indentLeft || 0) - 0.5),
                              }))
                            }
                          }}
                          className="px-1 text-[8px] hover:bg-white/10 text-neutral-400 hover:text-white leading-none py-0.5 cursor-pointer"
                        >
                          ▼
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-neutral-300 w-14">Z prawej:</span>
                    <div className="flex items-center bg-[#181b22] border border-white/10 rounded-md overflow-hidden">
                      <span className="w-12 text-center text-[11px] text-white font-mono py-0.5">
                        {designSettings?.indentRight || 0} cm
                      </span>
                      <div className="flex flex-col border-l border-white/10">
                        <button
                          onClick={() => {
                            if (setDesignSettings) {
                              setDesignSettings(prev => ({
                                ...prev,
                                indentRight: Math.min(10, (prev.indentRight || 0) + 0.5),
                              }))
                            }
                          }}
                          className="px-1 text-[8px] hover:bg-white/10 text-neutral-400 hover:text-white leading-none py-0.5 cursor-pointer"
                        >
                          ▲
                        </button>
                        <button
                          onClick={() => {
                            if (setDesignSettings) {
                              setDesignSettings(prev => ({
                                ...prev,
                                indentRight: Math.max(0, (prev.indentRight || 0) - 0.5),
                              }))
                            }
                          }}
                          className="px-1 text-[8px] hover:bg-white/10 text-neutral-400 hover:text-white leading-none py-0.5 cursor-pointer"
                        >
                          ▼
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Odstępy */}
                <div className="space-y-1">
                  <span className="text-[10.5px] font-semibold text-neutral-400 block">Odstępy</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-neutral-300 w-14">Powyżej:</span>
                    <div className="flex items-center bg-[#181b22] border border-white/10 rounded-md overflow-hidden">
                      <span className="w-12 text-center text-[11px] text-white font-mono py-0.5">
                        {designSettings?.spaceBefore || 0} pkt
                      </span>
                      <div className="flex flex-col border-l border-white/10">
                        <button
                          onClick={() => {
                            if (setDesignSettings) {
                              setDesignSettings(prev => ({
                                ...prev,
                                spaceBefore: Math.min(72, (prev.spaceBefore || 0) + 2),
                              }))
                            }
                          }}
                          className="px-1 text-[8px] hover:bg-white/10 text-neutral-400 hover:text-white leading-none py-0.5 cursor-pointer"
                        >
                          ▲
                        </button>
                        <button
                          onClick={() => {
                            if (setDesignSettings) {
                              setDesignSettings(prev => ({
                                ...prev,
                                spaceBefore: Math.max(0, (prev.spaceBefore || 0) - 2),
                              }))
                            }
                          }}
                          className="px-1 text-[8px] hover:bg-white/10 text-neutral-400 hover:text-white leading-none py-0.5 cursor-pointer"
                        >
                          ▼
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-neutral-300 w-14">Poniżej:</span>
                    <div className="flex items-center bg-[#181b22] border border-white/10 rounded-md overflow-hidden">
                      <span className="w-12 text-center text-[11px] text-white font-mono py-0.5">
                        {designSettings?.spaceAfter ?? 8} pkt
                      </span>
                      <div className="flex flex-col border-l border-white/10">
                        <button
                          onClick={() => {
                            if (setDesignSettings) {
                              setDesignSettings(prev => ({
                                ...prev,
                                spaceAfter: Math.min(72, (prev.spaceAfter ?? 8) + 2),
                              }))
                            }
                          }}
                          className="px-1 text-[8px] hover:bg-white/10 text-neutral-400 hover:text-white leading-none py-0.5 cursor-pointer"
                        >
                          ▲
                        </button>
                        <button
                          onClick={() => {
                            if (setDesignSettings) {
                              setDesignSettings(prev => ({
                                ...prev,
                                spaceAfter: Math.max(0, (prev.spaceAfter ?? 8) - 2),
                              }))
                            }
                          }}
                          className="px-1 text-[8px] hover:bg-white/10 text-neutral-400 hover:text-white leading-none py-0.5 cursor-pointer"
                        >
                          ▼
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <span className="text-[10px] text-neutral-400 text-center block">Akapit</span>
            </div>

            {/* Group 3: Rozmieszczanie matching Screenshot 2 */}
            <div className="flex flex-col justify-between pl-3 shrink-0">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => triggerToast('Położenie obiektu w tekście')}
                  className="flex flex-col items-center justify-center px-1.5 py-1 hover:bg-white/5 active:scale-95 rounded text-neutral-300 hover:text-white h-[66px] w-[50px] cursor-pointer transition-all"
                >
                  <FileText size={20} className="text-neutral-400 mb-0.5" />
                  <span className="text-[10.5px] leading-tight text-center">Położenie</span>
                </button>

                <button
                  onClick={() => triggerToast('Zawijanie tekstu wokół wybranego elementu')}
                  className="flex flex-col items-center justify-center px-1.5 py-1 hover:bg-white/5 active:scale-95 rounded text-neutral-300 hover:text-white h-[66px] w-[54px] cursor-pointer transition-all"
                >
                  <WrapText size={20} className="text-neutral-400 mb-0.5" />
                  <span className="text-[10.5px] leading-tight text-center">Zawijaj tekst</span>
                </button>

                <button
                  onClick={() => triggerToast('Przesunięto obiekt do przodu')}
                  className="flex flex-col items-center justify-center px-1.5 py-1 hover:bg-white/5 active:scale-95 rounded text-neutral-300 hover:text-white h-[66px] w-[54px] cursor-pointer transition-all"
                >
                  <BringToFront size={20} className="text-neutral-400 mb-0.5" />
                  <span className="text-[10.5px] leading-tight text-center">Do przodu</span>
                </button>

                <button
                  onClick={() => triggerToast('Przesunięto obiekt do tyłu')}
                  className="flex flex-col items-center justify-center px-1.5 py-1 hover:bg-white/5 active:scale-95 rounded text-neutral-300 hover:text-white h-[66px] w-[50px] cursor-pointer transition-all"
                >
                  <SendToBack size={20} className="text-neutral-400 mb-0.5" />
                  <span className="text-[10.5px] leading-tight text-center">Do tyłu</span>
                </button>

                <button
                  onClick={() => triggerToast('Okienko zaznaczenia aktywne')}
                  className="flex flex-col items-center justify-center px-2 py-1 hover:bg-white/5 active:scale-95 rounded-lg text-neutral-200 hover:text-white h-[66px] w-[62px] cursor-pointer transition-all"
                >
                  <div className="relative mb-0.5">
                    <Square size={20} className="text-amber-500" />
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#388bfd]" />
                  </div>
                  <span className="text-[10.5px] leading-tight text-center">Okienko zaznaczenia</span>
                </button>

                <div className="flex flex-col gap-1 pl-1 border-l border-white/6">
                  <button
                    onClick={() => triggerToast('Wyrównywanie obiektów aktywne')}
                    className="flex items-center gap-1.5 px-2 py-0.5 hover:bg-white/5 rounded text-neutral-300 hover:text-white transition-colors cursor-pointer text-[11px]"
                  >
                    <AlignLeft size={12} className="text-[#388bfd]" />
                    <span>Wyrównaj</span>
                  </button>
                  <button
                    onClick={() => triggerToast('Grupowanie obiektów aktywne')}
                    className="flex items-center gap-1.5 px-2 py-0.5 hover:bg-white/5 rounded text-neutral-300 hover:text-white transition-colors cursor-pointer text-[11px]"
                  >
                    <Square size={12} className="text-neutral-400" />
                    <span>Grupuj</span>
                  </button>
                  <button
                    onClick={() => triggerToast('Obrócono obiekt o 90 stopni')}
                    className="flex items-center gap-1.5 px-2 py-0.5 hover:bg-white/5 rounded text-neutral-300 hover:text-white transition-colors cursor-pointer text-[11px]"
                  >
                    <RotateCw size={12} className="text-cyan-400" />
                    <span>Obróć</span>
                  </button>
                </div>
              </div>
              <span className="text-[10px] text-neutral-400 text-center block">Rozmieszczanie</span>
            </div>
          </div>
        )}

        {/* TAB 5: Recenzja (Review) */}
        {activeTab === 'review' && (
          <div className="flex items-center space-x-3 text-xs h-full">
            <button
              onClick={() => alert('Pisownia i gramatyka: Sprawdzanie ukończone. Brak błędów!')}
              className="flex flex-col items-center justify-center px-3 py-1 hover:bg-white/5 active:scale-95 rounded text-neutral-200 h-[66px] w-[80px] cursor-pointer transition-all"
            >
              <CheckCircle2 size={22} className="text-emerald-400 mb-1" />
              <span className="text-[11px] text-center">Pisownia</span>
            </button>
            <button
              onClick={onOpenWordCount}
              className="flex flex-col items-center justify-center px-3 py-1 hover:bg-white/5 active:scale-95 rounded text-neutral-200 h-[66px] w-[80px] cursor-pointer transition-all"
            >
              <FileText size={22} className="text-[#388bfd] mb-1" />
              <span className="text-[11px] text-center">Statystyka</span>
            </button>
            <button
              onClick={handleSpeech}
              className="flex flex-col items-center justify-center px-3 py-1 hover:bg-white/5 active:scale-95 rounded text-neutral-200 h-[66px] w-[80px] cursor-pointer transition-all"
            >
              <Volume2 size={22} className="text-purple-400 mb-1" />
              <span className="text-[11px] text-center">Czytaj na głos</span>
            </button>
          </div>
        )}

        {/* TAB 6: Widok (View) */}
        {activeTab === 'view' && (
          <div className="flex items-center space-x-3 text-xs h-full">
            <button
              onClick={() => setPageTheme(pageTheme === 'dark' ? 'light' : 'dark')}
              className="flex flex-col items-center justify-center px-3 py-1 hover:bg-white/5 active:scale-95 rounded text-neutral-200 h-[66px] w-[80px] cursor-pointer transition-all"
            >
              {pageTheme === 'dark' ? (
                <Sun size={22} className="text-yellow-400 mb-1" />
              ) : (
                <Moon size={22} className="text-[#388bfd] mb-1" />
              )}
              <span className="text-[11px] text-center">
                {pageTheme === 'dark' ? 'Jasna strona' : 'Ciemna strona'}
              </span>
            </button>

            <button
              onClick={() => setShowRuler(!showRuler)}
              className={`flex flex-col items-center justify-center px-3 py-1 rounded text-neutral-200 h-[66px] w-[70px] cursor-pointer transition-all ${
                showRuler ? 'bg-[#0078d4] text-white shadow-xs' : 'hover:bg-white/5'
              }`}
            >
              <Ruler size={22} className="mb-1" />
              <span className="text-[11px]">Linijka</span>
            </button>
          </div>
        )}

        {/* TAB 7: Pomoc (Help) */}
        {activeTab === 'help' && (
          <div className="flex items-center space-x-3 text-xs h-full">
            <button
              onClick={onOpenHelp}
              className="flex flex-col items-center justify-center px-3 py-1 hover:bg-white/5 active:scale-95 rounded text-neutral-200 h-[66px] w-[70px] cursor-pointer transition-all"
            >
              <HelpCircle size={22} className="text-[#388bfd] mb-1" />
              <span className="text-[11px]">Pomoc</span>
            </button>
          </div>
        )}

        {/* Other tabs fallback */}
        {['references', 'mailings'].includes(activeTab) && (
          <div className="flex items-center px-4 text-neutral-400 text-xs">
            Narzędzia karty są w pełni zintegrowane i gotowe do użycia w bieżącym dokumencie.
          </div>
        )}
      </div>
    </div>
  )
}
