import React, { useState, useEffect, useRef, useMemo } from 'react'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import FontFamily from '@tiptap/extension-font-family'
import { Table } from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'

import { FontSize } from './extensions/fontSize'
import type { ScreenMode, RibbonTab, ViewMode, PageTheme, DocumentItem, TemplateItem, DocumentDesignSettings } from './types'


import { TitleBar } from './components/TitleBar'
import { Ribbon } from './components/Ribbon'
import { DocumentCanvas } from './components/DocumentCanvas'
import { StatusBar } from './components/StatusBar'
import { HubView } from './components/HubView'

import { WordCountModal } from './components/WordCountModal'
import { FindReplaceModal } from './components/FindReplaceModal'
import { TablePickerModal } from './components/TablePickerModal'
import { HyperlinkModal } from './components/HyperlinkModal'
import { ShareModal } from './components/ShareModal'
import { AccountModal } from './components/AccountModal'
import { OptionsModal } from './components/OptionsModal'
import { HelpModal } from './components/HelpModal'
import { UpdateModal } from './components/UpdateModal'
import { checkGitHubRelease, type ReleaseInfo } from './services/updater'
import { exportToDocxBlob } from './services/docxExport'
import { convertDocxArrayBufferToHtml } from './services/docxImport'

const STORAGE_KEY_DOCS = 'arcword_documents_v1'
const STORAGE_KEY_AUTOSAVE = 'arcword_autosave_enabled'
const STORAGE_KEY_THEME = 'arcword_page_theme'
const STORAGE_KEY_USERNAME = 'arcword_user_name'

