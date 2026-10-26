import { Printer, Download, Eye, Users, FileText, Radio } from 'lucide-react';

export function TopNav({
  activeView,
  onViewChange,
  onPrintAll,
  onPrintCurrent,
  currentPage,
  onPageSelect
}: {
  activeView: 'diary' | 'roster' | 'simulator' | 'synopsis';
  onViewChange: (view: 'diary' | 'roster' | 'simulator' | 'synopsis') => void;
  onPrintAll: () => void;
  onPrintCurrent: () => void;
  currentPage: number;
  onPageSelect: (page: number) => void;
}) {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 no-print">
      {/* Strict 3-Zone Top Bar Contract */}
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3">
        {/* Zone 1: Brand wordmark */}
        <div className="flex items-center gap-2 shrink-0">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onViewChange('diary');
            }}
            className="text-base sm:text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 flex items-center gap-2"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />
            <span>Campus SOS AI</span>
            <span className="text-xs font-normal text-slate-500 font-sans hidden sm:inline">
              · Minor Project (BCA 5005)
            </span>
          </a>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-medium text-slate-600">
          <button
            onClick={() => onViewChange('diary')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeView === 'diary'
                ? 'text-blue-700 font-semibold border-b-2 border-blue-700 pb-0.5'
                : 'hover:text-slate-900'
            }`}
          >
            Project Diary (21 Pages)
          </button>

          <button
            onClick={() => onViewChange('roster')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeView === 'roster'
                ? 'text-blue-700 font-semibold border-b-2 border-blue-700 pb-0.5'
                : 'hover:text-slate-900'
            }`}
          >
            Edit Roster & Roll Nos
          </button>

          <button
            onClick={() => onViewChange('simulator')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeView === 'simulator'
                ? 'text-blue-700 font-semibold border-b-2 border-blue-700 pb-0.5'
                : 'hover:text-slate-900'
            }`}
          >
            Live SOS Simulator
          </button>

          <button
            onClick={() => onViewChange('synopsis')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeView === 'synopsis'
                ? 'text-blue-700 font-semibold border-b-2 border-blue-700 pb-0.5'
                : 'hover:text-slate-900'
            }`}
          >
            Project Synopsis
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onPrintAll}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Secondary Control Bar for Page Navigation */}
      {activeView === 'diary' && (
        <div className="bg-slate-50 border-t border-slate-200/80 px-4 sm:px-6 py-2">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">Jump to Page:</span>
              <select
                value={currentPage}
                onChange={(e) => onPageSelect(Number(e.target.value))}
                className="bg-white border border-slate-300 rounded px-2.5 py-1 text-slate-900 font-medium focus:outline-none focus:ring-1 focus:ring-blue-600"
              >
                <option value={1}>Page 1: Cover Page (PSIT)</option>
                <option value={2}>Page 2: Vision, Mission & PEOs</option>
                <option value={3}>Page 3: Program Outcomes (PO2-10)</option>
                <option value={4}>Page 4: PO11-12 & CO-PO Mapping</option>
                <option value={5}>Page 5: Formal Submission Title Page</option>
                <option value={6}>Page 6: Candidate Declaration</option>
                <option value={7}>Page 7: Certificate of Originality</option>
                <option value={8}>Page 8: Project Abstract</option>
                <option value={9}>Page 9: Project Synopsis</option>
                <option value={10}>Page 10: Semester Schedule & Timeline</option>
                <option value={11}>Page 11: Week 1 Progress Diary</option>
                <option value={12}>Page 12: Week 2 Progress Diary</option>
                <option value={13}>Page 13: Week 3 Progress Diary</option>
                <option value={14}>Page 14: Week 4 Progress Diary</option>
                <option value={15}>Page 15: Week 5 Progress Diary</option>
                <option value={16}>Page 16: Week 6 Progress Diary</option>
                <option value={17}>Page 17: Week 7 Progress Diary</option>
                <option value={18}>Page 18: Week 8 Progress Diary</option>
                <option value={19}>Page 19: Week 9 Progress Diary</option>
                <option value={20}>Page 20: Week 10 Progress Diary</option>
                <option value={21}>Page 21: Supervisor Final Evaluation</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onPrintCurrent}
                className="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded text-xs font-medium transition-colors"
                title="Print only the selected page"
              >
                <Printer className="w-3 h-3" />
                <span>Print Page #{currentPage} Only</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
