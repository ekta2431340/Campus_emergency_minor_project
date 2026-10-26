import {
  Printer,
  FileDown,
  Settings,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';

interface HeaderProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  zoom: number;
  onZoomChange: (newZoom: number) => void;
  onOpenConfig: () => void;
  onPrintAll: () => void;
  onExportDoc: () => void;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export function DocumentWorkspaceHeader({
  currentPage,
  totalPages,
  onPageChange,
  zoom,
  onZoomChange,
  onOpenConfig,
  onPrintAll,
  onExportDoc,
  isSidebarOpen,
  onToggleSidebar
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white px-4 py-2 flex items-center justify-between gap-4 no-print select-none shadow-md">
      {/* Zone 1: Document File Title & Sidebar Toggle */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title={isSidebarOpen ? 'Hide Page Navigator' : 'Show Page Navigator'}
        >
          {isSidebarOpen ? (
            <PanelLeftClose className="w-4 h-4" />
          ) : (
            <PanelLeftOpen className="w-4 h-4" />
          )}
        </button>

        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-xs sm:text-sm font-semibold tracking-tight text-slate-200">
            PSIT_BCA_5005_Campus_SOS_AI_Project_Diary.pdf
          </span>
          <span className="hidden lg:inline text-[11px] text-slate-500 font-mono">
            (A4 210x297mm · 21 Pages)
          </span>
        </div>
      </div>

      {/* Zone 2: Document Navigation & Zoom Controls */}
      <div className="flex items-center gap-4 text-xs">
        {/* Page Switcher */}
        <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded border border-slate-800">
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1}
            className="p-1 text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
            title="Previous Page"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <span className="text-slate-300 font-mono text-xs px-1">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage >= totalPages}
            className="p-1 text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
            title="Next Page"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="hidden sm:flex items-center gap-1 bg-slate-950 px-2 py-1 rounded border border-slate-800">
          <button
            onClick={() => onZoomChange(Math.max(60, zoom - 10))}
            className="p-1 text-slate-400 hover:text-white"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] font-mono text-slate-300 w-10 text-center">
            {zoom}%
          </span>
          <button
            onClick={() => onZoomChange(Math.min(140, zoom + 10))}
            className="p-1 text-slate-400 hover:text-white"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Zone 3: Actions (Configure, Export, Print) */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onOpenConfig}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700"
          title="Configure Student Names, Roll Numbers Sequence, and Faculty Details"
        >
          <Settings className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden sm:inline">Edit Roll Numbers & Details</span>
          <span className="sm:hidden">Roster</span>
        </button>

        <button
          onClick={onExportDoc}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700"
          title="Export report text in Word DOC format"
        >
          <FileDown className="w-3.5 h-3.5 text-slate-400" />
          <span>Export DOC</span>
        </button>

        <button
          onClick={onPrintAll}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-xs"
          title="Print to Paper or Save as PDF"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Download / Print PDF</span>
        </button>
      </div>
    </header>
  );
}
