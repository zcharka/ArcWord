import React, { useState, useEffect } from 'react'
import {
  ArrowLeft,
  Home,
  FileText,
  FolderOpen,
  Info,
  Save,
  Clock,
  Printer,
  Share2,
  Download,
  XCircle,
  User,
  MessageSquare,
  Settings,
  ChevronDown,
  Pin,
  PinOff,
  Trash2,
  ChevronRight,
  FileCode,
} from 'lucide-react'
import type { DocumentItem, TemplateItem } from '../types'
import { TEMPLATES } from '../data/templates'
import { TemplateCard } from './TemplateCard'
import { PrintView } from './PrintView'

interface HubViewProps {
  mode: 'start' | 'backstage'
  documents: DocumentItem[]
  currentDocId: string | null
  docTitle?: string
  docContent?: string
  initialNav?: string
  onBackToEditor: () => void
  onSelectTemplate: (template: TemplateItem) => void
  onOpenDocument: (doc: DocumentItem) => void
  onDeleteDocument: (docId: string) => void
  onTogglePin: (docId: string) => void
  onSaveCurrentDoc: () => void
  onSaveAs: () => void
  onPrint: () => void
  onExport: () => void
  onExportPdf?: () => void
  onCloseDocument: () => void
  onOpenFilePicker: () => void
  onOpenAccount: () => void
  onOpenOptions: () => void
  onOpenShare: () => void
  pageTheme?: 'dark' | 'light'
}


