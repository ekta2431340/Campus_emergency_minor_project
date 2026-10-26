import { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Radio,
  MapPin,
  Mic,
  Shield,
  PhoneCall,
  CheckCircle2,
  Clock,
  Compass,
  Volume2,
  VolumeX,
  Send
} from 'lucide-react';

export function SosInteractiveSimulator({
  studentLeaderName,
  projectId
}: {
  studentLeaderName: string;
  projectId: string;
}) {
  const [sosState, setSosState] = useState<'idle' | 'counting' | 'active' | 'resolved'>('idle');
  const [countdown, setCountdown] = useState(3);
  const [selectedZone, setSelectedZone] = useState('Academic Block B - 2nd Floor (Lab 4)');
  const [emergencyType, setEmergencyType] = useState('Immediate Personal Threat / Harassment');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [simulatedAcoustic, setSimulatedAcoustic] = useState<'idle' | 'listening' | 'detected'>('idle');
  const [activeTab, setActiveTab] = useState<'trigger' | 'command' | 'safewalk'>('trigger');

  const campusZones = [
    { name: 'Academic Block B - 2nd Floor (Lab 4)', lat: 26.4499, lng: 80.3319, risk: 'Medium' },
    { name: 'Girls Hostel Ground Perimeter', lat: 26.4512, lng: 80.3341, risk: 'High Priority' },
    { name: 'Central Library Basement Corridor', lat: 26.4485, lng: 80.3308, risk: 'Medium' },
    { name: 'Sports Ground & Pavilion Backlane', lat: 26.4471, lng: 80.3292, risk: 'High Priority' },
    { name: 'Main Campus Gate 1 & NH-19 Bus Bay', lat: 26.4525, lng: 80.3355, risk: 'Monitored' }
  ];

  // Countdown handler
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (sosState === 'counting') {
      if (countdown > 0) {
        timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
      } else {
        setSosState('active');
      }
    }
    return () => clearTimeout(timer);
  }, [sosState, countdown]);

  const triggerPanic = () => {
    setCountdown(3);
    setSosState('counting');
  };

  const cancelPanic = () => {
    setSosState('idle');
    setCountdown(3);
  };

  const simulateDistressAudio = () => {
    setSimulatedAcoustic('listening');
    setTimeout(() => {
      setSimulatedAcoustic('detected');
      setTimeout(() => {
        triggerPanic();
      }, 800);
    }, 1500);
  };

  return (
    <div className="bg-slate-900 text-white rounded-xl shadow-lg border border-slate-800 overflow-hidden max-w-5xl mx-auto my-6">
      {/* Header */}
      <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-500">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>Campus SOS AI — System Simulator</span>
              <span className="text-[10px] bg-red-950/80 border border-red-800/80 text-red-400 px-2 py-0.5 rounded font-mono">
                {projectId}
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Interactive test harness for BCA Minor Project evaluation & faculty demo
            </p>
          </div>
        </div>

        {/* Sub Navigation */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('trigger')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === 'trigger'
                ? 'bg-red-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Student SOS App
          </button>
          <button
            onClick={() => setActiveTab('command')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === 'command'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Security Console
          </button>
          <button
            onClick={() => setActiveTab('safewalk')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === 'safewalk'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            SafeWalk Beacon
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="p-6">
        {activeTab === 'trigger' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Left Trigger Zone */}
            <div className="md:col-span-6 flex flex-col items-center text-center p-6 bg-slate-950/60 rounded-xl border border-slate-800">
              <div className="mb-4">
                <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                  Distress Actuation Node
                </span>
                <p className="text-sm font-semibold text-slate-200 mt-0.5">
                  Logged in as: {studentLeaderName}
                </p>
              </div>

              {sosState === 'idle' && (
                <div className="flex flex-col items-center">
                  <button
                    onClick={triggerPanic}
                    className="group relative w-48 h-48 rounded-full bg-gradient-to-b from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 shadow-2xl shadow-red-600/40 border-4 border-red-400/30 flex flex-col items-center justify-center transition-all transform active:scale-95 cursor-pointer"
                  >
                    <AlertTriangle className="w-12 h-12 text-white mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-3xl font-black tracking-widest text-white">SOS</span>
                    <span className="text-[11px] font-semibold text-red-100 tracking-wider mt-1 uppercase">
                      Hold or Tap
                    </span>
                  </button>
                  <p className="text-xs text-slate-400 mt-4 max-w-xs">
                    Pressing triggers an instant high-priority alert to PSIT Kanpur Security & registered guardian phones.
                  </p>
                </div>
              )}

              {sosState === 'counting' && (
                <div className="flex flex-col items-center animate-fade-in">
                  <div className="w-48 h-48 rounded-full bg-amber-600/20 border-4 border-amber-500 flex flex-col items-center justify-center animate-pulse">
                    <span className="text-6xl font-black text-amber-400 font-mono">{countdown}</span>
                    <span className="text-xs font-semibold text-amber-200 uppercase mt-2">
                      Sending in {countdown}s...
                    </span>
                  </div>
                  <button
                    onClick={cancelPanic}
                    className="mt-5 px-6 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold uppercase tracking-wider border border-slate-700 transition-colors"
                  >
                    Cancel False Alarm
                  </button>
                </div>
              )}

              {sosState === 'active' && (
                <div className="flex flex-col items-center">
                  <div className="w-48 h-48 rounded-full bg-red-600/30 border-4 border-red-500 flex flex-col items-center justify-center animate-ping-slow">
                    <Radio className="w-10 h-10 text-red-400 animate-pulse mb-1" />
                    <span className="text-xl font-black text-white uppercase tracking-wider">BEACON ACTIVE</span>
                    <span className="text-[10px] text-red-200 mt-1 font-mono">LAT: 26.4499 LNG: 80.3319</span>
                  </div>
                  <div className="flex gap-2 mt-5">
                    <button
                      onClick={() => setSosState('resolved')}
                      className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors"
                    >
                      Security Arrived / Resolve
                    </button>
                    <button
                      onClick={cancelPanic}
                      className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold transition-colors"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              )}

              {sosState === 'resolved' && (
                <div className="flex flex-col items-center py-6">
                  <CheckCircle2 className="w-16 h-16 text-emerald-400 mb-2" />
                  <span className="text-lg font-bold text-white">Incident Resolved</span>
                  <p className="text-xs text-slate-400 mt-1">Audit log generated for supervisor review.</p>
                  <button
                    onClick={cancelPanic}
                    className="mt-4 px-4 py-1.5 rounded-lg bg-slate-800 text-slate-200 text-xs font-medium"
                  >
                    Return to Standby
                  </button>
                </div>
              )}
            </div>

            {/* Right Settings & Telemetry */}
            <div className="md:col-span-6 space-y-4">
              <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2 mb-3 text-slate-200 font-semibold text-xs">
                  <MapPin className="w-4 h-4 text-red-400" />
                  <span>Simulate Student Campus Location</span>
                </div>
                <div className="space-y-2">
                  {campusZones.map((z) => (
                    <button
                      key={z.name}
                      onClick={() => setSelectedZone(z.name)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                        selectedZone === z.name
                          ? 'bg-blue-600/30 border border-blue-500 text-blue-200 font-medium'
                          : 'bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800/60'
                      }`}
                    >
                      <span>{z.name}</span>
                      <span className="text-[10px] font-mono text-slate-500">
                        {z.lat.toFixed(4)}, {z.lng.toFixed(4)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Acoustic Distress Keyword Classifier */}
              <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-slate-200 font-semibold text-xs">
                    <Mic className="w-4 h-4 text-amber-400" />
                    <span>Gemini AI Acoustic Threat Classifier</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    Voice Mode: Active
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-3">
                  Demonstrates background keyword recognition for hands-free actuation during emergencies.
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={simulateDistressAudio}
                    disabled={simulatedAcoustic === 'listening'}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-600/20 border border-amber-500/40 text-amber-300 hover:bg-amber-600/30 text-xs font-medium transition-colors"
                  >
                    <Mic className="w-3.5 h-3.5" />
                    Simulate Vocal "HELP! / BACHAO!" Trigger
                  </button>
                  {simulatedAcoustic === 'listening' && (
                    <span className="text-xs text-amber-400 animate-pulse font-mono">
                      Evaluating decibels & audio phonemes...
                    </span>
                  )}
                  {simulatedAcoustic === 'detected' && (
                    <span className="text-xs text-red-400 font-bold font-mono">
                      High Confidence Threat Match (98.4%)!
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'command' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-400" />
                  PSIT Campus Security Command Console (Dispatcher)
                </h3>
                <p className="text-xs text-slate-400">
                  Real-time incoming SOS telemetry feeds & security patrol routing
                </p>
              </div>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-2.5 py-1 bg-slate-800 rounded border border-slate-700"
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                Siren {soundEnabled ? 'Enabled' : 'Muted'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-[11px] text-slate-400 uppercase font-semibold">Active Alerts</span>
                <p className="text-2xl font-bold font-mono text-red-400 mt-1">
                  {sosState === 'active' ? '1 ACTIVE CRITICAL' : '0 Pending'}
                </p>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-[11px] text-slate-400 uppercase font-semibold">Mean Response Latency</span>
                <p className="text-2xl font-bold font-mono text-emerald-400 mt-1">1.42s</p>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-[11px] text-slate-400 uppercase font-semibold">On-Duty Patrols</span>
                <p className="text-2xl font-bold font-mono text-blue-400 mt-1">4 Sector Units</p>
              </div>
            </div>

            {/* Active Ticket Card */}
            {sosState === 'active' ? (
              <div className="p-4 bg-red-950/40 border border-red-500/50 rounded-xl space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                    <h4 className="text-sm font-bold text-red-200 uppercase">
                      Incoming SOS Distress Beacon #INC-2026-904
                    </h4>
                  </div>
                  <span className="text-xs font-mono text-red-400 bg-red-900/60 px-2 py-0.5 rounded">
                    Severity: HIGH PRIORITY
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-950/80 p-3 rounded-lg border border-slate-800">
                  <div>
                    <span className="text-slate-500">Student:</span>
                    <p className="font-semibold text-white">{studentLeaderName}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Location Geofence:</span>
                    <p className="font-semibold text-white">{selectedZone}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Assigned Patrol Unit:</span>
                    <p className="font-semibold text-emerald-400">Patrol Beta-2 (ETA: 1.2 min)</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSosState('resolved')}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold"
                  >
                    Acknowledge & Dispatch Sector Officer
                  </button>
                  <button
                    onClick={() => alert(`Dispatched emergency SMS with live coordinate link to registered guardian numbers.`)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-semibold"
                  >
                    Simulate SMS Broadcast
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-950/40 rounded-xl border border-slate-800 text-slate-400 text-xs">
                No active distress beacons. Switch to "Student SOS App" tab to simulate an emergency trigger.
              </div>
            )}
          </div>
        )}

        {activeTab === 'safewalk' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-600/20 text-emerald-400">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">SafeWalk Virtual Guardian Network</h3>
                <p className="text-xs text-slate-400">
                  Continuous breadcrumb streaming for students crossing campus late at night
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-2">
                <span className="font-semibold text-slate-300">Route Overview:</span>
                <p className="text-slate-400">
                  Library reading hall → Academic Block B → Girls Hostel 3
                </p>
                <div className="p-3 bg-slate-900 rounded border border-slate-800 space-y-1 font-mono text-[11px] text-slate-300">
                  <p>• Ping 03:15 AM: Departure recorded at Central Library</p>
                  <p>• Ping 03:18 AM: Passing Bhauti lawn walkway (Nominal)</p>
                  <p>• Ping 03:22 AM: Approaching Hostel Block checkpoint</p>
                </div>
              </div>

              <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 rounded space-y-2">
                <span className="font-semibold text-emerald-300">Guardian Watchlist Active:</span>
                <p className="text-slate-400">
                  2 trusted peers and campus warden receiving encrypted location heartbeats every 10 seconds.
                </p>
                <div className="text-[11px] text-slate-300 space-y-1">
                  <p>✓ Automated check-in deadline: 15 minutes</p>
                  <p>✓ Inactivity motion detector: Active</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
