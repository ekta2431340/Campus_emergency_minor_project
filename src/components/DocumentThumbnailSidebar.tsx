import { FileText } from 'lucide-react';

interface ThumbnailSidebarProps {
  currentPage: number;
  onSelectPage: (page: number) => void;
  isOpen: boolean;
}

export function DocumentThumbnailSidebar({
  currentPage,
  onSelectPage,
  isOpen
}: ThumbnailSidebarProps) {
  if (!isOpen) return null;

  const pageIndex = [
    { page: 1, title: 'Cover Page (PSIT)' },
    { page: 2, title: 'Vision, Mission & PEOs' },
    { page: 3, title: 'Program Outcomes (PO2-10)' },
    { page: 4, title: 'CO-PO Mapping Matrix' },
    { page: 5, title: 'Submission Title Page' },
    { page: 6, title: 'Candidate Declaration' },
    { page: 7, title: 'Supervisor Certificate' },
    { page: 8, title: 'Project Abstract' },
    { page: 9, title: 'Project Synopsis' },
    { page: 10, title: 'Semester Schedule' },
    { page: 11, title: 'Week 1 Progress Diary' },
    { page: 12, title: 'Week 2 Progress Diary' },
    { page: 13, title: 'Week 3 Progress Diary' },
    { page: 14, title: 'Week 4 Progress Diary' },
    { page: 15, title: 'Week 5 Progress Diary' },
    { page: 16, title: 'Week 6 Progress Diary' },
    { page: 17, title: 'Week 7 Progress Diary' },
    { page: 18, title: 'Week 8 Progress Diary' },
    { page: 19, title: 'Week 9 Progress Diary' },
    { page: 20, title: 'Week 10 Progress Diary' },
    { page: 21, title: 'Supervisor Final Evaluation' },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col shrink-0 no-print select-none h-[calc(100vh-53px)] sticky top-[53px]">
      <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-400">
        <span>DOCUMENT PAGES</span>
        <span className="font-mono text-[11px] text-slate-500">21 Pages</span>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {pageIndex.map((item) => {
          const isActive = currentPage === item.page;
          return (
            <button
              key={item.page}
              onClick={() => onSelectPage(item.page)}
              className={`w-full text-left px-2.5 py-2 rounded-md text-xs flex items-center gap-2.5 transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white font-medium shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/70'
              }`}
            >
              <span className={`w-5 text-right font-mono text-[11px] ${isActive ? 'text-blue-200' : 'text-slate-600'}`}>
                {item.page}
              </span>
              <FileText className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
              <span className="truncate">{item.title}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
