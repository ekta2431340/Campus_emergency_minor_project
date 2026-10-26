import { useState, useEffect } from 'react';
import { Compass, CheckCircle2, AlertTriangle, Clock, ShieldCheck, MapPin } from 'lucide-react';
import { CampusZone, DistressIncident, UserProfile } from '../../types/sos';

interface SafeWalkProps {
  user: UserProfile;
  campusZones: CampusZone[];
  onTriggerSos: (incident: DistressIncident) => void;
}

export function SafeWalkCompanion({ user, campusZones, onTriggerSos }: SafeWalkProps) {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [destination, setDestination] = useState<string>('Girls Hostel Complex & Garden Pathway');
  const [durationMinutes, setDurationMinutes] = useState<number>(8);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(8 * 60);
  const [arrived, setArrived] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => prev - 1);
      }, 1000);
    } else if (isActive && secondsRemaining === 0) {
      // Auto trigger emergency distress!
      setIsActive(false);
      const newIncident: DistressIncident = {
        id: `SOS-AUTO-${Math.floor(100 + Math.random() * 900)}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        studentName: user.name,
        rollNo: user.rollNo,
        department: user.department,
        zone: destination,
        lat: 26.4518,
        lng: 80.3345,
        xPercent: 78,
        yPercent: 28,
        emergencyType: 'Physical Threat / Harassment',
        severity: 'CRITICAL',
        status: 'DISPATCHED',
        assignedGuard: 'Patrol Sector 3 (Immediate Dispatch)',
        etaMinutes: 1.0,
        batteryLevel: 72,
        medicalNotes: `SafeWalk check-in timeout triggered. Destination: ${destination}`
      };
      onTriggerSos(newIncident);
    }
    return () => clearInterval(interval);
  }, [isActive, secondsRemaining]);

  const handleStartJourney = () => {
    setSecondsRemaining(durationMinutes * 60);
    setIsActive(true);
    setArrived(false);
  };

  const handleArrived = () => {
    setIsActive(false);
    setArrived(true);
    setTimeout(() => setArrived(false), 5000);
  };

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">SafeWalk Virtual Guardian</h3>
            <p className="text-xs text-slate-400">
              Live journey tracking for late-night campus transit with automatic SOS safeguard
            </p>
          </div>
        </div>
      </div>

      {!isActive && !arrived && (
        <div className="space-y-4 text-xs">
          <div>
            <label className="text-slate-400 font-semibold block mb-1">Select Destination</label>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg p-2.5 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              {campusZones.map((z) => (
                <option key={z.id} value={z.name}>
                  {z.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-slate-400 font-semibold block mb-1">
              Estimated Transit Time ({durationMinutes} minutes)
            </label>
            <input
              type="range"
              min={3}
              max={25}
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              className="w-full accent-emerald-500"
            />
            <div className="flex justify-between text-[11px] text-slate-500 font-mono mt-1">
              <span>3 mins</span>
              <span>15 mins</span>
              <span>25 mins</span>
            </div>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <p className="text-slate-300 font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Automatic Emergency Trigger:
            </p>
            <p>
              If you do not confirm arrival before the timer hits 0:00, Campus SOS AI automatically transmits a Critical SOS with your last reported GPS location to Security Control.
            </p>
          </div>

          <button
            onClick={handleStartJourney}
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-lg"
          >
            Start SafeWalk Journey
          </button>
        </div>
      )}

      {isActive && (
        <div className="flex flex-col items-center py-4 space-y-4">
          <div className="w-40 h-40 rounded-full bg-emerald-950/40 border-4 border-emerald-500 flex flex-col items-center justify-center animate-pulse">
            <span className="text-4xl font-black font-mono text-emerald-400">{timeFormatted}</span>
            <span className="text-[10px] uppercase font-bold text-emerald-300 mt-1">Check-in Due</span>
          </div>

          <div className="text-center text-xs space-y-1">
            <p className="text-slate-400">Heading to:</p>
            <p className="font-bold text-white text-sm">{destination}</p>
          </div>

          <div className="flex gap-3 w-full max-w-sm pt-2">
            <button
              onClick={handleArrived}
              className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>I've Arrived Safely</span>
            </button>
            <button
              onClick={() => {
                setSecondsRemaining(0);
              }}
              className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-colors flex items-center gap-1"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>SOS</span>
            </button>
          </div>
        </div>
      )}

      {arrived && (
        <div className="p-6 text-center bg-slate-950 rounded-xl border border-emerald-500/50 space-y-2">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
          <h4 className="font-bold text-white text-sm">Safe Arrival Confirmed</h4>
          <p className="text-xs text-slate-400">
            Journey session closed. Trusted guardians and security notify log updated.
          </p>
        </div>
      )}
    </div>
  );
}
