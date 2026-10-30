import { useCallback, useEffect, useState } from 'react';
import type { Session, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types/database';
import { User, EmergencyReport, ReportStatus } from './types/emergency';
import { Navbar } from './components/Navbar';
import { LoginPage, SignUpDetails, SignUpResult } from './components/LoginPage';
import { StudentDashboard } from './components/StudentDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { VivaCodeViewerModal } from './components/VivaCodeViewerModal';
import { Footer } from './components/Footer';
import { supabase } from './lib/supabase';
import { DEMO_REPORTS, DEMO_USERS } from './data/demoData';
import {
  createReport as createFlaskReport,
  getCurrentUser as getFlaskCurrentUser,
  getReports as getFlaskReports,
  registerAdmin as registerFlaskAdmin,
  registerAdminWithInvite as registerFlaskAdminWithInvite,
  signIn as signInWithFlask,
  signOut as signOutFromFlask,
  signUp as signUpWithFlask,
  updateReport as updateFlaskReport
} from './lib/flaskApi';

const useFlaskApi = import.meta.env.VITE_API_MODE === 'flask';
const STORAGE_KEY_REPORTS = 'campus_emergency_system_reports';
const STORAGE_KEY_USER = 'campus_emergency_system_active_user';
const DEMO_STUDENT_PASSWORD = 'bca2026';
const DEMO_ADMIN_PASSWORD = 'admin123';

function readDemoStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) as T : fallback;
  } catch (error) {
    console.error(`Could not read demo data from local storage (${key}).`, error);
    return fallback;
  }
}

