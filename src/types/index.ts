export interface DocumentItem {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
  pinned: boolean
  wordCount: number
  path?: string
}

export interface TemplateItem {
  id: string
  title: string
  subtitle: string
  content: string
  badge?: string
  previewType: 'blank' | 'welcome' | 'single' | 'resume1' | 'toc' | 'resume2' | 'cover1' | 'cover2'
}

export type ScreenMode = 'start' | 'editor' | 'backstage'

export type RibbonTab =
  | 'home'
  | 'insert'
  | 'design'
  | 'layout'
  | 'references'
  | 'mailings'
  | 'review'
  | 'view'
  | 'help'

export type ViewMode = 'read' | 'print' | 'web'

export type PageTheme = 'dark' | 'light'

export interface DocumentDesignSettings {
  // Układ (Layout)
  orientation: 'portrait' | 'landscape'
  margins: 'normal' | 'narrow' | 'moderate' | 'wide'
  pageSize: 'A4' | 'Letter' | 'A3' | 'A5'
  columns: 1 | 2 | 3
  indentLeft: number // cm
  indentRight: number // cm
  spaceBefore: number // pkt
  spaceAfter: number // pkt

  // Projektowanie (Design)
  theme: string // 'office' | 'facet' | 'integral' | 'ion' | 'organic' | 'retro' | 'slice'
  styleSet: string // 'default' | 'shaded' | 'classic' | 'underlined' | 'centered' | 'modern' | etc.
  colors: string // 'office' | 'warm' | 'emerald' | 'purple' | 'mono'
  fontSet: string // 'aptos' | 'calibri' | 'arial' | 'georgia'
  paragraphSpacing: 'normal' | 'compact' | 'tight' | 'open' | 'relaxed' | 'double'
  watermark: string // '' | 'POUFNE' | 'PILNE' | 'WERSJA ROBOCZA' | 'NIE KOPIOWAĆ' | 'ORYGINAŁ'
  pageColor: string // '' | '#232323' | '#ffffff' | '#fbf0d9' | '#1a1a1a' | '#f0f8ff'
  pageBorder: 'none' | 'simple' | 'double' | 'thick'
}

declare global {
  interface Window {
    electronAPI?: {
      isElectron: boolean
      minimize: () => void
      maximize: () => void
      close: () => void
      isMaximized: () => Promise<boolean>
      installUpdate?: (url: string) => Promise<{ success: boolean; error?: string }>
      showSaveDialog?: (options?: any) => Promise<{ canceled: boolean; filePath?: string; error?: string }>
      writeFileBuffer?: (data: { filePath: string; buffer: Uint8Array | number[] }) => Promise<{ success: boolean; error?: string }>
      exportPdfNative?: (data: { filePath: string }) => Promise<{ success: boolean; error?: string }>
      getInstallerUsername?: () => Promise<string>
      showOpenDialog?: (options?: any) => Promise<{ canceled: boolean; filePaths?: string[]; error?: string }>
      readFileAsBuffer?: (filePath: string) => Promise<{ success: boolean; buffer: ArrayBuffer; fileName: string; error?: string }>
      getPendingFile?: () => Promise<string | null>
      onOpenFileFromSystem?: (callback: (filePath: string) => void) => () => void
      onUpdateProgress?: (
        callback: (data: {
          percent: number
          transferred: number
          total: number
          status?: 'downloading' | 'installing' | 'error'
        }) => void
      ) => () => void
    }
  }
}
