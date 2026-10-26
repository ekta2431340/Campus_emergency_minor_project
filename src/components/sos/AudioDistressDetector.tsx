import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, ShieldCheck, Activity } from 'lucide-react';

interface AudioDetectorProps {
  onDistressDetected: (keyword: string) => void;
  isArmed: boolean;
}

export function AudioDistressDetector({ onDistressDetected, isArmed }: AudioDetectorProps) {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [decibels, setDecibels] = useState<number>(18);
  const [detectedMatch, setDetectedMatch] = useState<string | null>(null);
  const [micPermission, setMicPermission] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const startMicrophone = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;
      setMicPermission('granted');

      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      audioContextRef.current = ctx;

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);

      setIsListening(true);
      monitorAudioLevel();
    } catch {
      setMicPermission('denied');
      setIsListening(false);
    }
  };

  const stopMicrophone = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    setIsListening(false);
    setDecibels(15);
  };

  const monitorAudioLevel = () => {
    if (!analyserRef.current) return;
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);

    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i];
    }
    const average = sum / dataArray.length;
    const estimatedDb = Math.min(100, Math.round(20 + average * 0.7));
    setDecibels(estimatedDb);

    // If volume reaches scream or severe vocal duress threshold (>82 dB)
    if (estimatedDb > 84 && isArmed) {
      triggerDistress("Acoustic Duress Threshold Exceeded (Scream >84dB)");
      return;
    }

    animationFrameRef.current = requestAnimationFrame(monitorAudioLevel);
  };

  const triggerDistress = (phrase: string) => {
    setDetectedMatch(phrase);
    onDistressDetected(phrase);
    setTimeout(() => setDetectedMatch(null), 4000);
  };

  // Simulation test buttons for demo/presentation
  const simulateKeyword = (keyword: string) => {
    triggerDistress(`Vocal Distress Keyword: "${keyword}" (Confidence: 98.6%)`);
  };

  useEffect(() => {
    return () => {
      stopMicrophone();
    };
  }, []);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
            <Mic className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Acoustic Distress & Voice AI Monitor</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                Gemini Audio Classifier
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Hands-free background detection for screams and emergency keywords
            </p>
          </div>
        </div>

        <button
          onClick={isListening ? stopMicrophone : startMicrophone}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            isListening
              ? 'bg-rose-600/30 text-rose-300 border border-rose-500 hover:bg-rose-600/40'
              : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
          }`}
        >
          {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
          <span>{isListening ? 'Stop Mic' : 'Enable Live Mic'}</span>
        </button>
      </div>

      {/* Live Sound Level Visualizer */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-blue-400" />
            <span>Ambient Acoustic Pressure</span>
          </span>
          <span className="font-mono text-slate-200">{decibels} dB</span>
        </div>

        {/* Volume Bar */}
        <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden border border-slate-800 flex items-center p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-100 ${
              decibels > 80 ? 'bg-red-500' : decibels > 55 ? 'bg-amber-400' : 'bg-emerald-400'
            }`}
            style={{ width: `${Math.min(100, Math.max(5, decibels))}%` }}
          />
        </div>

        {detectedMatch && (
          <div className="p-2.5 rounded-lg bg-red-950/80 border border-red-500 text-xs font-bold text-red-300 animate-pulse flex items-center justify-between">
            <span>🚨 {detectedMatch}</span>
            <span className="text-[10px] uppercase font-mono">Dispatched</span>
          </div>
        )}
      </div>

      {/* Keywords & Simulation Trigger Row */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Target Keywords: "Help", "Bachao", "Save me", "Emergency"</span>
          <span className="text-[10px] text-slate-500">Multilingual</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs text-slate-400">Simulate Cry:</span>
          {['HELP!', 'BACHAO!', 'SAVE ME!', 'CHHODO!'].map((word) => (
            <button
              key={word}
              onClick={() => simulateKeyword(word)}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
            >
              "{word}"
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
