import { useState, useId } from 'react';
import { User, EmergencyReport, EmergencyCategory, ReportPriority } from '../types/emergency';
import { CAMPUS_LOCATIONS } from '../data/defaultData';
import { classifyEmergency } from '../utils/classifier';
import {
  AlertTriangle,
  PlusCircle,
  Clock,
  MapPin,
  CheckCircle2,
  Activity,
  Flame,
  ShieldAlert,
  Car,
  HelpCircle,
  X,
  FileText,
  User as UserIcon,
  Phone,
  Mail,
  GraduationCap
} from 'lucide-react';

interface StudentDashboardProps {
  user: User;
  reports: EmergencyReport[];
  onSubmitReport: (newReport: EmergencyReport) => void;
}

export function StudentDashboard({ user, reports, onSubmitReport }: StudentDashboardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [category, setCategory] = useState<EmergencyCategory>('Medical Emergency');
  const [location, setLocation] = useState<string>(CAMPUS_LOCATIONS[0]);
  const [customLocation, setCustomLocation] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Submitted' | 'In Progress' | 'Resolved'>('All');
  const [submissionSuccessMsg, setSubmissionSuccessMsg] = useState<string | null>(null);

  // Live Python-logic keyword classification calculation
  const classification = classifyEmergency(category, description);

  // Filter reports to only show this student's reports
  const myReports = reports.filter((r) => r.studentUsername === user.username);
  const displayedReports = myReports.filter((r) => {
    if (statusFilter === 'All') return true;
    return r.status === statusFilter;
  });

  const categoryIcons: Record<EmergencyCategory, React.ReactNode> = {
    'Medical Emergency': <Activity className="w-4 h-4 text-rose-500" />,
    'Fire': <Flame className="w-4 h-4 text-orange-500" />,
    'Security Issue': <ShieldAlert className="w-4 h-4 text-blue-500" />,
    'Accident': <Car className="w-4 h-4 text-amber-500" />,
    'Other': <HelpCircle className="w-4 h-4 text-slate-400" />
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!description.trim()) {
      alert('Please enter a brief description of the emergency.');
      return;
    }

    const finalLocation = customLocation.trim() || location;
    const reportId = `CES-2026-${Math.floor(100 + Math.random() * 900)}`;

    const newReport: EmergencyReport = {
      id: reportId,
      studentUsername: user.username,
      studentName: user.fullName,
      rollNo: user.rollNo,
      category,
      location: finalLocation,
      description: description.trim(),
      priority: classification.priority,
      status: 'Submitted',
      matchedKeywords: classification.matchedKeywords,
      classificationReason: classification.reason,
      submittedAt: new Date().toLocaleString([], {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    onSubmitReport(newReport);
    setIsModalOpen(false);
    setDescription('');
    setCustomLocation('');
    setSubmissionSuccessMsg(
      `Emergency Report #${reportId} submitted successfully to Campus Security Control!`
    );
    setTimeout(() => setSubmissionSuccessMsg(null), 6000);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner & Student Profile Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Student Safety Portal
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Welcome, {user.fullName}
          </h1>
          <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-mono text-slate-300">
              <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
              Roll No: {user.rollNo || user.username}
            </span>
            <span>·</span>
            <span>{user.department || 'BCA (Computer Applications)'}</span>
            {user.phone && (
              <>
                <span>·</span>
                <span className="flex items-center gap-1 font-mono">
                  <Phone className="w-3 h-3 text-slate-400" />
                  {user.phone}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Prominent Emergency Reporting Action */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full md:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-bold text-sm tracking-wide shadow-lg shadow-red-600/30 flex items-center justify-center gap-2.5 transition-all transform active:scale-95 cursor-pointer shrink-0"
        >
          <AlertTriangle className="w-5 h-5 text-white animate-pulse" />
          <span>REPORT CAMPUS EMERGENCY</span>
        </button>
      </div>

      {/* Success Notification Banner */}
      {submissionSuccessMsg && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-200 text-xs flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="font-semibold">{submissionSuccessMsg}</span>
          </div>
          <button
            onClick={() => setSubmissionSuccessMsg(null)}
            className="text-emerald-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Emergency Reporting Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 text-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-red-600/20 text-red-500 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">
                    Campus Emergency Reporting Form
                  </h2>
                  <p className="text-xs text-slate-400">
                    Campus Emergency System · Immediate Dispatch Triage
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 text-xs">
              {/* Emergency Category */}
              <div>
                <label className="text-slate-300 font-semibold block mb-1.5">
                  Emergency Category <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(
                    [
                      'Medical Emergency',
                      'Fire',
                      'Security Issue',
                      'Accident',
                      'Other'
                    ] as EmergencyCategory[]
                  ).map((cat) => (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`p-2.5 rounded-xl border flex items-center gap-2 text-left transition-all ${
                        category === cat
                          ? 'bg-blue-600/30 border-blue-500 text-white font-semibold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                      }`}
                    >
                      {categoryIcons[cat]}
                      <span className="truncate">{cat}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="text-slate-300 font-semibold block mb-1.5">
                  Campus Location <span className="text-red-400">*</span>
                </label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {CAMPUS_LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>

                <div className="mt-2">
                  <input
                    type="text"
                    value={customLocation}
                    onChange={(e) => setCustomLocation(e.target.value)}
                    placeholder="Specific Room / Floor / Pillar Landmark (optional)"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-slate-300 font-semibold block mb-1.5">
                  Incident Description & Details <span className="text-red-400">*</span>
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what happened, injuries, number of people affected, or immediate dangers (e.g. 'Student is unconscious near stairs', 'Dense smoke coming from lab', 'Severe bleeding')..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 leading-relaxed"
                  required
                />
              </div>

              {/* Python Keyword-Based Priority Classification Preview */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                    <span>Priority (Keyword Classified):</span>
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                      classification.priority === 'High'
                        ? 'bg-red-600 text-white'
                        : classification.priority === 'Medium'
                        ? 'bg-amber-600 text-white'
                        : 'bg-slate-700 text-slate-200'
                    }`}
                  >
                    {classification.priority} Priority
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 leading-normal">
                  <strong className="text-slate-300">Rule Reason: </strong>
                  {classification.reason}
                </p>

                {classification.matchedKeywords.length > 0 && (
                  <div className="flex items-center gap-1.5 pt-1 text-[11px]">
                    <span className="text-slate-400">Matched Critical Keywords:</span>
                    <div className="flex flex-wrap gap-1">
                      {classification.matchedKeywords.map((kw) => (
                        <span
                          key={kw}
                          className="px-1.5 py-0.2 bg-red-950 text-red-300 border border-red-800 rounded font-mono text-[10px]"
                        >
                          "{kw}"
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>Submit Emergency Report</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Previously Submitted Reports Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-400" />
              <span>My Submitted Emergency Reports ({myReports.length})</span>
            </h2>
            <p className="text-xs text-slate-400">
              Track the current response status and security team actions for your reports
            </p>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            {(['All', 'Submitted', 'In Progress', 'Resolved'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`px-3 py-1 rounded-md transition-colors ${
                  statusFilter === filter
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {displayedReports.length === 0 ? (
          <div className="p-8 text-center bg-slate-950/60 rounded-xl border border-slate-800/80 text-slate-500 text-xs">
            {myReports.length === 0
              ? 'You have not submitted any emergency reports yet.'
              : `No reports matching '${statusFilter}' status.`}
          </div>
        ) : (
          <div className="space-y-3">
            {displayedReports.map((report) => (
              <div
                key={report.id}
                className={`p-4 rounded-xl border transition-all ${
                  report.priority === 'High' && report.status !== 'Resolved'
                    ? 'bg-red-950/20 border-red-500/50 shadow-sm'
                    : 'bg-slate-950/70 border-slate-800'
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-300">
                      {report.id}
                    </span>
                    <span className="text-xs font-semibold text-white">
                      {report.category}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        report.priority === 'High'
                          ? 'bg-red-600 text-white'
                          : report.priority === 'Medium'
                          ? 'bg-amber-600 text-white'
                          : 'bg-slate-700 text-slate-200'
                      }`}
                    >
                      {report.priority}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                        report.status === 'Resolved'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : report.status === 'In Progress'
                          ? 'bg-blue-950 text-blue-300 border border-blue-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {report.status === 'Resolved' && <CheckCircle2 className="w-3 h-3" />}
                      {report.status === 'In Progress' && <Clock className="w-3 h-3 animate-spin" />}
                      <span>{report.status}</span>
                    </span>

                    <span className="text-[11px] font-mono text-slate-400">
                      {report.submittedAt}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-300 space-y-1 mb-2">
                  <p className="flex items-center gap-1.5 text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span>{report.location}</span>
                  </p>
                  <p className="text-white leading-relaxed">{report.description}</p>
                </div>

                {/* Admin notes if present */}
                {report.adminNotes && (
                  <div className="mt-2 p-2.5 rounded-lg bg-blue-950/30 border border-blue-800/60 text-[11px] text-blue-200">
                    <strong className="text-blue-300">Security Office Update: </strong>
                    <span>{report.adminNotes}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
