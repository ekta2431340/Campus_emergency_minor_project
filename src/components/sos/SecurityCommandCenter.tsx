import { useState } from 'react';
import { DistressIncident, PatrolGuard } from '../../types/sos';
import {
  ShieldAlert,
  Volume2,
  VolumeX,
  Radio,
  CheckCircle2,
  Clock,
  PhoneCall,
  Megaphone,
  AlertTriangle,
  UserCheck
} from 'lucide-react';

interface CommandCenterProps {
  incidents: DistressIncident[];
  onResolveIncident: (id: string) => void;
  patrolGuards: PatrolGuard[];
  onBroadcastAlert: (message: string) => void;
  currentBroadcast: string | null;
}

export function SecurityCommandCenter({
  incidents,
  onResolveIncident,
  patrolGuards,
  onBroadcastAlert,
  currentBroadcast
}: CommandCenterProps) {
  const [sirenActive, setSirenActive] = useState<boolean>(false);
  const [customBroadcastInput, setCustomBroadcastInput] = useState<string>('');
  const [filterSeverity, setFilterSeverity] = useState<'ALL' | 'CRITICAL' | 'HIGH'>('ALL');

  const toggleSiren = () => {
    setSirenActive(!sirenActive);
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customBroadcastInput.trim()) return;
    onBroadcastAlert(customBroadcastInput);
    setCustomBroadcastInput('');
  };

  const filteredIncidents = incidents.filter((inc) => {
    if (filterSeverity === 'ALL') return true;
    return inc.severity === filterSeverity;
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl space-y-6">
      {/* Top Console Bar */}
      <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>PSIT Security Command Center</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                Dispatcher Tier-1
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Live incident triage, security patrol routing, and automated SMS dispatch
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 text-xs">
          <button
            onClick={toggleSiren}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              sirenActive
                ? 'bg-red-600 text-white animate-pulse'
                : 'bg-slate-800 text-slate-300 border border-slate-700 hover:text-white'
            }`}
          >
            {sirenActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span>Siren {sirenActive ? 'BLARING' : 'Armed'}</span>
          </button>
        </div>
      </div>

      {/* Metric Counters Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400">Active Distress Incidents</span>
          <p className="text-xl font-bold font-mono text-red-400 mt-0.5">
            {incidents.filter((i) => i.status !== 'RESOLVED').length} Active
          </p>
        </div>
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400">Patrols on Duty</span>
          <p className="text-xl font-bold font-mono text-blue-400 mt-0.5">
            {patrolGuards.length} Units
          </p>
        </div>
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400">Average Response Latency</span>
          <p className="text-xl font-bold font-mono text-emerald-400 mt-0.5">1.34s</p>
        </div>
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400">Campus Status</span>
          <p className="text-xl font-bold text-amber-300 mt-0.5">Elevated Watch</p>
        </div>
      </div>

      {/* Broadcast Alert Bar */}
      {currentBroadcast && (
        <div className="bg-amber-950/80 border border-amber-500 rounded-xl p-3 flex items-center justify-between text-xs text-amber-200">
          <div className="flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>CAMPUS BROADCAST:</strong> {currentBroadcast}
            </span>
          </div>
          <button
            onClick={() => onBroadcastAlert('')}
            className="text-[11px] underline hover:text-white"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Incident Queue */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-300 uppercase tracking-wider">
            Real-Time Distress Queue ({filteredIncidents.length})
          </span>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-[11px]">
            <button
              onClick={() => setFilterSeverity('ALL')}
              className={`px-2.5 py-1 rounded transition-colors ${
                filterSeverity === 'ALL' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterSeverity('CRITICAL')}
              className={`px-2.5 py-1 rounded transition-colors ${
                filterSeverity === 'CRITICAL' ? 'bg-red-600 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              Critical
            </button>
            <button
              onClick={() => setFilterSeverity('HIGH')}
              className={`px-2.5 py-1 rounded transition-colors ${
                filterSeverity === 'HIGH' ? 'bg-amber-600 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              High
            </button>
          </div>
        </div>

        {filteredIncidents.length === 0 ? (
          <div className="p-8 text-center bg-slate-950 rounded-xl border border-slate-800 text-slate-500 text-xs">
            No active distress incidents in the queue.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredIncidents.map((incident) => (
              <div
                key={incident.id}
                className={`p-4 rounded-xl border transition-all ${
                  incident.status === 'RESOLVED'
                    ? 'bg-slate-950/60 border-slate-800 opacity-60'
                    : incident.severity === 'CRITICAL'
                    ? 'bg-red-950/40 border-red-500/70 shadow-lg shadow-red-950/50'
                    : 'bg-amber-950/30 border-amber-500/60'
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    {incident.status !== 'RESOLVED' && (
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping shrink-0" />
                    )}
                    <h4 className="font-bold text-white text-sm">
                      {incident.studentName}{" "}
                      <span className="font-mono text-xs font-normal text-slate-400">
                        ({incident.rollNo})
                      </span>
                    </h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                      {incident.emergencyType}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        incident.severity === 'CRITICAL'
                          ? 'bg-red-600 text-white'
                          : 'bg-amber-600 text-white'
                      }`}
                    >
                      {incident.severity}
                    </span>
                    <span className="font-mono text-slate-400 text-[11px]">
                      {incident.timestamp}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-950/80 p-3 rounded-lg border border-slate-800/80 text-xs text-slate-300 mb-3">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Zone & Geofence:</span>
                    <span className="font-medium text-white">{incident.zone}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Assigned Patrol:</span>
                    <span className="font-medium text-emerald-400">
                      {incident.assignedGuard} (ETA: {incident.etaMinutes}m)
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Medical Info:</span>
                    <span className="font-medium text-slate-300">{incident.medicalNotes}</span>
                  </div>
                </div>

                {incident.status !== 'RESOLVED' ? (
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <button
                      onClick={() => onResolveIncident(incident.id)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark Incident Resolved</span>
                    </button>
                    <button
                      onClick={() =>
                        alert(
                          `Simulating automatic SMS dispatch to student's ICE contacts and Proctor Office with GPS link: https://maps.google.com/?q=${incident.lat},${incident.lng}`
                        )
                      }
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-medium"
                    >
                      Broadcast SMS to ICE Contacts
                    </button>
                  </div>
                ) : (
                  <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Incident successfully resolved and logged to security audit registry.</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Instant Campus Broadcast Publisher */}
      <div className="pt-4 border-t border-slate-800">
        <label className="text-xs font-semibold text-slate-400 block mb-2">
          Issue Public Campus Safety Alert (All Connected Student Screens)
        </label>
        <form onSubmit={handleSendBroadcast} className="flex gap-2 text-xs">
          <input
            type="text"
            value={customBroadcastInput}
            onChange={(e) => setCustomBroadcastInput(e.target.value)}
            placeholder="e.g. Precautionary Advisory: Avoid Sports Complex perimeter due to heavy rain..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg shrink-0 transition-colors"
          >
            Broadcast to Campus
          </button>
        </form>
      </div>
    </div>
  );
}
