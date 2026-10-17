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

declare global {
  interface Window {
    electronAPI?: {
      isElectron: boolean
      minimize: () => void
      maximize: () => void
      close: () => void
      isMaximized: () => Promise<boolean>
    }
  }
}
