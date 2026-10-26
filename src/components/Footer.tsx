import { Shield } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-6 px-4 sm:px-6 lg:px-8 text-xs mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-red-600 flex items-center justify-center text-white">
            <Shield className="w-3 h-3" />
          </div>
          <span className="font-bold text-white text-sm">
            Campus Emergency System
          </span>
          <span className="text-slate-500">·</span>
          <span>BCA Final Year Project</span>
        </div>

        <div className="text-center sm:text-right text-[11px] text-slate-500 space-y-0.5">
          <p>Department of Computer Applications · PSIT-College of Higher Education</p>
          <p>Built with HTML5, CSS3, JavaScript, Python & SQLite</p>
        </div>
      </div>
    </footer>
  );
}