export const App: React.FC = () => {
  // Navigation & Screen states
  const [screenMode, setScreenMode] = useState<ScreenMode>('start')
  const [activeTab, setActiveTab] = useState<RibbonTab>('home')
  const [viewMode, setViewMode] = useState<ViewMode>('print')
  const [pageTheme, setPageTheme] = useState<PageTheme>('dark')
  const [zoom, setZoom] = useState<number>(100)
  const [showRuler, setShowRuler] = useState<boolean>(true)
  const [showPilcrow, setShowPilcrow] = useState<boolean>(false)
  const [isFocusMode, setIsFocusMode] = useState<boolean>(false)

  // User profile name
  const [userName, setUserNameState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USERNAME)
      if (saved && saved.trim()) return saved.trim()
    } catch {}
    return 'Sebastian'
  })

  const setUserName = (name: string) => {
    setUserNameState(name)
    try {
      localStorage.setItem(STORAGE_KEY_USERNAME, name)
    } catch {}
  }

  // Current Document states
  const [docTitle, setDocTitle] = useState<string>('Dokument1')
  const [currentDocId, setCurrentDocId] = useState<string | null>(null)
  const [autosave, setAutosave] = useState<boolean>(true)
  const [backstageNav, setBackstageNav] = useState<string>('home')
  const [designSettings, setDesignSettings] = useState<DocumentDesignSettings>({
    orientation: 'portrait',
    margins: 'normal',
    pageSize: 'A4',
    columns: 1,
    indentLeft: 0,
    indentRight: 0,
    spaceBefore: 0,
    spaceAfter: 8,
    theme: 'office',
    styleSet: 'default',
    colors: 'office',
    fontSet: 'calibri',
    paragraphSpacing: 'normal',
    watermark: '',
    pageColor: '',
    pageBorder: 'none',
  })

  // Modals
  const [isWordCountOpen, setIsWordCountOpen] = useState(false)
  const [isFindReplaceOpen, setIsFindReplaceOpen] = useState(false)
  const [findReplaceTab, setFindReplaceTab] = useState<'find' | 'replace'>('find')
  const [isTablePickerOpen, setIsTablePickerOpen] = useState(false)
  const [isHyperlinkOpen, setIsHyperlinkOpen] = useState(false)
  const [isShareOpen, setIsShareOpen] = useState(false)
  const [isAccountOpen, setIsAccountOpen] = useState(false)
  const [isOptionsOpen, setIsOptionsOpen] = useState(false)
  const [isHelpOpen, setIsHelpOpen] = useState(false)
  const [updateRelease, setUpdateRelease] = useState<ReleaseInfo | null>(null)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Document list from localStorage
  const [documents, setDocuments] = useState<DocumentItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_DOCS)
      if (stored) return JSON.parse(stored)
    } catch {
      // ignore
    }
    return []
  })

  // Initialize TipTap Editor
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      Subscript,
      Superscript,
      FontFamily,
      FontSize,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Image.configure({
        allowBase64: true,
        inline: false,
        HTMLAttributes: {
          class: 'arcword-image',
        },
      }),
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: '<p></p>',
    editorProps: {
      attributes: {
        class: 'tiptap-content outline-none',
      },
    },
  })

  // Load saved preferences
  useEffect(() => {
    try {
      const savedAutosave = localStorage.getItem(STORAGE_KEY_AUTOSAVE)
      if (savedAutosave !== null) setAutosave(savedAutosave === 'true')

      const savedTheme = localStorage.getItem(STORAGE_KEY_THEME) as PageTheme
      if (savedTheme) setPageTheme(savedTheme)

      const savedName = localStorage.getItem(STORAGE_KEY_USERNAME)
      if (savedName && savedName.trim()) {
        setUserNameState(savedName.trim())
      } else if (window.electronAPI?.getInstallerUsername) {
        window.electronAPI.getInstallerUsername().then(detected => {
          if (detected && detected.trim()) {
            setUserName(detected.trim())
          }
        })
      }
    } catch {
      // ignore
    }

    // Auto-check GitHub release on startup
    checkGitHubRelease().then(res => {
      if (res.isUpdateAvailable && res.release) {
        setUpdateRelease(res.release)
        setIsUpdateModalOpen(true)
      }
    })
  }, [])

  // Handle file opened via Windows file association (double-click .docx)
  useEffect(() => {
    if (!editor || !window.electronAPI) return

    // Check for pending file from initial launch (e.g. double-click on .docx)
    if (window.electronAPI.getPendingFile) {
      window.electronAPI.getPendingFile().then((filePath: string | null) => {
        if (filePath) {
          openFileFromPath(filePath)
        }
      })
    }

    // Listen for files opened while app is already running (second-instance)
    let cleanup: (() => void) | undefined
    if (window.electronAPI.onOpenFileFromSystem) {
      cleanup = window.electronAPI.onOpenFileFromSystem((filePath: string) => {
        if (filePath) {
          openFileFromPath(filePath)
        }
      })
    }

    return () => {
      if (cleanup) cleanup()
    }
  }, [editor])


  // Persist documents list
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_DOCS, JSON.stringify(documents))
    } catch {
      // ignore
    }
  }, [documents])

  // Persist preferences
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_AUTOSAVE, String(autosave))
      localStorage.setItem(STORAGE_KEY_THEME, pageTheme)
    } catch {
      // ignore
    }
  }, [autosave, pageTheme])

  // Autosave interval
  useEffect(() => {
    if (!autosave || screenMode !== 'editor' || !editor) return

    const interval = setInterval(() => {
      saveDocumentInternal(false)
    }, 5000)

    return () => clearInterval(interval)
  }, [autosave, screenMode, editor, currentDocId, docTitle])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault()
        saveDocumentInternal(true)
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault()
        setBackstageNav('print')
        setScreenMode('backstage')
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
        e.preventDefault()
        setFindReplaceTab('find')
        setIsFindReplaceOpen(true)
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'h') {
        e.preventDefault()
        setFindReplaceTab('replace')
        setIsFindReplaceOpen(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [editor, docTitle, currentDocId])

  // Save document internal function
  const saveDocumentInternal = (notify = true) => {
    if (!editor) return

    const content = editor.getHTML()
    const text = editor.getText()
    const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0
    const now = new Date()
    const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
    const dateFormatted = `Dzisiaj o ${timeString}`

    if (currentDocId) {
      setDocuments(prev =>
        prev.map(d =>
          d.id === currentDocId
            ? {
                ...d,
                title: docTitle,
                content,
                updatedAt: dateFormatted,
                wordCount,
              }
            : d
        )
      )
    } else {
      const newId = 'doc_' + Date.now()
      const newDoc: DocumentItem = {
        id: newId,
        title: docTitle,
        content,
        createdAt: dateFormatted,
        updatedAt: dateFormatted,
        pinned: false,
        wordCount,
        path: 'ArcWord > Moje dokumenty',
      }
      setCurrentDocId(newId)
      setDocuments(prev => [newDoc, ...prev])
    }

    if (notify) {
      // subtle notification feedback
    }
  }

  // Calculate statistics
  const stats = useMemo(() => {
    if (!editor) {
      return {
        pages: 1,
        words: 0,
        charsWithoutSpaces: 0,
        charsWithSpaces: 0,
        paragraphs: 0,
        lines: 0,
      }
    }
    const text = editor.getText()
    const trimmed = text.trim()
    const words = trimmed ? trimmed.split(/\s+/).length : 0
    const charsWithSpaces = text.length
    const charsWithoutSpaces = text.replace(/\s+/g, '').length
    const paragraphs = text.split('\n').filter(p => p.trim().length > 0).length || 1
    const lines = Math.max(1, Math.ceil(text.length / 80))
    const pages = Math.max(1, Math.ceil(words / 350))

    return {
      pages,
      words,
      charsWithoutSpaces,
      charsWithSpaces,
      paragraphs,
      lines,
    }
  }, [editor?.state.doc])

  // Select Template
  const handleSelectTemplate = (template: TemplateItem) => {
    const newId = 'doc_' + Date.now()
    const now = new Date()
    const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
    const newDocTitle = template.id === 'blank' ? 'Dokument1' : template.title

    setDocTitle(newDocTitle)
    setCurrentDocId(newId)

    if (editor) {
      editor.commands.setContent(template.content)
    }

    const newDoc: DocumentItem = {
      id: newId,
      title: newDocTitle,
      content: template.content,
      createdAt: `Dzisiaj o ${timeString}`,
      updatedAt: `Dzisiaj o ${timeString}`,
      pinned: false,
      wordCount: template.content.split(/\s+/).length,
      path: 'ArcWord > Moje dokumenty',
    }

    setDocuments(prev => [newDoc, ...prev.filter(d => d.id !== newId)])
    setScreenMode('editor')
  }

  // Open existing document
  const handleOpenDocument = (doc: DocumentItem) => {
    setCurrentDocId(doc.id)
    setDocTitle(doc.title)
    if (editor) {
      editor.commands.setContent(doc.content)
    }
    setScreenMode('editor')
  }

  // Delete document
  const handleDeleteDocument = (docId: string) => {
    setDocuments(prev => prev.filter(d => d.id !== docId))
    if (currentDocId === docId) {
      setCurrentDocId(null)
      setDocTitle('Dokument1')
      if (editor) editor.commands.setContent('<p></p>')
    }
  }

  // Toggle Pin
  const handleTogglePin = (docId: string) => {
    setDocuments(prev =>
      prev.map(d => (d.id === docId ? { ...d, pinned: !d.pinned } : d))
    )
  }

  // Open File from computer
  const handleOpenFilePicker = async () => {
    // Use native Electron open dialog if available
    if (window.electronAPI?.showOpenDialog) {
      try {
        const result = await window.electronAPI.showOpenDialog({
          title: 'Otwórz dokument',
          filters: [
            { name: 'Dokument programu Word (*.docx;*.doc)', extensions: ['docx', 'doc'] },
            { name: 'Pliki tekstowe (*.txt)', extensions: ['txt'] },
            { name: 'Pliki HTML (*.html;*.htm)', extensions: ['html', 'htm'] },
            { name: 'Wszystkie pliki (*.*)', extensions: ['*'] },
          ],
        })
        if (!result.canceled && result.filePaths && result.filePaths.length > 0) {
          await openFileFromPath(result.filePaths[0])
        }
      } catch (err) {
        console.error('Open dialog error:', err)
        // Fallback to file input
        fileInputRef.current?.click()
      }
    } else {
      fileInputRef.current?.click()
    }
  }

  // Open a file given its path (for Electron native dialogs and file association)
  const openFileFromPath = async (filePath: string) => {
    if (!editor || !window.electronAPI?.readFileAsBuffer) return
    try {
      const res = await window.electronAPI.readFileAsBuffer(filePath)
      if (!res.success) {
        console.error('Failed to read file:', res.error)
        return
      }

      const fileName = res.fileName || filePath.split(/[/\\]/).pop() || 'Dokument'
      const title = fileName.replace(/\.[^/.]+$/, '')
      const lowerName = fileName.toLowerCase()

      let htmlContent = ''

      if (lowerName.endsWith('.docx') || lowerName.endsWith('.doc')) {
        const arrayBuffer = res.buffer instanceof ArrayBuffer ? res.buffer : new Uint8Array(res.buffer).buffer
        const result = await convertDocxArrayBufferToHtml(arrayBuffer)
        htmlContent = result.html
      } else {
        // Text or HTML file
        const decoder = new TextDecoder('utf-8')
        const uint8 = new Uint8Array(res.buffer)
        htmlContent = decoder.decode(uint8)
      }

      const newId = 'doc_' + Date.now()
      const now = new Date()
      const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`

      setDocTitle(title)
      setCurrentDocId(newId)
      editor.commands.setContent(htmlContent)

      const newDoc: DocumentItem = {
        id: newId,
        title,
        content: htmlContent,
        createdAt: `Dzisiaj o ${timeString}`,
        updatedAt: `Dzisiaj o ${timeString}`,
        pinned: false,
        wordCount: htmlContent.split(/\s+/).length,
        path: 'Pliki lokalne',
      }

      setDocuments(prev => [newDoc, ...prev])
      setScreenMode('editor')
    } catch (err) {
      console.error('Error opening file from path:', err)
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !editor) return

    const lowerName = file.name.toLowerCase()

    if (lowerName.endsWith('.docx') || lowerName.endsWith('.doc')) {
      // Read as ArrayBuffer and convert with mammoth
      const arrayBuffer = await file.arrayBuffer()
      try {
        const result = await convertDocxArrayBufferToHtml(arrayBuffer)
        const title = file.name.replace(/\.[^/.]+$/, '')
        const newId = 'doc_' + Date.now()
        const now = new Date()
        const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`

        setDocTitle(title)
        setCurrentDocId(newId)
        editor.commands.setContent(result.html)

        const newDoc: DocumentItem = {
          id: newId,
          title,
          content: result.html,
          createdAt: `Dzisiaj o ${timeString}`,
          updatedAt: `Dzisiaj o ${timeString}`,
          pinned: false,
          wordCount: result.html.split(/\s+/).length,
          path: 'Pliki lokalne',
        }

        setDocuments(prev => [newDoc, ...prev])
        setScreenMode('editor')
      } catch (err) {
        console.error('Error converting docx:', err)
        alert('Nie udało się otworzyć pliku DOCX. Plik może być uszkodzony.')
      }
    } else {
      // HTML, TXT files - read as text
      const reader = new FileReader()
      reader.onload = event => {
        const content = event.target?.result as string
        const title = file.name.replace(/\.[^/.]+$/, '')
        const newId = 'doc_' + Date.now()
        const now = new Date()
        const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`

        setDocTitle(title)
        setCurrentDocId(newId)
        editor.commands.setContent(content)

        const newDoc: DocumentItem = {
          id: newId,
          title,
          content,
          createdAt: `Dzisiaj o ${timeString}`,
          updatedAt: `Dzisiaj o ${timeString}`,
          pinned: false,
          wordCount: content.split(/\s+/).length,
          path: 'Pliki lokalne',
        }

        setDocuments(prev => [newDoc, ...prev])
        setScreenMode('editor')
      }
      reader.readAsText(file)
    }
  }

  // Save document as Word (.docx)
  const handleSaveAs = async () => {
    if (!editor) return
    try {
      const blob = await exportToDocxBlob(editor, docTitle)
      const fileName = `${docTitle}.docx`

      if (window.electronAPI?.showSaveDialog && window.electronAPI?.writeFileBuffer) {
        const res = await window.electronAPI.showSaveDialog({
          title: 'Zapisz jako',
          defaultPath: fileName,
          filters: [
            { name: 'Dokument programu Word (*.docx)', extensions: ['docx'] },
            { name: 'Wszystkie pliki (*.*)', extensions: ['*'] },
          ],
        })

        if (!res.canceled && res.filePath) {
          const arrayBuffer = await blob.arrayBuffer()
          await window.electronAPI.writeFileBuffer({
            filePath: res.filePath,
            buffer: Array.from(new Uint8Array(arrayBuffer)),
          })
        }
      } else {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = fileName
        a.click()
        URL.revokeObjectURL(url)
      }
    } catch (err) {
      console.error('Error saving .docx:', err)
    }
  }

  // Export document as PDF
  const handleExportPdf = async () => {
    if (!editor) return
    try {
      const fileName = `${docTitle}.pdf`
      if (window.electronAPI?.showSaveDialog && window.electronAPI?.exportPdfNative) {
        const res = await window.electronAPI.showSaveDialog({
          title: 'Eksportuj jako PDF',
          defaultPath: fileName,
          filters: [
            { name: 'Dokument PDF (*.pdf)', extensions: ['pdf'] },
            { name: 'Wszystkie pliki (*.*)', extensions: ['*'] },
          ],
        })

        if (!res.canceled && res.filePath) {
          await window.electronAPI.exportPdfNative({ filePath: res.filePath })
        }
      } else {
        window.print()
      }
    } catch (err) {
      console.error('Error exporting PDF:', err)
      window.print()
    }
  }

  return (
    <div
      className={`h-screen w-screen flex flex-col overflow-hidden ${
        pageTheme === 'light' ? 'theme-light bg-[#f0f2f5]' : 'bg-[#1f1f1f]'
      }`}
    >
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".docx,.doc,.html,.htm,.txt"
        className="hidden"
      />

      {/* Top Title Bar (Visible on all views, matching Screenshots 1, 2, 3) */}
      {!isFocusMode && (
        <TitleBar
          screenMode={screenMode}
          docTitle={docTitle}
          setDocTitle={setDocTitle}
          autosave={autosave}
          setAutosave={setAutosave}
          onSave={() => saveDocumentInternal(true)}
          onUndo={() => editor?.chain().focus().undo().run()}
          onRedo={() => editor?.chain().focus().redo().run()}
          canUndo={editor?.can().undo() ?? false}
          canRedo={editor?.can().redo() ?? false}
          onOpenHelp={() => setIsHelpOpen(true)}
          onOpenAccount={() => setIsAccountOpen(true)}
          onOpenShare={() => setIsShareOpen(true)}
          onSearchFocus={() => {
            setFindReplaceTab('find')
            setIsFindReplaceOpen(true)
          }}
          onCloseApp={() => {
            if (screenMode === 'editor') {
              saveDocumentInternal(false)
              setScreenMode('start')
            }
          }}
          userName={userName}
          pageTheme={pageTheme}
        />
      )}

      {/* Conditional Screen Rendering */}
      {screenMode === 'start' && (
        <HubView
          mode="start"
          documents={documents}
          currentDocId={currentDocId}
          docTitle={docTitle}
          docContent={editor?.getHTML() || ''}
          onBackToEditor={() => setScreenMode('editor')}
          onSelectTemplate={handleSelectTemplate}
          onOpenDocument={handleOpenDocument}
          onDeleteDocument={handleDeleteDocument}
          onTogglePin={handleTogglePin}
          onSaveCurrentDoc={() => saveDocumentInternal(true)}
          onSaveAs={handleSaveAs}
          onPrint={() => window.print()}
          onExport={handleSaveAs}
          onExportPdf={handleExportPdf}
          onCloseDocument={() => setScreenMode('start')}
          onOpenFilePicker={handleOpenFilePicker}
          onOpenAccount={() => setIsAccountOpen(true)}
          onOpenOptions={() => setIsOptionsOpen(true)}
          onOpenShare={() => setIsShareOpen(true)}
          pageTheme={pageTheme}
        />
      )}

      {screenMode === 'backstage' && (
        <HubView
          mode="backstage"
          initialNav={backstageNav}
          documents={documents}
          currentDocId={currentDocId}
          docTitle={docTitle}
          docContent={editor?.getHTML() || ''}
          onBackToEditor={() => setScreenMode('editor')}
          onSelectTemplate={handleSelectTemplate}
          onOpenDocument={handleOpenDocument}
          onDeleteDocument={handleDeleteDocument}
          onTogglePin={handleTogglePin}
          onSaveCurrentDoc={() => saveDocumentInternal(true)}
          onSaveAs={handleSaveAs}
          onPrint={() => window.print()}
          onExport={handleSaveAs}
          onExportPdf={handleExportPdf}
          onCloseDocument={() => setScreenMode('start')}
          onOpenFilePicker={handleOpenFilePicker}
          onOpenAccount={() => setIsAccountOpen(true)}
          onOpenOptions={() => setIsOptionsOpen(true)}
          onOpenShare={() => setIsShareOpen(true)}
          pageTheme={pageTheme}
        />
      )}


      {screenMode === 'editor' && (
        <div key="editor-view" className="flex-1 flex flex-col overflow-hidden anim-scale-in">
          {/* Ribbon Bar */}
          {!isFocusMode && (
            <Ribbon
              editor={editor}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onOpenBackstage={() => {
                setBackstageNav('home')
                setScreenMode('backstage')
              }}
              onOpenFindReplace={tab => {
                setFindReplaceTab(tab || 'find')
                setIsFindReplaceOpen(true)
              }}
              onOpenTablePicker={() => setIsTablePickerOpen(true)}
              onOpenHyperlink={() => setIsHyperlinkOpen(true)}
              onOpenWordCount={() => setIsWordCountOpen(true)}
              onOpenShare={() => setIsShareOpen(true)}
              onOpenHelp={() => setIsHelpOpen(true)}
              pageTheme={pageTheme}
              setPageTheme={setPageTheme}
              showRuler={showRuler}
              setShowRuler={setShowRuler}
              showPilcrow={showPilcrow}
              setShowPilcrow={setShowPilcrow}
              designSettings={designSettings}
              setDesignSettings={setDesignSettings}
            />
          )}

          {/* Main Document Canvas */}
          <DocumentCanvas
            editor={editor}
            pageTheme={pageTheme}
            viewMode={viewMode}
            zoom={zoom}
            showRuler={showRuler}
            showPilcrow={showPilcrow}
            designSettings={designSettings}
          />

          {/* Bottom Status Bar */}
          <StatusBar
            pageCount={stats.pages}
            currentPage={1}
            wordCount={stats.words}
            viewMode={viewMode}
            setViewMode={setViewMode}
            zoom={zoom}
            setZoom={setZoom}
            onOpenWordCount={() => setIsWordCountOpen(true)}
            isFocusMode={isFocusMode}
            setIsFocusMode={setIsFocusMode}
            pageTheme={pageTheme}
          />
        </div>
      )}


      {/* Modals & Dialogs */}
      <WordCountModal
        isOpen={isWordCountOpen}
        onClose={() => setIsWordCountOpen(false)}
        stats={stats}
      />

      <FindReplaceModal
        isOpen={isFindReplaceOpen}
        onClose={() => setIsFindReplaceOpen(false)}
        editor={editor}
        initialTab={findReplaceTab}
      />

      <TablePickerModal
        isOpen={isTablePickerOpen}
        onClose={() => setIsTablePickerOpen(false)}
        editor={editor}
      />

      <HyperlinkModal
        isOpen={isHyperlinkOpen}
        onClose={() => setIsHyperlinkOpen(false)}
        editor={editor}
      />

      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        docTitle={docTitle}
        docContent={editor?.getHTML() || ''}
      />

      <AccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        userName={userName}
        setUserName={setUserName}
        pageTheme={pageTheme}
      />

      <OptionsModal
        isOpen={isOptionsOpen}
        onClose={() => setIsOptionsOpen(false)}
        autosave={autosave}
        setAutosave={setAutosave}
        pageTheme={pageTheme}
        setPageTheme={setPageTheme}
        userName={userName}
        setUserName={setUserName}
        onUpdateFound={release => {
          setUpdateRelease(release)
          setIsUpdateModalOpen(true)
        }}
      />

      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

      <UpdateModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        release={updateRelease}
      />
    </div>

  )
}

export default App