export const HubView: React.FC<HubViewProps> = ({
  mode,
  documents,
  currentDocId,
  docTitle,
  docContent,
  initialNav = 'home',
  onBackToEditor,
  onSelectTemplate,
  onOpenDocument,
  onDeleteDocument,
  onTogglePin,
  onSaveCurrentDoc,
  onSaveAs,
  onPrint,
  onExport: _onExport,
  onExportPdf,
  onCloseDocument,
  onOpenFilePicker,
  onOpenAccount,
  onOpenOptions,
  onOpenShare,
  pageTheme = 'dark',
}) => {
  const [activeTab, setActiveTab] = useState<'recent' | 'pinned'>('recent')
  const [showTemplatesSection, setShowTemplatesSection] = useState(true)
  const [activeNav, setActiveNav] = useState<string>(initialNav)

  useEffect(() => {
    if (initialNav) {
      setActiveNav(initialNav)
    }
  }, [initialNav])
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [infoOpen, setInfoOpen] = useState(false)

  const isLight = pageTheme === 'light'

  // Dynamic greeting based on current local time
  const currentHour = new Date().getHours()
  const greeting = currentHour < 18 && currentHour >= 5 ? 'Dzień dobry' : 'Dobry wieczór'

  const filteredDocuments = documents.filter(doc =>
    activeTab === 'pinned' ? doc.pinned : true
  )

  const currentDoc = documents.find(d => d.id === currentDocId)

  return (
    <div
      className={`flex-1 flex overflow-hidden ${
        isLight ? 'bg-[#f0f2f5] text-neutral-800' : 'bg-[#181818] text-neutral-200'
      } select-none`}
    >
      {/* LEFT NAVIGATION SIDEBAR */}
      <div
        className={`anim-backstage-sidebar w-[190px] ${
          isLight ? 'bg-[#f8fafc] border-neutral-300' : 'bg-[#202020] border-[#2b2b2b]'
        } border-r flex flex-col justify-between py-2 text-xs shrink-0`}
      >
        <div className="space-y-0.5">
          {/* Back button (Only present in Backstage mode - Screenshot 3 & 1) */}
          {mode === 'backstage' && (
            <div className="px-3 py-2 mb-1">
              <button
                onClick={onBackToEditor}
                title="Wróć do dokumentu"
                className="w-9 h-9 rounded-full border border-neutral-600 hover:border-neutral-400 hover:bg-[#333333] active:scale-90 flex items-center justify-center text-white transition-all duration-150 cursor-pointer shadow-sm hover:-translate-x-0.5"
              >
                <ArrowLeft size={18} />
              </button>
            </div>
          )}

          {/* Word Branding on Start Screen (Screenshot 1) */}
          {mode === 'start' && (
            <div className="px-5 py-3 flex items-center gap-2 mb-2">
              <span className="text-lg font-semibold text-white tracking-wide">Word</span>
            </div>
          )}

          {/* Primary Nav Items */}
          <button
            onClick={() => setActiveNav('home')}
            className={`w-full flex items-center gap-3 px-4 py-2 transition-colors font-medium text-left cursor-pointer ${
              activeNav === 'home'
                ? 'bg-[#0078d4] text-white'
                : 'text-neutral-300 hover:bg-[#2b2b2b] hover:text-white'
            }`}
          >
            <Home size={16} />
            <span>Strona główna</span>
          </button>

          <button
            onClick={() => onSelectTemplate(TEMPLATES[0])}
            className="w-full flex items-center gap-3 px-4 py-2 text-neutral-300 hover:bg-[#2b2b2b] hover:text-white transition-colors text-left cursor-pointer"
          >
            <FileText size={16} />
            <span>Nowy</span>
          </button>

          <button
            onClick={onOpenFilePicker}
            className="w-full flex items-center gap-3 px-4 py-2 text-neutral-300 hover:bg-[#2b2b2b] hover:text-white transition-colors text-left cursor-pointer"
          >
            <FolderOpen size={16} />
            <span>Otwórz</span>
          </button>

          {/* Additional Backstage Items (Screenshot 3 & 1) */}
          {mode === 'backstage' && (
            <>
              <div className="my-2 border-t border-neutral-700/60 mx-3" />

              <button
                onClick={() => alert('Pobierz dodatki: Przeglądaj dodatki pakietu Office')}
                className="w-full flex items-center gap-3 px-4 py-2 text-neutral-400 hover:bg-[#2b2b2b] hover:text-white transition-colors text-left cursor-pointer"
              >
                <FileCode size={16} />
                <span>Pobierz dodatki</span>
              </button>

              <button
                onClick={() => setInfoOpen(true)}
                className="w-full flex items-center gap-3 px-4 py-2 text-neutral-300 hover:bg-[#2b2b2b] hover:text-white transition-colors text-left cursor-pointer"
              >
                <Info size={16} />
                <span>Informacje</span>
              </button>

              <button
                onClick={onSaveCurrentDoc}
                className="w-full flex items-center gap-3 px-4 py-2 text-neutral-300 hover:bg-[#2b2b2b] hover:text-white transition-colors text-left cursor-pointer"
              >
                <Save size={16} />
                <span>Zapisz</span>
              </button>

              <button
                onClick={onSaveAs}
                className="w-full flex items-center gap-3 px-4 py-2 text-neutral-300 hover:bg-[#2b2b2b] hover:text-white transition-colors text-left cursor-pointer"
              >
                <Download size={16} />
                <span>Zapisz jako</span>
              </button>

              <button
                onClick={() => alert('Historia wersji: Zmiany są automatycznie zapisywane w pamięci lokalnej.')}
                className="w-full flex items-center gap-3 px-4 py-2 text-neutral-500 hover:bg-[#2b2b2b]/50 transition-colors text-left cursor-not-allowed"
              >
                <Clock size={16} />
                <span>Historia</span>
              </button>

              <button
                onClick={() => setActiveNav('print')}
                className={`w-full flex items-center gap-3 px-4 py-2 transition-colors text-left cursor-pointer ${
                  activeNav === 'print'
                    ? 'bg-[#0078d4] text-white font-medium'
                    : 'text-neutral-300 hover:bg-[#2b2b2b] hover:text-white'
                }`}
              >
                <Printer size={16} />
                <span>Drukuj</span>
              </button>

              <button
                onClick={onOpenShare}
                className="w-full flex items-center gap-3 px-4 py-2 text-neutral-300 hover:bg-[#2b2b2b] hover:text-white transition-colors text-left cursor-pointer"
              >
                <Share2 size={16} />
                <span>Udostępnij</span>
              </button>

              <button
                onClick={() => setActiveNav('export')}
                className={`w-full flex items-center gap-3 px-4 py-2 transition-colors text-left cursor-pointer ${
                  activeNav === 'export'
                    ? 'bg-[#0078d4] text-white font-medium'
                    : isLight
                      ? 'text-neutral-700 hover:bg-neutral-200 hover:text-black'
                      : 'text-neutral-300 hover:bg-[#2b2b2b] hover:text-white'
                }`}
              >
                <FileCode size={16} />
                <span>Eksportuj</span>
              </button>

              <button
                onClick={onCloseDocument}
                className={`w-full flex items-center gap-3 px-4 py-2 ${
                  isLight ? 'text-neutral-700 hover:bg-neutral-200 hover:text-black' : 'text-neutral-300 hover:bg-[#2b2b2b] hover:text-white'
                } transition-colors text-left cursor-pointer`}
              >
                <XCircle size={16} />
                <span>Zamknij</span>
              </button>
            </>
          )}
        </div>


        {/* Bottom Sidebar Items (Konto, Opinia, Opcje) */}
        <div className={`space-y-0.5 border-t ${isLight ? 'border-neutral-300' : 'border-neutral-700/60'} pt-2 mx-1`}>
          <button
            onClick={onOpenAccount}
            className={`w-full flex items-center gap-3 px-3 py-1.5 ${
              isLight ? 'text-neutral-700 hover:bg-neutral-200 hover:text-black' : 'text-neutral-300 hover:bg-[#2b2b2b] hover:text-white'
            } transition-colors text-left rounded`}
          >
            <User size={15} />
            <span>Konto</span>
          </button>
          <button
            onClick={() => setFeedbackOpen(true)}
            className={`w-full flex items-center gap-3 px-3 py-1.5 ${
              isLight ? 'text-neutral-700 hover:bg-neutral-200 hover:text-black' : 'text-neutral-300 hover:bg-[#2b2b2b] hover:text-white'
            } transition-colors text-left rounded`}
          >
            <MessageSquare size={15} />
            <span>Opinia</span>
          </button>
          <button
            onClick={onOpenOptions}
            className={`w-full flex items-center gap-3 px-3 py-1.5 ${
              isLight ? 'text-neutral-700 hover:bg-neutral-200 hover:text-black' : 'text-neutral-300 hover:bg-[#2b2b2b] hover:text-white'
            } transition-colors text-left rounded`}
          >
            <Settings size={15} />
            <span>Opcje</span>
          </button>
        </div>
      </div>

      {/* MAIN CONTENT AREA: PrintView, ExportView, or Templates & Recent Hub */}
      {activeNav === 'print' ? (
        <PrintView
          docTitle={docTitle || 'Dokument1'}
          docContent={docContent || ''}
          onPrint={onPrint}
        />
      ) : activeNav === 'export' ? (
        <div
          className={`anim-backstage-in flex-1 overflow-y-auto px-12 py-8 space-y-6 ${
            isLight ? 'bg-white text-neutral-800' : 'bg-[#181818] text-neutral-200'
          }`}
        >
          <div>
            <h1 className={`text-2xl font-light ${isLight ? 'text-neutral-900' : 'text-white'}`}>
              Eksportuj
            </h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2 max-w-4xl">
            {/* PDF Export Option */}
            <div
              className={`border rounded-xl p-6 space-y-4 ${
                isLight ? 'bg-neutral-50 border-neutral-300' : 'bg-[#202020] border-neutral-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-red-600/20 text-red-500 flex items-center justify-center font-bold text-lg">
                  PDF
                </div>
                <div>
                  <h3 className={`text-base font-semibold ${isLight ? 'text-neutral-900' : 'text-white'}`}>
                    Dokument PDF / XPS
                  </h3>
                  <p className="text-xs text-neutral-400">Format dokumentu Adobe PDF (*.pdf)</p>
                </div>
              </div>
              <ul className="text-xs text-neutral-400 space-y-1.5 list-disc pl-4">
                <li>Zachowuje układ, formatowanie, czcionki i obrazy</li>
                <li>Idealny do druku i wysyłania drogą elektroniczną</li>
                <li>Zgodny ze standardem ISO 32000-1</li>
              </ul>
              <button
                onClick={onExportPdf || onPrint}
                className="w-full py-2.5 px-4 bg-[#0078d4] hover:bg-[#106ebe] active:scale-95 text-white font-medium rounded-lg text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Download size={14} />
                <span>Utwórz dokument PDF</span>
              </button>
            </div>

            {/* Word DOCX Option */}
            <div
              className={`border rounded-xl p-6 space-y-4 ${
                isLight ? 'bg-neutral-50 border-neutral-300' : 'bg-[#202020] border-neutral-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-blue-600/20 text-blue-500 flex items-center justify-center font-bold text-lg">
                  DOCX
                </div>
                <div>
                  <h3 className={`text-base font-semibold ${isLight ? 'text-neutral-900' : 'text-white'}`}>
                    Dokument programu Word
                  </h3>
                  <p className="text-xs text-neutral-400">Format Microsoft Word (*.docx)</p>
                </div>
              </div>
              <ul className="text-xs text-neutral-400 space-y-1.5 list-disc pl-4">
                <li>Domyślny format programu ArcWord</li>
                <li>Możliwość pełnej edycji w Word i LibreOffice</li>
                <li>Standard OpenXML</li>
              </ul>
              <button
                onClick={onSaveAs}
                className={`w-full py-2.5 px-4 ${
                  isLight ? 'bg-neutral-200 hover:bg-neutral-300 text-neutral-900' : 'bg-[#2b2b2b] hover:bg-[#383838] text-white'
                } active:scale-95 font-medium rounded-lg text-xs shadow-xs transition-all cursor-pointer border ${
                  isLight ? 'border-neutral-300' : 'border-neutral-600'
                } flex items-center justify-center gap-2`}
              >
                <Download size={14} />
                <span>Zapisz jako Word (.docx)</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`anim-backstage-in flex-1 overflow-y-auto px-12 py-8 space-y-8 ${
            isLight ? 'bg-[#f0f2f5]' : 'bg-[#181818]'
          }`}
        >
          {/* Top Greeting */}
          <div>
            <h1 className="text-2xl font-normal text-white">{greeting}</h1>
          </div>

          {/* TEMPLATES ROW (v Nowy) */}
          <div className="space-y-3">

          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowTemplatesSection(!showTemplatesSection)}
              className="flex items-center gap-1.5 text-xs text-neutral-300 hover:text-white font-medium"
            >
              <ChevronDown
                size={14}
                className={`transition-transform duration-150 ${
                  showTemplatesSection ? 'rotate-0' : '-rotate-90'
                }`}
              />
              <span>Nowy</span>
            </button>

            <button
              onClick={() => onSelectTemplate(TEMPLATES[0])}
              className="text-xs text-[#2b88d8] hover:text-blue-300 flex items-center gap-1 transition-colors"
            >
              <span>Więcej szablonów</span>
              <ChevronRight size={14} />
            </button>
          </div>

          {showTemplatesSection && (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 pt-1">
              {TEMPLATES.map(template => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onSelect={onSelectTemplate}
                />
              ))}
            </div>
          )}
        </div>

        {/* DIVIDER */}
        <div className="border-t border-neutral-800" />

        {/* RECENT / PINNED SECTION */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
            <div className="flex items-center space-x-6 text-xs">
              <button
                onClick={() => setActiveTab('recent')}
                className={`pb-2 relative font-medium transition-colors ${
                  activeTab === 'recent'
                    ? 'text-white font-semibold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <span>Ostatnie</span>
                {activeTab === 'recent' && (
                  <div className="absolute bottom-[-9px] left-0 right-0 h-[2px] bg-white rounded-full" />
                )}
              </button>

              <button
                onClick={() => setActiveTab('pinned')}
                className={`pb-2 relative font-medium transition-colors ${
                  activeTab === 'pinned'
                    ? 'text-white font-semibold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <span>Przypięte</span>
                {activeTab === 'pinned' && (
                  <div className="absolute bottom-[-9px] left-0 right-0 h-[2px] bg-white rounded-full" />
                )}
              </button>
            </div>

            <button
              onClick={onOpenFilePicker}
              className="text-xs text-[#2b88d8] hover:text-blue-300 flex items-center gap-1 transition-colors"
            >
              <span>Więcej dokumentów</span>
              <ChevronRight size={14} />
            </button>
          </div>

          {/* List or Empty State */}
          {filteredDocuments.length === 0 ? (
            <div className="py-12 text-center text-xs text-neutral-400 max-w-lg mx-auto">
              <p>
                Ostatnio nie zostały otwarte żadne dokumenty. Kliknij pozycję Otwórz, aby
                znaleźć element typu dokument.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-800/80">
              {filteredDocuments.map(doc => (
                <div
                  key={doc.id}
                  onClick={() => onOpenDocument(doc)}
                  className="group flex items-center justify-between py-2.5 px-3 hover:bg-[#242424] rounded cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-[#2b579a]/20 border border-[#2b579a]/40 flex items-center justify-center text-[#2b88d8]">
                      <FileText size={18} />
                    </div>
                    <div>
                      <h4 className="text-xs font-medium text-white group-hover:text-blue-400 transition-colors">
                        {doc.title}
                      </h4>
                      <p className="text-[11px] text-neutral-400">
                        {doc.updatedAt} • {doc.path || 'ArcWord > Moje dokumenty'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={e => {
                        e.stopPropagation()
                        onTogglePin(doc.id)
                      }}
                      title={doc.pinned ? 'Odepnij' : 'Przypnij do listy'}
                      className="p-1.5 hover:bg-neutral-700 rounded text-neutral-400 hover:text-white"
                    >
                      {doc.pinned ? <PinOff size={14} /> : <Pin size={14} />}
                    </button>
                    <button
                      onClick={e => {
                        e.stopPropagation()
                        onDeleteDocument(doc.id)
                      }}
                      title="Usuń z listy"
                      className="p-1.5 hover:bg-red-950/60 rounded text-neutral-400 hover:text-red-400"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )}



      {/* Info Dialog */}
      {infoOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="w-[450px] bg-[#2b2b2b] text-neutral-200 border border-neutral-700 rounded shadow-2xl p-5 space-y-4 text-xs">
            <h3 className="text-sm font-semibold text-white border-b border-neutral-700 pb-2">
              Informacje o dokumencie
            </h3>
            <div className="space-y-2 text-neutral-300">
              <p><strong>Nazwa:</strong> {currentDoc?.title || 'Dokument1'}</p>
              <p><strong>Liczba wyrazów:</strong> {currentDoc?.wordCount || 0}</p>
              <p><strong>Utworzono:</strong> {currentDoc?.createdAt || 'Dzisiaj'}</p>
              <p><strong>Ostatnia modyfikacja:</strong> {currentDoc?.updatedAt || 'Dzisiaj'}</p>
              <p><strong>Autor:</strong> Sebastian Rubaj</p>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setInfoOpen(false)}
                className="px-4 py-1.5 bg-[#0078d4] text-white rounded text-xs"
              >
                Zamknij
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Dialog */}
      {feedbackOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="w-[420px] bg-[#2b2b2b] text-neutral-200 border border-neutral-700 rounded shadow-2xl p-5 space-y-3 text-xs">
            <h3 className="text-sm font-semibold text-white">Wyślij opinię</h3>
            <p className="text-neutral-400">Twoja opinia pomaga ulepszać program ArcWord.</p>
            <textarea
              placeholder="Co Ci się podoba lub co możemy ulepszyć?..."
              rows={4}
              className="w-full bg-[#1e1e1e] border border-neutral-700 rounded p-2 text-white outline-none focus:border-[#0078d4]"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setFeedbackOpen(false)}
                className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded"
              >
                Anuluj
              </button>
              <button
                onClick={() => {
                  alert('Dziękujemy za przesłanie opinii!')
                  setFeedbackOpen(false)
                }}
                className="px-4 py-1.5 bg-[#0078d4] hover:bg-[#106ebe] text-white rounded font-medium"
              >
                Wyślij
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
