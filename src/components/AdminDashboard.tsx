import { useState } from 'react';
import { User, EmergencyReport, ReportStatus, EmergencyCategory, ReportPriority } from '../types/emergency';
import {
  ShieldAlert,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  MapPin,
  X,
  Edit,
  Eye,
  FileCheck,
  UserPlus
} from 'lucide-react';

interface AdminRegistrationDetails {
  email: string;
  password: string;
  username: string;
  fullName: string;
  department: string;
  phone: string;
}

interface AdminDashboardProps {
  adminUser: User;
  reports: EmergencyReport[];
  onUpdateStatus: (id: string, newStatus: ReportStatus, adminNotes: string) => Promise<void>;
  onRegisterAdmin?: (details: AdminRegistrationDetails) => Promise<void>;
}

export function AdminDashboard({
  adminUser,
  reports,
  onUpdateStatus,
  onRegisterAdmin
}: AdminDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Modal for viewing and updating report status
  const [selectedReport, setSelectedReport] = useState<EmergencyReport | null>(null);
  const [newStatus, setNewStatus] = useState<ReportStatus>('In Progress');
  const [adminNotes, setAdminNotes] = useState<string>('');
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isAdminRegistrationOpen, setIsAdminRegistrationOpen] = useState(false);
  const [adminRegistrationError, setAdminRegistrationError] = useState<string | null>(null);
  const [adminRegistrationSuccess, setAdminRegistrationSuccess] = useState(false);
  const [isRegisteringAdmin, setIsRegisteringAdmin] = useState(false);

  // Metrics
  const totalReports = reports.length;
  const pendingReports = reports.filter((r) => r.status === 'Submitted').length;
  const inProgressReports = reports.filter((r) => r.status === 'In Progress').length;
  const resolvedReports = reports.filter((r) => r.status === 'Resolved').length;

  // Filtered reports
  const filteredReports = reports.filter((r) => {
    const matchesSearch =
      r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.rollNo && r.rollNo.toLowerCase().includes(searchTerm.toLowerCase())) ||
      r.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === 'All' || r.category === categoryFilter;
    const matchesPriority = priorityFilter === 'All' || r.priority === priorityFilter;
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;

    return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
  });

  const handleOpenEdit = (report: EmergencyReport) => {
    setSelectedReport(report);
    setNewStatus(report.status);
    setAdminNotes(report.adminNotes || '');
  };

  const handleSaveStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReport) return;
    setIsUpdating(true);
    setUpdateError(null);
    try {
      await onUpdateStatus(selectedReport.id, newStatus, adminNotes.trim());
      setSelectedReport(null);
    } catch (error) {
      setUpdateError(error instanceof Error ? error.message : 'Could not update the report.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRegisterAdmin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!onRegisterAdmin) return;

    const formData = new FormData(event.currentTarget);
    setAdminRegistrationError(null);
    setIsRegisteringAdmin(true);
    try {
      await onRegisterAdmin({
        fullName: String(formData.get('fullName') ?? '').trim(),
        username: String(formData.get('username') ?? '').trim().toLowerCase(),
        email: String(formData.get('email') ?? '').trim(),
        department: String(formData.get('department') ?? '').trim(),
        phone: String(formData.get('phone') ?? '').trim(),
        password: String(formData.get('password') ?? '')
      });
      setAdminRegistrationSuccess(true);
      setIsAdminRegistrationOpen(false);
    } catch (error) {
      setAdminRegistrationError(
        error instanceof Error ? error.message : 'Could not register the administrator.'
      );
    } finally {
      setIsRegisteringAdmin(false);
    }
  };

  return (
    <div className="space-y-6">
      {adminRegistrationSuccess && (
        <div role="status" className="rounded-xl border border-emerald-700 bg-emerald-950/50 px-4 py-3 text-sm text-emerald-100">
          Admin account created. The new administrator can now sign in.
        </div>
      )}
      {/* Admin Title & Security Notice */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-semibold text-red-400 uppercase tracking-wider font-mono">
              Central Security Dispatch Console
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Campus Emergency System — Admin Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Logged in as: <strong className="text-white">{adminUser.fullName}</strong> ({adminUser.department || 'Proctor Office'})
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setAdminRegistrationError(null);
            setAdminRegistrationSuccess(false);
            setIsAdminRegistrationOpen(true);
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-red-500"
        >
          <UserPlus className="h-4 w-4" />
          Register New Admin
        </button>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
              Total Reports
            </span>
            <div className="p-2 rounded-lg bg-slate-800 text-slate-300">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black font-mono text-white mt-2">
            {totalReports}
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">
            All submitted incidents recorded
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
              Pending Reports
            </span>
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black font-mono text-amber-400 mt-2">
            {pendingReports}
          </p>
          <span className="text-[11px] text-amber-300/80 mt-1 block">
            Awaiting security assignment
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
              Reports In Progress
            </span>
            <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black font-mono text-blue-400 mt-2">
            {inProgressReports}
          </p>
          <span className="text-[11px] text-blue-300/80 mt-1 block">
            Security patrols en route / attending
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
              Resolved Reports
            </span>
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black font-mono text-emerald-400 mt-2">
            {resolvedReports}
          </p>
          <span className="text-[11px] text-emerald-300/80 mt-1 block">
            Successfully closed incidents
          </span>
        </div>
      </div>

      {/* Search & Filters Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
          {/* Search Field */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Report ID, Student Name, Roll No, Location, Keywords..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-300 rounded-xl px-2.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="All">All Categories</option>
              <option value="Medical Emergency">Medical Emergency</option>
              <option value="Fire">Fire</option>
              <option value="Security Issue">Security Issue</option>
              <option value="Accident">Accident</option>
              <option value="Other">Other</option>
            </select>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-300 rounded-xl px-2.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="All">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-300 rounded-xl px-2.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="All">All Statuses</option>
              <option value="Submitted">Submitted (Pending)</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports Table & Management Layout */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <span className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Emergency Incident Records ({filteredReports.length})
          </span>
          <span className="text-xs text-slate-400">
            Click "Update Status" to advance report lifecycle
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4 w-28">Report ID</th>
                <th className="py-3 px-4 w-44">Student / Roll No</th>
                <th className="py-3 px-4 w-36">Category</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4 w-24">Priority</th>
                <th className="py-3 px-4 w-32">Status</th>
                <th className="py-3 px-4 w-36">Submitted At</th>
                <th className="py-3 px-4 w-24 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    No emergency reports found matching the selected search and filters.
                  </td>
                </tr>
              ) : (
                filteredReports.map((report) => {
                  const isUrgent = report.priority === 'High' && report.status !== 'Resolved';
                  return (
                    <tr
                      key={report.id}
                      className={`hover:bg-slate-800/50 transition-colors ${
                        isUrgent ? 'bg-red-950/20' : ''
                      }`}
                    >
                      {/* ID */}
                      <td className="py-3 px-4 font-mono font-bold text-blue-300">
                        {report.id}
                      </td>

                      {/* Student */}
                      <td className="py-3 px-4">
                        <span className="font-semibold text-white block">
                          {report.studentName}
                        </span>
                        <span className="font-mono text-[11px] text-slate-400">
                          {report.rollNo || report.studentUsername}
                        </span>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 font-medium text-white">
                        {report.category}
                      </td>

                      {/* Location & Details Preview */}
                      <td className="py-3 px-4">
                        <span className="font-medium text-slate-200 block truncate max-w-xs">
                          {report.location}
                        </span>
                        <span className="text-[11px] text-slate-400 truncate max-w-xs block">
                          {report.description}
                        </span>
                      </td>

                      {/* Priority with Clear Visual Indicator for Urgent Emergencies */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            report.priority === 'High'
                              ? 'bg-red-600 text-white shadow-sm shadow-red-600/40'
                              : report.priority === 'Medium'
                              ? 'bg-amber-600 text-white'
                              : 'bg-slate-700 text-slate-200'
                          }`}
                        >
                          {isUrgent && (
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                          )}
                          <span>{report.priority}</span>
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 w-max ${
                            report.status === 'Resolved'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : report.status === 'In Progress'
                              ? 'bg-blue-950 text-blue-300 border border-blue-800'
                              : 'bg-amber-950 text-amber-300 border border-amber-800'
                          }`}
                        >
                          {report.status === 'Resolved' && <CheckCircle2 className="w-3 h-3" />}
                          {report.status === 'In Progress' && <Clock className="w-3 h-3" />}
                          {report.status === 'Submitted' && <AlertTriangle className="w-3 h-3" />}
                          <span>{report.status}</span>
                        </span>
                      </td>

                      {/* Timestamp */}
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                        {report.submittedAt}
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleOpenEdit(report)}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-blue-300 text-xs font-semibold border border-slate-700 transition-colors inline-flex items-center gap-1"
                        >
                          <Edit className="w-3 h-3" />
                          <span>Update</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Status Update & Report Details Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 text-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>Manage Emergency Report #{selectedReport.id}</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Campus Emergency System · Incident Response Life-Cycle
                </p>
              </div>

              <button
                onClick={() => setSelectedReport(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <form onSubmit={(event) => { void handleSaveStatus(event); }} className="p-6 space-y-4 text-xs">
              {updateError && (
                <div role="alert" className="rounded-lg border border-red-700 bg-red-950/60 p-3 text-red-200">
                  {updateError}
                </div>
              )}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-slate-400 text-[11px]">Reporting Student:</span>
                    <p className="font-bold text-white text-sm">
                      {selectedReport.studentName} ({selectedReport.rollNo || selectedReport.studentUsername})
                    </p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      selectedReport.priority === 'High'
                        ? 'bg-red-600 text-white'
                        : selectedReport.priority === 'Medium'
                        ? 'bg-amber-600 text-white'
                        : 'bg-slate-700 text-slate-200'
                    }`}
                  >
                    {selectedReport.priority} Priority
                  </span>
                </div>

                <div className="text-slate-300">
                  <span className="text-slate-500 text-[11px]">Location:</span>
                  <p className="font-semibold">{selectedReport.location}</p>
                </div>

                <div className="text-slate-300">
                  <span className="text-slate-500 text-[11px]">Description:</span>
                  <p className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 leading-relaxed text-slate-200">
                    {selectedReport.description}
                  </p>
                </div>

                {selectedReport.classificationReason && (
                  <div className="text-[11px] text-slate-400">
                    <strong className="text-slate-300">Python Classifier Reason:</strong>{' '}
                    {selectedReport.classificationReason}
                  </div>
                )}
              </div>

              {/* Status Selector */}
              <div>
                <label className="text-slate-300 font-semibold block mb-1.5">
                  Update Report Status <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Submitted', 'In Progress', 'Resolved'] as ReportStatus[]).map((st) => (
                    <button
                      type="button"
                      key={st}
                      onClick={() => setNewStatus(st)}
                      className={`py-2 px-3 rounded-xl border text-center transition-all ${
                        newStatus === st
                          ? st === 'Resolved'
                            ? 'bg-emerald-600 text-white font-bold border-emerald-500'
                            : st === 'In Progress'
                            ? 'bg-blue-600 text-white font-bold border-blue-500'
                            : 'bg-amber-600 text-white font-bold border-amber-500'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Admin Notes / Action Taken */}
              <div>
                <label className="text-slate-300 font-semibold block mb-1.5">
                  Administrative Action Taken & Notes
                </label>
                <textarea
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="e.g. Dispatched campus ambulance at 10:45 AM. Guard Manoj Tiwari arrived on scene. Issue resolved."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 leading-relaxed"
                />
              </div>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedReport(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-md disabled:opacity-60"
                >
                  {isUpdating ? 'Saving…' : 'Save Status & Notes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isAdminRegistrationOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-6 py-4">
              <div>
                <h2 className="text-base font-bold">Register New Administrator</h2>
                <p className="mt-1 text-xs text-slate-400">
                  {onRegisterAdmin
                    ? 'Create an admin account for the security team.'
                    : 'Admin creation depends on your configured backend.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAdminRegistrationOpen(false)}
                aria-label="Close admin registration"
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {onRegisterAdmin ? (
            <form onSubmit={(event) => { void handleRegisterAdmin(event); }} className="space-y-4 p-6">
              {adminRegistrationError && (
                <div role="alert" className="rounded-lg border border-red-500/50 bg-red-950/60 p-3 text-xs text-red-200">
                  {adminRegistrationError}
                </div>
              )}
              <label className="block text-xs font-semibold text-slate-300">
                Full name
                <input name="fullName" autoComplete="name" required className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-white" />
              </label>
              <label className="block text-xs font-semibold text-slate-300">
                Username
                <input name="username" autoComplete="username" minLength={3} maxLength={32} pattern="[-a-zA-Z0-9_.]+" required className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-white" />
              </label>
              <label className="block text-xs font-semibold text-slate-300">
                Email address
                <input name="email" type="email" autoComplete="email" required className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-white" />
              </label>
              <label className="block text-xs font-semibold text-slate-300">
                Department
                <input name="department" required className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-white" />
              </label>
              <label className="block text-xs font-semibold text-slate-300">
                Phone number
                <input name="phone" type="tel" autoComplete="tel" pattern="^\+[1-9][0-9]{7,14}$" placeholder="+919876543210" required className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-white" />
              </label>
              <label className="block text-xs font-semibold text-slate-300">
                Temporary password
                <input name="password" type="password" autoComplete="new-password" minLength={8} required className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-white" />
              </label>
              <div className="flex justify-end gap-3 border-t border-slate-800 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAdminRegistrationOpen(false)}
                  className="rounded-xl bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isRegisteringAdmin}
                  className="rounded-xl bg-red-600 px-5 py-2 text-xs font-bold text-white hover:bg-red-500 disabled:opacity-60"
                >
                  {isRegisteringAdmin ? 'Registering…' : 'Create Admin Account'}
                </button>
              </div>
            </form>
            ) : (
              <div className="space-y-4 p-6 text-sm text-slate-300">
                <p>
                  {adminUser.role === 'admin'
                    ? 'This deployment is not using the Flask admin-registration API, so accounts cannot be created directly here.'
                    : 'Only an administrator can create another administrator account.'}
                </p>
                <div className="rounded-xl border border-slate-700 bg-slate-950 p-4 text-xs leading-relaxed">
                  <p className="font-semibold text-white">For a Supabase deployment:</p>
                  <ol className="mt-2 list-inside list-decimal space-y-1">
                    <li>Sign out and create the new account using Student Login → New student?</li>
                    <li>Sign back in as an admin and run the following in Supabase SQL Editor:</li>
                  </ol>
                  <pre className="mt-3 overflow-x-auto rounded-lg bg-black/40 p-3 text-[11px] text-emerald-200">
{`update public.profiles as p
set role = 'admin'
from auth.users as u
where p.id = u.id
  and u.email = 'new-admin@example.com';`}
                  </pre>
                </div>
                <p className="text-xs text-slate-500">
                  For a local Flask setup, restart the frontend with VITE_API_MODE=flask to enable in-app registration.
                </p>
                <div className="flex justify-end border-t border-slate-800 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsAdminRegistrationOpen(false)}
                    className="rounded-xl bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