function formatDate(value: string) {
  return new Date(value).toLocaleString([], {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function mapReport(row: Database['public']['Tables']['emergency_reports']['Row']): EmergencyReport {
  return {
    id: row.id,
    studentUsername: row.student_username,
    studentName: row.student_name,
    rollNo: row.roll_no ?? undefined,
    category: row.category,
    location: row.location,
    description: row.description,
    priority: row.priority,
    status: row.status,
    matchedKeywords: row.matched_keywords,
    classificationReason: row.classification_reason,
    adminNotes: row.admin_notes ?? undefined,
    submittedAt: formatDate(row.submitted_at),
    updatedAt: formatDate(row.updated_at)
  };
}

async function loadProfile(client: SupabaseClient<Database>, session: Session): Promise<User> {
  const { data, error } = await client
    .from('profiles')
    .select('id, username, role, full_name, roll_no, department, phone, email')
    .eq('id', session.user.id)
    .single();

  if (error) {
    throw new Error(`Could not load your account profile: ${error.message}`);
  }

  return {
    id: data.id,
    username: data.username,
    role: data.role,
    fullName: data.full_name,
    rollNo: data.roll_no ?? undefined,
    department: data.department ?? undefined,
    phone: data.phone ?? undefined,
    email: data.email ?? undefined
  };
}

async function loadReports(client: SupabaseClient<Database>): Promise<EmergencyReport[]> {
  const { data, error } = await client
    .from('emergency_reports')
    .select()
    .order('submitted_at', { ascending: false });

  if (error) {
    throw new Error(`Could not load emergency reports: ${error.message}`);
  }

  return data.map(mapReport);
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(() =>
    supabase || useFlaskApi ? null : readDemoStorage<User | null>(STORAGE_KEY_USER, null)
  );
  const [reports, setReports] = useState<EmergencyReport[]>(() =>
    supabase || useFlaskApi ? [] : readDemoStorage(STORAGE_KEY_REPORTS, DEMO_REPORTS)
  );
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isVivaModalOpen, setIsVivaModalOpen] = useState(false);

  useEffect(() => {
    if (supabase || useFlaskApi) return;

    try {
      localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(reports));
    } catch (error) {
      console.error('Could not save demo reports to local storage.', error);
    }
  }, [reports]);

  useEffect(() => {
    if (supabase || useFlaskApi) return;

    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEY_USER);
      }
    } catch (error) {
      console.error('Could not save demo user session to local storage.', error);
    }
  }, [currentUser]);

  const refreshReports = useCallback(async () => {
    if (useFlaskApi) {
      setReports(await getFlaskReports());
      return;
    }
    if (!supabase) return;
    setReports(await loadReports(supabase));
  }, []);

  useEffect(() => {
    const client = supabase;
    if (useFlaskApi) {
      let isActive = true;
      const initializeFlaskSession = async () => {
        const user = await getFlaskCurrentUser();
        if (!isActive || !user) return;
        const savedReports = await getFlaskReports();
        if (isActive) {
          setCurrentUser(user);
          setReports(savedReports);
        }
      };

      void initializeFlaskSession()
        .catch((error: unknown) => {
          if (isActive) {
            setErrorMessage(error instanceof Error ? error.message : 'Could not connect to the Flask API.');
          }
        })
        .finally(() => {
          if (isActive) setIsLoading(false);
        });

      return () => {
        isActive = false;
      };
    }

    if (!client) {
      setIsLoading(false);
      return;
    }

    let isActive = true;
    const initialize = async () => {
      const { data, error } = await client.auth.getSession();
      if (error) throw new Error(`Could not restore your session: ${error.message}`);
      if (!data.session) return;

      const [user, savedReports] = await Promise.all([
        loadProfile(client, data.session),
        loadReports(client)
      ]);
      if (isActive) {
        setCurrentUser(user);
        setReports(savedReports);
      }
    };

    void initialize()
      .catch(async (error: unknown) => {
        if (isActive) {
          const message = error instanceof Error ? error.message : 'Could not initialize the app.';
          const { error: signOutError } = await client.auth.signOut();
          setErrorMessage(
            signOutError
              ? `${message} Could not clear the invalid session: ${signOutError.message}`
              : message
          );
        }
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    const { data: authListener } = client.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        setCurrentUser(null);
        setReports([]);
      }
    });

    return () => {
      isActive = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const client = supabase;
    if (useFlaskApi || !client || !currentUser) return;

    const channel = client
      .channel('emergency-reports')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'emergency_reports' },
        () => {
          void refreshReports().catch((error: unknown) => {
            setErrorMessage(error instanceof Error ? error.message : 'Could not refresh reports.');
          });
        }
      )
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          setErrorMessage('Live report updates are unavailable. Refresh the page to check for updates.');
        }
      });

    return () => {
      void client.removeChannel(channel);
    };
  }, [currentUser, refreshReports]);

  const handleLogin = async (email: string, password: string, role: User['role']): Promise<void> => {
    if (useFlaskApi) {
      const user = await signInWithFlask(email, password, role);
      const savedReports = await getFlaskReports();
      setCurrentUser(user);
      setReports(savedReports);
      setErrorMessage(null);
      return;
    }

    if (!supabase) {
      const user = DEMO_USERS.find(
        (candidate) => candidate.role === role && candidate.email?.toLowerCase() === email.toLowerCase()
      );
      const expectedPassword = role === 'admin' ? DEMO_ADMIN_PASSWORD : DEMO_STUDENT_PASSWORD;
      if (!user || password !== expectedPassword) {
        throw new Error('Invalid demo email or password. See README.md for demo account credentials.');
      }
      setCurrentUser(user);
      setErrorMessage(null);
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
    if (!data.session) throw new Error('Sign in did not create a session.');

    let user: User;
    let savedReports: EmergencyReport[];
    try {
      [user, savedReports] = await Promise.all([
        loadProfile(supabase, data.session),
        loadReports(supabase)
      ]);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not load your account.';
      const { error: signOutError } = await supabase.auth.signOut();
      throw new Error(
        signOutError ? `${message} Could not clear the session: ${signOutError.message}` : message
      );
    }

    if (user.role !== role) {
      const { error: signOutError } = await supabase.auth.signOut();
      throw new Error(
        signOutError
          ? `This account does not have the ${role} role. Sign out failed: ${signOutError.message}`
          : `This account does not have the ${role} role.`
      );
    }
    setCurrentUser(user);
    setReports(savedReports);
    setErrorMessage(null);
  };

  const handleSignUp = async (
    email: string,
    password: string,
    details: SignUpDetails
  ): Promise<SignUpResult> => {
    if (useFlaskApi) {
      const { user } = await signUpWithFlask(email, password, details);
      const savedReports = await getFlaskReports();
      setCurrentUser(user);
      setReports(savedReports);
      setErrorMessage(null);
      return {};
    }

    if (!supabase) {
      throw new Error('Account registration needs a backend. Use one of the demo accounts listed in README.md.');
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: details.username,
          full_name: details.fullName,
          roll_no: details.rollNo,
          department: details.department,
          phone: details.phone
        }
      }
    });
    if (error) throw new Error(error.message);

    if (data.session) {
      try {
        const [user, savedReports] = await Promise.all([
          loadProfile(supabase, data.session),
          loadReports(supabase)
        ]);
        setCurrentUser(user);
        setReports(savedReports);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Could not load the new account.';
        const { error: signOutError } = await supabase.auth.signOut();
        throw new Error(
          signOutError ? `${message} Could not clear the session: ${signOutError.message}` : message
        );
      }
    }

    return { confirmationRequired: !data.session };
  };

  const handleRegisterAdmin = async (details: {
    email: string;
    password: string;
    username: string;
    fullName: string;
    department: string;
    phone: string;
  }) => {
    if (!useFlaskApi) {
      throw new Error('Admin registration is only available with the Flask API.');
    }
    await registerFlaskAdmin(details);
  };

  const handleAdminSignUp = async (details: {
    email: string;
    password: string;
    username: string;
    fullName: string;
    department: string;
    phone: string;
    inviteCode: string;
  }) => {
    if (!useFlaskApi) {
      throw new Error('Admin registration requires the configured Flask backend.');
    }
    await registerFlaskAdminWithInvite(details);
  };

  const handleLogout = async () => {
    if (useFlaskApi) {
      try {
        await signOutFromFlask();
        setCurrentUser(null);
        setReports([]);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : 'Could not sign out.');
      }
      return;
    }

    if (!supabase) {
      setCurrentUser(null);
      return;
    }
    const { error } = await supabase.auth.signOut();
    if (error) {
      setErrorMessage(`Could not sign out: ${error.message}`);
      return;
    }
    setCurrentUser(null);
    setReports([]);
  };

  const handleAddReport = async (report: EmergencyReport) => {
    if (!currentUser) throw new Error('Your session has expired. Sign in again.');
    if (useFlaskApi) {
      const savedReport = await createFlaskReport(report);
      setReports((previous) => [savedReport, ...previous]);
      return;
    }

    if (!supabase) {
      setReports((previous) => [report, ...previous]);
      return;
    }

    const { data, error } = await supabase
      .from('emergency_reports')
      .insert({
        id: report.id,
        user_id: currentUser.id,
        student_username: currentUser.username,
        student_name: currentUser.fullName,
        roll_no: currentUser.rollNo ?? null,
        category: report.category,
        location: report.location,
        description: report.description,
        priority: report.priority,
        status: 'Submitted',
        matched_keywords: report.matchedKeywords,
        classification_reason: report.classificationReason
      })
      .select()
      .single();

    if (error) throw new Error(`Could not submit the report: ${error.message}`);
    setReports((previous) => [mapReport(data), ...previous]);
  };

  const handleUpdateStatus = async (
    id: string,
    status: ReportStatus,
    adminNotes: string
  ) => {
    if (useFlaskApi) {
      const updatedReport = await updateFlaskReport(id, status, adminNotes);
      setReports((previous) => previous.map((report) => report.id === id ? updatedReport : report));
      return;
    }

    if (!supabase) {
      setReports((previous) => previous.map((report) => report.id === id
        ? {
            ...report,
            status,
            adminNotes,
            updatedAt: new Date().toLocaleString([], {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })
          }
        : report));
      return;
    }

    const { data, error } = await supabase
      .from('emergency_reports')
      .update({ status, admin_notes: adminNotes })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(`Could not update the report: ${error.message}`);
    const updatedReport = mapReport(data);
    setReports((previous) => previous.map((report) => report.id === id ? updatedReport : report));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-text">
      <Navbar
        currentUser={currentUser}
        onLogout={() => { void handleLogout(); }}
        onOpenVivaModal={() => setIsVivaModalOpen(true)}
      />

      <main className="flex-1 flex flex-col">
        {errorMessage && (supabase || useFlaskApi) && (
          <div role="alert" className="max-w-7xl w-full mx-auto mt-4 px-4 sm:px-6 lg:px-8">
            <div className="rounded-xl border border-amber-700 bg-amber-950/50 px-4 py-3 text-sm text-amber-100">
              {errorMessage}
            </div>
          </div>
        )}
        {isLoading ? (
          <div className="flex-1 grid place-items-center text-slate-300">Connecting to Campus Emergency System…</div>
        ) : !currentUser ? (
          <LoginPage
            onLogin={handleLogin}
            onSignUp={handleSignUp}
            onAdminSignUp={useFlaskApi ? handleAdminSignUp : undefined}
          />
        ) : (
          <div className="max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex-1">
            {currentUser.role === 'student' ? (
              <StudentDashboard
                user={currentUser}
                reports={reports}
                onSubmitReport={handleAddReport}
              />
            ) : (
              <AdminDashboard
                adminUser={currentUser}
                reports={reports}
                onUpdateStatus={handleUpdateStatus}
                onRegisterAdmin={useFlaskApi ? handleRegisterAdmin : undefined}
              />
            )}
          </div>
        )}
      </main>

      <VivaCodeViewerModal
        isOpen={isVivaModalOpen}
        onClose={() => setIsVivaModalOpen(false)}
      />
      <Footer />
    </div>
  );
}
