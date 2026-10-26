import { useState, useEffect } from 'react';
import { User, EmergencyReport, ReportStatus } from './types/emergency';
import { INITIAL_USERS, INITIAL_REPORTS } from './data/defaultData';
import { Navbar } from './components/Navbar';
import { LoginPage } from './components/LoginPage';
import { StudentDashboard } from './components/StudentDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { VivaCodeViewerModal } from './components/VivaCodeViewerModal';
import { Footer } from './components/Footer';

const STORAGE_KEY_REPORTS = 'campus_emergency_system_reports';
const STORAGE_KEY_USER = 'campus_emergency_system_active_user';

export default function App() {
  // Authentication State
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem(STORAGE_KEY_USER);
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  // Emergency Reports State with LocalStorage Persistence
  const [reports, setReports] = useState<EmergencyReport[]>(() => {
    try {
      const savedReports = localStorage.getItem(STORAGE_KEY_REPORTS);
      return savedReports ? JSON.parse(savedReports) : INITIAL_REPORTS;
    } catch {
      return INITIAL_REPORTS;
    }
  });

  // Viva Reference Modal State
  const [isVivaModalOpen, setIsVivaModalOpen] = useState(false);

  // Sync reports to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(reports));
    } catch (e) {
      console.error('Failed to save reports to localStorage:', e);
    }
  }, [reports]);

  // Sync user session to localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEY_USER);
      }
    } catch (e) {
      console.error('Failed to sync user session:', e);
    }
  }, [currentUser]);

  // Handle Login
  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  // Handle Logout
  const handleLogout = () => {
    setCurrentUser(null);
  };

  // Handle New Emergency Report Submission by Student
  const handleAddReport = (newReport: EmergencyReport) => {
    setReports((prev) => [newReport, ...prev]);
  };

  // Handle Report Status & Action Notes Update by Administrator
  const handleUpdateStatus = (id: string, newStatus: ReportStatus, adminNotes: string) => {
    setReports((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: newStatus,
              adminNotes,
              updatedAt: new Date().toLocaleString([], {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })
            }
          : r
      )
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-text">
      {/* Top Navigation Bar */}
      <Navbar
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenVivaModal={() => setIsVivaModalOpen(true)}
      />

      {/* Main Workspace Stage */}
      <main className="flex-1 flex flex-col">
        {!currentUser ? (
          /* Login Page Appears First */
          <LoginPage onLogin={handleLogin} registeredUsers={INITIAL_USERS} />
        ) : currentUser.role === 'student' ? (
          /* Student Dashboard */
          <div className="max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex-1">
            <StudentDashboard
              user={currentUser}
              reports={reports}
              onSubmitReport={handleAddReport}
            />
          </div>
        ) : (
          /* Administrator Dashboard */
          <div className="max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex-1">
            <AdminDashboard
              adminUser={currentUser}
              reports={reports}
              onUpdateStatus={handleUpdateStatus}
            />
          </div>
        )}
      </main>

      {/* College Viva Reference Dialog */}
      <VivaCodeViewerModal
        isOpen={isVivaModalOpen}
        onClose={() => setIsVivaModalOpen(false)}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
