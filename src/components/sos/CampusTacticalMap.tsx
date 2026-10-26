import { CampusZone, DistressIncident, PatrolGuard } from '../../types/sos';
import { MapPin, Shield, AlertCircle, Navigation } from 'lucide-react';

interface MapProps {
  campusZones: CampusZone[];
  selectedZone: CampusZone;
  onZoneSelect: (zone: CampusZone) => void;
  activeIncidents: DistressIncident[];
  patrolGuards: PatrolGuard[];
}

export function CampusTacticalMap({
  campusZones,
  selectedZone,
  onZoneSelect,
  activeIncidents,
  patrolGuards
}: MapProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white shadow-xl flex flex-col h-full">
      {/* Map Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3 text-xs">
        <div className="flex items-center gap-2">
          <Navigation className="w-4 h-4 text-blue-400" />
          <span className="font-bold text-white text-sm">PSIT Kanpur — Tactical Campus Grid</span>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-slate-400 font-mono">
          <span>LAT: 26.4499° N</span>
          <span>LNG: 80.3319° E</span>
          <span className="text-emerald-400 font-semibold">Active Geofence</span>
        </div>
      </div>

      {/* Vector Campus Tactical Stage */}
      <div className="relative w-full flex-1 min-h-[360px] bg-slate-950 rounded-xl border border-slate-800 overflow-hidden select-none">
        {/* Subtle Campus Grid Lines */}
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              'linear-gradient(to right, #475569 1px, transparent 1px), linear-gradient(to bottom, #475569 1px, transparent 1px)',
            backgroundSize: '36px 36px'
          }}
        />

        {/* Highway NH-19 Label */}
        <div className="absolute top-2 left-4 text-[10px] font-mono text-slate-600 uppercase tracking-widest">
          ↑ Kanpur - Delhi National Highway (NH-19)
        </div>

        {/* Campus Roads and Walkways */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          {/* Main campus spine artery */}
          <line x1="55%" y1="12%" x2="55%" y2="85%" stroke="#334155" strokeWidth="6" strokeDasharray="6 4" />
          <line x1="20%" y1="50%" x2="85%" y2="50%" stroke="#334155" strokeWidth="6" strokeDasharray="6 4" />
          <line x1="32%" y1="48%" x2="78%" y2="28%" stroke="#1e293b" strokeWidth="3" />
          <line x1="42%" y1="38%" x2="82%" y2="72%" stroke="#1e293b" strokeWidth="3" />

          {/* Active Incident Response Vector lines */}
          {activeIncidents.map((incident) => {
            const nearestGuard = patrolGuards[0];
            return (
              <g key={`vector-${incident.id}`}>
                <line
                  x1={`${incident.xPercent}%`}
                  y1={`${incident.yPercent}%`}
                  x2={`${nearestGuard.xPercent}%`}
                  y2={`${nearestGuard.yPercent}%`}
                  stroke="#ef4444"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  className="animate-pulse"
                />
              </g>
            );
          })}
        </svg>

        {/* Campus Zones / Buildings */}
        {campusZones.map((zone) => {
          const isSelected = selectedZone.id === zone.id;
          const hasIncident = activeIncidents.some((inc) => inc.zone === zone.name);

          return (
            <div
              key={zone.id}
              onClick={() => onZoneSelect(zone)}
              style={{
                left: `${zone.xPercent}%`,
                top: `${zone.yPercent}%`,
                transform: 'translate(-50%, -50%)'
              }}
              className={`absolute cursor-pointer p-2.5 rounded-xl border text-center transition-all ${
                hasIncident
                  ? 'bg-red-950/90 border-red-500 shadow-lg shadow-red-500/30 scale-105 z-30'
                  : isSelected
                  ? 'bg-blue-900/80 border-blue-400 shadow-md scale-105 z-20'
                  : 'bg-slate-900/90 border-slate-700 hover:border-slate-500 hover:bg-slate-800 z-10'
              }`}
            >
              {hasIncident && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
                </span>
              )}

              <p className="text-[11px] font-bold text-white whitespace-nowrap leading-tight">
                {zone.building}
              </p>
              <span
                className={`text-[9px] px-1.5 py-0.2 rounded font-medium mt-0.5 inline-block ${
                  zone.riskLevel === 'High Risk'
                    ? 'text-red-300 bg-red-950/80'
                    : zone.riskLevel === 'Moderate'
                    ? 'text-amber-300 bg-amber-950/80'
                    : 'text-emerald-300 bg-emerald-950/80'
                }`}
              >
                {zone.riskLevel}
              </span>
            </div>
          );
        })}

        {/* Patrol Guard Markers */}
        {patrolGuards.map((guard) => (
          <div
            key={guard.id}
            style={{
              left: `${guard.xPercent}%`,
              top: `${guard.yPercent}%`,
              transform: 'translate(-50%, -50%)'
            }}
            className="absolute z-20 flex flex-col items-center pointer-events-none"
          >
            <div className="w-6 h-6 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center text-white shadow-md">
              <Shield className="w-3 h-3" />
            </div>
            <span className="text-[9px] bg-slate-900/90 text-blue-200 px-1.5 py-0.2 rounded mt-0.5 font-medium whitespace-nowrap border border-slate-700">
              {guard.name.split(" ")[1] || guard.name}
            </span>
          </div>
        ))}
      </div>

      {/* Selected Zone Card */}
      <div className="mt-3 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div>
          <span className="text-slate-400">Selected Location: </span>
          <strong className="text-white">{selectedZone.name}</strong>
        </div>
        <div className="text-slate-400 text-[11px]">
          Nearest Security Post: <strong className="text-blue-300">{selectedZone.guardPost}</strong>
        </div>
      </div>
    </div>
  );
}
