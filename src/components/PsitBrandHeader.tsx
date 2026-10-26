export function PsitLogo({ className = "h-14" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-end select-none ${className}`}>
      <div className="flex items-baseline font-black tracking-wider text-[#1e3a8a] text-2xl sm:text-3xl font-serif">
        <span>P</span>
        <span>S</span>
        <span>I</span>
        <span>T</span>
      </div>
      <div className="w-full h-[1.5px] bg-[#1e3a8a] my-[1px]" />
      <span className="font-serif italic text-xs text-[#1e3a8a] tracking-wider pr-1 font-semibold">
        Kanpur
      </span>
    </div>
  );
}

export function PsitBrandHeader({ showSubheader = true }: { showSubheader?: boolean }) {
  return (
    <header className="w-full pb-3 border-b-2 border-slate-900 mb-6 font-serif">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 leading-tight">
            PSIT-College of Higher Education
          </h1>
          <p className="text-xs sm:text-[13px] text-slate-700 mt-0.5 leading-snug">
            Kanpur-Delhi National Highway (NH-19), Bhauti, Kanpur-209305 (U.P.), India
          </p>
        </div>
        <div className="shrink-0 pt-0.5">
          <PsitLogo />
        </div>
      </div>
      {showSubheader && (
        <div className="flex justify-between items-center text-[11px] font-semibold text-slate-600 mt-2 pt-1 border-t border-slate-200">
          <span>Department of Computer Applications</span>
          <span>Minor Project 2026-27</span>
        </div>
      )}
    </header>
  );
}

export function PsitBrandFooter() {
  return (
    <footer className="w-full pt-3 mt-auto border-t border-slate-300 text-[11px] text-slate-600 font-serif flex justify-between items-center">
      <span>Department of Computer Applications</span>
      <span>Minor Project 2026-27</span>
    </footer>
  );
}
