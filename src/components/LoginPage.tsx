import { useState } from 'react';
import { Role } from '../types/emergency';
import { AlertCircle, CheckCircle2, KeyRound, Lock, ShieldAlert, ShieldCheck, User as UserIcon } from 'lucide-react';

export interface SignUpDetails {
  username: string;
  fullName: string;
  rollNo: string;
  department: string;
}

interface LoginPageProps {
  onLogin: (email: string, password: string, role: Role) => Promise<void>;
  onSignUp: (email: string, password: string, details: SignUpDetails) => Promise<boolean>;
}

export function LoginPage({ onLogin, onSignUp }: LoginPageProps) {
  const [role, setRole] = useState<Role>('student');
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [department, setDepartment] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectRole = (selectedRole: Role) => {
    setRole(selectedRole);
    setIsRegistering(false);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      if (isRegistering) {
        const confirmationRequired = await onSignUp(email.trim(), password, {
          username: username.trim(),
          fullName: fullName.trim(),
          rollNo: rollNo.trim(),
          department: department.trim()
        });
        setSuccessMessage(
          confirmationRequired
            ? 'Account created. Check your email to confirm your address, then sign in.'
            : 'Account created successfully.'
        );
        setIsRegistering(false);
      } else {
        await onLogin(email.trim(), password, role);
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Authentication failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 bg-slate-950">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-6 bg-slate-900 text-center border-b border-slate-800">
          <div className="w-12 h-12 rounded-xl bg-red-600 flex items-center justify-center text-white mx-auto mb-3 shadow-lg shadow-red-600/30">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">Campus Emergency System</h1>
          <p className="text-xs text-slate-400 mt-1">
            College Security Portal &amp; Emergency Incident Reporting
          </p>
        </div>

        <div className="p-1 bg-slate-950 mx-6 mt-6 rounded-xl border border-slate-800 grid grid-cols-2 gap-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => selectRole('student')}
            className={`py-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
              role === 'student' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span>Student Login</span>
          </button>
          <button
            type="button"
            onClick={() => selectRole('admin')}
            className={`py-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
              role === 'admin' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Administrator</span>
          </button>
        </div>

        <form onSubmit={(event) => { void handleSubmit(event); }} className="p-6 space-y-4">
          {errorMessage && (
            <div role="alert" className="p-3 rounded-lg bg-red-950/60 border border-red-500/50 text-red-200 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}
          {successMessage && (
            <div role="status" className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 text-xs flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {isRegistering && (
            <>
              <label className="block text-xs font-semibold text-slate-300">
                Full name
                <input
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  autoComplete="name"
                  required
                  className="mt-1.5 w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white"
                />
              </label>
              <label className="block text-xs font-semibold text-slate-300">
                Username
                <input
                  value={username}
                  onChange={(event) => setUsername(event.target.value.toLowerCase())}
                  autoComplete="username"
                  minLength={3}
                  maxLength={32}
                  pattern="[a-z0-9_.-]+"
                  required
                  className="mt-1.5 w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white"
                />
              </label>
              <label className="block text-xs font-semibold text-slate-300">
                Roll number
                <input
                  value={rollNo}
                  onChange={(event) => setRollNo(event.target.value)}
                  required
                  className="mt-1.5 w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white"
                />
              </label>
              <label className="block text-xs font-semibold text-slate-300">
                Department
                <input
                  value={department}
                  onChange={(event) => setDepartment(event.target.value)}
                  required
                  className="mt-1.5 w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white"
                />
              </label>
            </>
          )}

          <label className="block text-xs font-semibold text-slate-300">
            Email address
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
              className="mt-1.5 w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="you@campus.edu"
            />
          </label>

          <label className="block text-xs font-semibold text-slate-300">
            Password
            <div className="relative mt-1.5">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete={isRegistering ? 'new-password' : 'current-password'}
                minLength={isRegistering ? 8 : undefined}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                placeholder={isRegistering ? 'At least 8 characters' : 'Enter your password'}
              />
            </div>
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2.5 rounded-xl text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-60 ${
              role === 'student' ? 'bg-blue-600 hover:bg-blue-500' : 'bg-red-600 hover:bg-red-500'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>
              {isSubmitting ? 'Please wait…' : isRegistering ? 'Create Student Account' : 'Sign In'}
            </span>
          </button>

          {role === 'student' && (
            <button
              type="button"
              onClick={() => {
                setIsRegistering((registering) => !registering);
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className="w-full text-xs text-blue-300 hover:text-white"
            >
              {isRegistering ? 'Already registered? Sign in' : 'New student? Create an account'}
            </button>
          )}
        </form>

        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 text-center text-[10px] text-slate-500">
          Campus Emergency System · PSIT College of Higher Education
        </div>
      </div>
    </div>
  );
}
