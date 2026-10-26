import { useState, useEffect, useRef } from 'react';
import { UserProfile, CampusZone, EmergencyType, DistressIncident } from '../../types/sos';
import {
  AlertTriangle,
  Radio,
  MapPin,
  ShieldAlert,
  Battery,
  PhoneCall,
  CheckCircle2,
  X,
  Volume2
} from 'lucide-react';

interface SosTriggerProps {
  user: UserProfile;
  selectedZone: CampusZone;
  onZoneChange: (zone: CampusZone) => void;
  campusZones: CampusZone[];
  onTriggerSos: (incident: DistressIncident) => void;
  activeIncident: DistressIncident | null;
  onResolveIncident: (id: string) => void;
}

export function TactileSosTrigger({
  user,
  selectedZone,
  onZoneChange,
  campusZones,
  onTriggerSos,
  activeIncident,
  onResolveIncident
}: SosTriggerProps) {
  const [countdown, setCountdown] = useState<number | null>(null);
  const [emergencyType, setEmergencyType] = useState<EmergencyType>('Physical Threat / Harassment');
  const [batteryLevel, setBatteryLevel] = useState<number>(85);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Play audio beeps during countdown
  const playBeep = (freq: number = 880, duration: number = 0.15) => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio not permitted or supported
    }
  };

  // Countdown timer effect
  useEffect(() => {
    if (countdown === null) return;
    if (countdown > 0) {
      playBeep(650, 0.1);
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      // Dispatched!
      playBeep(1200, 0.4);
      const newIncident: DistressIncident = {
        id: `SOS-2026-${Math.floor(100 + Math.random() * 900)}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        studentName: user.name,
        rollNo: user.rollNo,
        department: user.department,
        zone: selectedZone.name,
        lat: selectedZone.lat,
        lng: selectedZone.lng,
        xPercent: selectedZone.xPercent,
        yPercent: selectedZone.yPercent,
        emergencyType,
        severity: emergencyType === 'Physical Threat / Harassment' || emergencyType === 'Fire / Severe Hazard' ? 'CRITICAL' : 'HIGH',
        status: 'DISPATCHED',
        assignedGuard: 'Assigning nearest sector officer...',
        etaMinutes: 1.8,
        batteryLevel,
        medicalNotes: `Blood Group: ${user.bloodGroup} · ${user.hostelBlock} ${user.roomNo}`
      };
      onTriggerSos(newIncident);
      setCountdown(null);
    }
  }, [countdown]);

  const handleStartCountdown = () => {
    if (activeIncident) return;
    setCountdown(3);
  };

  const handleCancelCountdown = () => {
    setCountdown(null);
    playBeep(400, 0.2);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl flex flex-col justify-between">
      {/* Student Profile Quick Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 text-xs">
        <div>
          <span className="text-[11px] text-slate-400 uppercase font-semibold">Active Student Node</span>
          <p className="font-bold text-white text-sm">
            {user.name} <span className="text-slate-400 font-mono font-normal">({user.rollNo})</span>
          </p>
          <p className="text-[11px] text-slate-400">{user.department}</p>
        </div>

        <div className="flex items-center gap-3 text-slate-400">
          <div className="flex items-center gap-1 font-mono text-[11px]">
            <Battery className="w-3.5 h-3.5 text-emerald-400" />
            <span>{batteryLevel}%</span>
          </div>
          <div className="flex items-center gap-1 font-mono text-[11px] text-blue-400">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>4G/Campus Wi-Fi</span>
          </div>
        </div>
      </div>

      {/* Main SOS Trigger Center */}
      <div className="my-8 flex flex-col items-center text-center">
        {!activeIncident && countdown === null && (
          <div className="flex flex-col items-center">
            <button
              onClick={handleStartCountdown}
              className="relative group w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-gradient-to-br from-red-600 via-red-700 to-rose-900 hover:from-red-500 hover:to-rose-800 shadow-2xl shadow-red-600/50 border-4 border-red-500/40 flex flex-col items-center justify-center transition-all transform active:scale-95 cursor-pointer"
            >
              <div className="absolute inset-0 rounded-full border border-red-400/20 group-hover:scale-110 transition-transform duration-500 pointer-events-none" />
              <AlertTriangle className="w-12 h-12 text-white mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-4xl font-black tracking-widest text-white">SOS</span>
              <span className="text-xs font-bold tracking-wider text-red-200 uppercase mt-1">
                TAP TO TRIGGER
              </span>
            </button>
            <p className="text-xs text-slate-400 mt-5 max-w-xs leading-relaxed">
              Sends instant encrypted distress beacon with GPS coordinates to PSIT Security Control & emergency guardians.
            </p>
          </div>
        )}

        {/* 3-Second Abort Countdown */}
        {countdown !== null && (
          <div className="flex flex-col items-center animate-fade-in py-4">
            <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-amber-950/40 border-4 border-amber-500 flex flex-col items-center justify-center animate-pulse">
              <span className="text-6xl sm:text-7xl font-black text-amber-400 font-mono">
                {countdown}
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-200 mt-2">
                Sending in {countdown}s...
              </span>
            </div>

            <button
              onClick={handleCancelCountdown}
              className="mt-6 flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold uppercase tracking-wider border border-slate-600 transition-colors shadow-md"
            >
              <X className="w-4 h-4 text-red-400" />
              <span>Cancel (False Alarm)</span>
            </button>
          </div>
        )}

        {/* Active Emergency State */}
        {activeIncident && (
          <div className="flex flex-col items-center py-2 animate-fade-in w-full max-w-md">
            <div className="w-full bg-red-950/60 border border-red-500/60 rounded-xl p-4 text-left space-y-3 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                  <span className="font-bold text-red-300 text-sm uppercase tracking-wide">
                    EMERGENCY BEACON ACTIVE
                  </span>
                </div>
                <span className="text-[11px] font-mono bg-red-900/60 text-red-200 px-2 py-0.5 rounded border border-red-700">
                  {activeIncident.id}
                </span>
              </div>

              <div className="text-xs text-slate-300 space-y-1">
                <p>
                  <strong className="text-white">Zone:</strong> {activeIncident.zone}
                </p>
                <p>
                  <strong className="text-white">Assigned Patrol:</strong>{" "}
                  <span className="text-emerald-400 font-semibold">{activeIncident.assignedGuard}</span>
                </p>
                <p>
                  <strong className="text-white">Estimated Arrival:</strong>{" "}
                  <span className="font-mono text-amber-300">~{activeIncident.etaMinutes} mins</span>
                </p>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => onResolveIncident(activeIncident.id)}
                  className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Security Arrived / Safe</span>
                </button>
                <button
                  onClick={() => alert(`Calling Campus Security Control: +91 512 269 6400`)}
                  className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call Guard</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Emergency Configuration Drawer */}
      <div className="pt-4 border-t border-slate-800 space-y-3">
        {/* Emergency Type Selector */}
        <div>
          <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
            Emergency Category
          </label>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {(
              [
                'Physical Threat / Harassment',
                'Medical Emergency',
                'Fire / Severe Hazard',
                'Ragging / Coercion'
              ] as EmergencyType[]
            ).map((type) => (
              <button
                key={type}
                onClick={() => setEmergencyType(type)}
                className={`px-2.5 py-1.5 rounded-lg text-left transition-colors truncate ${
                  emergencyType === type
                    ? 'bg-red-600/30 border border-red-500 text-red-200 font-medium'
                    : 'bg-slate-950 border border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Current Campus Geofence Location */}
        <div>
          <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
            Campus Geofence Location (PSIT Kanpur)
          </label>
          <div className="flex items-center gap-2">
            <select
              value={selectedZone.id}
              onChange={(e) => {
                const found = campusZones.find((z) => z.id === e.target.value);
                if (found) onZoneChange(found);
              }}
              className="flex-1 bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-red-500"
            >
              {campusZones.map((z) => (
                <option key={z.id} value={z.id}>
                  {z.name} ({z.riskLevel})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
