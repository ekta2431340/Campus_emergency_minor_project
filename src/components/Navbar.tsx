import { User } from '../types/emergency';
import { ShieldAlert, LogOut, User as UserIcon, Code, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  currentUser: User | null;
  onLogout: () => void;
  onOpenVivaModal: () => void;
}

export function Navbar({ currentUser, onLogout, onOpenVivaModal }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Project Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-red-600 flex items-center justify-center text-white shadow-sm shadow-red-600/30">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-bold tracking-tight text-white">
                Campus Emergency System
              </span>
              <span className="hidden sm:inline-block text-[10px] font-mono uppercase bg-slate-800 border border-slate-700 text-slate-300 px-1.5 py-0.5 rounded font-semibold">
                BCA Final Year Project
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Institutional Incident Response & Priority Dispatch Platform
            </p>
          </div>
        </div>

        {/* User Status & Actions */}
        {currentUser ? (
          <div className="flex items-center gap-3">
            {/* Viva Logic Viewer Button */}
            <button
              onClick={onOpenVivaModal}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
              title="View Python keyword classifier and SQLite schema"
            >
              <Code className="w-3.5 h-3.5 text-blue-400" />
              <span>Python Classifier Viva Logic</span>
            </button>

            {/* User Badge */}
            <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700 px-3 py-1.5 rounded-lg text-xs">
              {currentUser.role === 'admin' ? (
                <ShieldCheck className="w-4 h-4 text-amber-400" />
              ) : (
                <UserIcon className="w-4 h-4 text-blue-400" />
              )}
              <div className="text-left">
                <span className="font-semibold text-white block leading-tight">
                  {currentUser.fullName}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {currentUser.role === 'admin' ? 'Administrator' : `Roll: ${currentUser.rollNo || currentUser.username}`}
                </span>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-300 hover:text-white bg-red-950/40 hover:bg-red-700 border border-red-800/60 transition-colors shadow-xs"
              title="Logout from Campus Emergency System"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <span>Authentication Portal</span>
          </div>
        )}
      </div>
    </header>
  );
}
