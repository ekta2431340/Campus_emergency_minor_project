import { useState } from 'react';
import { Role, User } from '../types/emergency';
import { ShieldAlert, User as UserIcon, Lock, KeyRound, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';

interface LoginPageProps {
  onLogin: (user: User) => void;
  registeredUsers: User[];
}

export function LoginPage({ onLogin, registeredUsers }: LoginPageProps) {
  const [role, setRole] = useState<Role>('student');
  const [username, setUsername] = useState<string>('student1');
  const [password, setPassword] = useState<string>('bca2026');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRoleSwitch = (selectedRole: Role) => {
    setRole(selectedRole);
    setErrorMessage(null);
    if (selectedRole === 'student') {
      setUsername('student1');
      setPassword('bca2026');
    } else {
      setUsername('admin');
      setPassword('admin123');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedUser = username.trim().toLowerCase();
    const trimmedPass = password.trim();

    if (!trimmedUser || !trimmedPass) {
      setErrorMessage('Please enter both username and password.');
      return;
    }

    // Authenticate against registered users
    const matched = registeredUsers.find(
      (u) =>
        u.role === role &&
        (u.username.toLowerCase() === trimmedUser || u.email?.toLowerCase() === trimmedUser)
    );

    if (!matched) {
      setErrorMessage(`No ${role} account found with username '${username}'.`);
      return;
    }

    // Default password checks for student ('bca2026') and admin ('admin123')
    const validPassword = role === 'admin' ? 'admin123' : 'bca2026';
    if (trimmedPass !== validPassword) {
      setErrorMessage('Invalid password. For demo: Student is "bca2026", Admin is "admin123".');
      return;
    }

    onLogin(matched);
  };

  const handleQuickDemo = (demoRole: Role) => {
    handleRoleSwitch(demoRole);
    const demoUser = registeredUsers.find((u) => u.role === demoRole);
    if (demoUser) {
      onLogin(demoUser);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 bg-slate-950">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Brand Header */}
        <div className="p-6 bg-slate-900 text-center border-b border-slate-800">
          <div className="w-12 h-12 rounded-xl bg-red-600 flex items-center justify-center text-white mx-auto mb-3 shadow-lg shadow-red-600/30">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Campus Emergency System
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            College Security Portal & Emergency Incident Reporting
          </p>
        </div>

        {/* Role Toggle Selector */}
        <div className="p-1 bg-slate-950 mx-6 mt-6 rounded-xl border border-slate-800 grid grid-cols-2 gap-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => handleRoleSwitch('student')}
            className={`py-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
              role === 'student'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span>Student Login</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleSwitch('admin')}
            className={`py-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
              role === 'admin'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Administrator</span>
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-lg bg-red-950/60 border border-red-500/50 text-red-200 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {role === 'student' ? 'Student Username / Email' : 'Admin Username / Email'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <UserIcon className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={role === 'student' ? 'e.g. student1' : 'e.g. admin'}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors font-mono"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className={`w-full py-2.5 rounded-xl text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
              role === 'student'
                ? 'bg-blue-600 hover:bg-blue-500'
                : 'bg-red-600 hover:bg-red-500'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>Sign In to {role === 'student' ? 'Student Dashboard' : 'Admin Console'}</span>
          </button>

          {/* Quick Demo Credentials Autofill for BCA Presentation */}
          <div className="pt-4 border-t border-slate-800 text-center">
            <span className="text-[11px] text-slate-500 block mb-2 font-medium">
              Demo Logins for 4 Team Members & Admin:
            </span>
            <div className="grid grid-cols-2 gap-1.5 text-xs mb-2">
              <button
                type="button"
                onClick={() => {
                  handleRoleSwitch('student');
                  const u = registeredUsers.find((user) => user.username === 'student1');
                  if (u) onLogin(u);
                }}
                className="px-2 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 text-[11px] transition-colors text-left truncate"
                title="Member 1: Musskan Verma (22005011001)"
              >
                1. <strong>Musskan</strong> (Roll: 001)
              </button>

              <button
                type="button"
                onClick={() => {
                  handleRoleSwitch('student');
                  const u = registeredUsers.find((user) => user.username === 'student2');
                  if (u) onLogin(u);
                }}
                className="px-2 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 text-[11px] transition-colors text-left truncate"
                title="Member 2: Aman Gupta (22005011002)"
              >
                2. <strong>Aman</strong> (Roll: 002)
              </button>

              <button
                type="button"
                onClick={() => {
                  handleRoleSwitch('student');
                  const u = registeredUsers.find((user) => user.username === 'student3');
                  if (u) onLogin(u);
                }}
                className="px-2 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 text-[11px] transition-colors text-left truncate"
                title="Member 3: Ananya Dixit (22005011003)"
              >
                3. <strong>Ananya</strong> (Roll: 003)
              </button>

              <button
                type="button"
                onClick={() => {
                  handleRoleSwitch('student');
                  const u = registeredUsers.find((user) => user.username === 'student4');
                  if (u) onLogin(u);
                }}
                className="px-2 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 text-[11px] transition-colors text-left truncate"
                title="Member 4: Ayush Srivastava (22005011004)"
              >
                4. <strong>Ayush</strong> (Roll: 004)
              </button>
            </div>

            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="w-full py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/50 text-red-300 border border-red-800/60 text-xs font-semibold transition-colors"
            >
              Auto-Login as <strong>Chief Administrator</strong> (admin / admin123)
            </button>
          </div>
        </form>

        {/* Footer info note */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 text-center text-[10px] text-slate-500">
          Campus Emergency System · PSIT College of Higher Education
        </div>
      </div>
    </div>
  );
}
