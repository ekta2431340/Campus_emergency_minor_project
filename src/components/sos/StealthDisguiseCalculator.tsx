import { useState } from 'react';
import { EyeOff, Check, ArrowLeft } from 'lucide-react';
import { DistressIncident, UserProfile, CampusZone } from '../../types/sos';

interface StealthProps {
  user: UserProfile;
  selectedZone: CampusZone;
  onTriggerSos: (incident: DistressIncident) => void;
  onExitStealth: () => void;
}

export function StealthDisguiseCalculator({
  user,
  selectedZone,
  onTriggerSos,
  onExitStealth
}: StealthProps) {
  const [display, setDisplay] = useState<string>('0');
  const [prevVal, setPrevVal] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [silentSosSent, setSilentSosSent] = useState<boolean>(false);

  const handleNum = (n: string) => {
    setDisplay((d) => (d === '0' ? n : d + n));
  };

  const handleOp = (op: string) => {
    setPrevVal(parseFloat(display));
    setOperation(op);
    setDisplay('0');
  };

  const handleEqual = () => {
    // Secret trigger code: 911 or holding equal
    if (display === '911' || display === '112' || display === '100') {
      sendSilentEmergency();
      setDisplay('0');
      return;
    }

    if (prevVal === null || operation === null) return;
    const current = parseFloat(display);
    let result = 0;
    if (operation === '+') result = prevVal + current;
    if (operation === '-') result = prevVal - current;
    if (operation === '×') result = prevVal * current;
    if (operation === '÷') result = current !== 0 ? prevVal / current : 0;
    setDisplay(result.toString());
    setPrevVal(null);
    setOperation(null);
  };

  const handleClear = () => {
    setDisplay('0');
    setPrevVal(null);
    setOperation(null);
  };

  const sendSilentEmergency = () => {
    const silentIncident: DistressIncident = {
      id: `SILENT-${Math.floor(100 + Math.random() * 900)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      studentName: user.name,
      rollNo: user.rollNo,
      department: user.department,
      zone: selectedZone.name,
      lat: selectedZone.lat,
      lng: selectedZone.lng,
      xPercent: selectedZone.xPercent,
      yPercent: selectedZone.yPercent,
      emergencyType: 'Physical Threat / Harassment',
      severity: 'CRITICAL',
      status: 'DISPATCHED',
      assignedGuard: 'Silent Patrol Response (No Sirens)',
      etaMinutes: 1.2,
      batteryLevel: 65,
      medicalNotes: `DISGUISED COERCION TRIGGER. SILENT APPROACH MANDATORY.`
    };
    onTriggerSos(silentIncident);
    setSilentSosSent(true);
    setTimeout(() => setSilentSosSent(false), 3000);
  };

  return (
    <div className="bg-black text-white p-6 rounded-2xl max-w-sm mx-auto shadow-2xl border border-neutral-800 font-sans">
      <div className="flex items-center justify-between pb-3 text-xs text-neutral-400">
        <button
          onClick={onExitStealth}
          className="flex items-center gap-1 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit App</span>
        </button>

        <div className="flex items-center gap-1">
          <EyeOff className="w-3.5 h-3.5" />
          <span>Calculator Disguise</span>
          {silentSosSent && (
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-1" title="Silent SOS Transmitted" />
          )}
        </div>
      </div>

      {/* Calculator Display */}
      <div className="bg-neutral-900 rounded-xl p-4 text-right mb-4">
        <span className="text-3xl font-mono tracking-tight font-light truncate block">
          {display}
        </span>
      </div>

      {/* Calculator Keypad */}
      <div className="grid grid-cols-4 gap-2 text-sm font-semibold">
        <button onClick={handleClear} className="p-3.5 rounded-xl bg-neutral-800 text-amber-400">
          AC
        </button>
        <button onClick={() => handleOp('÷')} className="p-3.5 rounded-xl bg-neutral-800 text-amber-400">
          ÷
        </button>
        <button onClick={() => handleOp('×')} className="p-3.5 rounded-xl bg-neutral-800 text-amber-400">
          ×
        </button>
        <button onClick={() => handleOp('-')} className="p-3.5 rounded-xl bg-neutral-800 text-amber-400">
          -
        </button>

        <button onClick={() => handleNum('7')} className="p-3.5 rounded-xl bg-neutral-900 text-white">
          7
        </button>
        <button onClick={() => handleNum('8')} className="p-3.5 rounded-xl bg-neutral-900 text-white">
          8
        </button>
        <button onClick={() => handleNum('9')} className="p-3.5 rounded-xl bg-neutral-900 text-white">
          9
        </button>
        <button onClick={() => handleOp('+')} className="p-3.5 rounded-xl bg-neutral-800 text-amber-400">
          +
        </button>

        <button onClick={() => handleNum('4')} className="p-3.5 rounded-xl bg-neutral-900 text-white">
          4
        </button>
        <button onClick={() => handleNum('5')} className="p-3.5 rounded-xl bg-neutral-900 text-white">
          5
        </button>
        <button onClick={() => handleNum('6')} className="p-3.5 rounded-xl bg-neutral-900 text-white">
          6
        </button>
        <button
          onClick={sendSilentEmergency}
          title="Secret Silent SOS"
          className="p-3.5 rounded-xl bg-neutral-900 text-neutral-600 hover:text-red-400"
        >
          %
        </button>

        <button onClick={() => handleNum('1')} className="p-3.5 rounded-xl bg-neutral-900 text-white">
          1
        </button>
        <button onClick={() => handleNum('2')} className="p-3.5 rounded-xl bg-neutral-900 text-white">
          2
        </button>
        <button onClick={() => handleNum('3')} className="p-3.5 rounded-xl bg-neutral-900 text-white">
          3
        </button>
        <button
          onClick={handleEqual}
          className="row-span-2 p-3.5 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-lg"
        >
          =
        </button>

        <button
          onClick={() => handleNum('0')}
          className="col-span-2 p-3.5 rounded-xl bg-neutral-900 text-white"
        >
          0
        </button>
        <button onClick={() => handleNum('.')} className="p-3.5 rounded-xl bg-neutral-900 text-white">
          .
        </button>
      </div>

      <p className="text-[10px] text-neutral-500 text-center mt-3">
        Secret Code: Type <span className="font-mono text-neutral-400">911 =</span> or tap % to trigger discreet silent SOS.
      </p>
    </div>
  );
}
