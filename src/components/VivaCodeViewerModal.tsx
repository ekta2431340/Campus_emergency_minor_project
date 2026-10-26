import { useState } from 'react';
import { X, Code, Database, Check, Play } from 'lucide-react';
import { classifyEmergency } from '../utils/classifier';

export function VivaCodeViewerModal({
  isOpen,
  onClose
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState<'python' | 'sqlite' | 'tester'>('python');
  const [testCategory, setTestCategory] = useState<'Medical Emergency' | 'Fire' | 'Security Issue' | 'Accident' | 'Other'>('Medical Emergency');
  const [testDesc, setTestDesc] = useState<string>('Student is unconscious and fainted near the staircase.');
  const [testResult, setTestResult] = useState(() => classifyEmergency(testCategory, testDesc));

  if (!isOpen) return null;

  const runTest = () => {
    setTestResult(classifyEmergency(testCategory, testDesc));
  };

  const pythonScript = `"""
Campus Emergency System - classify_emergency.py
Language: Python 3 | BCA Final Year Project
"""

HIGH_PRIORITY_KEYWORDS = [
    "fire", "smoke", "burning", "blast", "explosion",
    "unconscious", "fainted", "not breathing", "heart attack", "chest pain",
    "severe bleeding", "fracture", "head injury", "collapsed", "stroke",
    "weapon", "knife", "gun", "assault", "physical attack", "violence",
    "trapped", "stuck in lift", "drowning", "electrocution", "poison", "immediate danger"
]

MEDIUM_PRIORITY_KEYWORDS = [
    "injury", "accident", "fall", "bleeding", "dizzy", "asthma",
    "theft", "stolen", "harassment", "stalking", "ragging", "threat",
    "water leak", "short circuit", "spark", "gas smell"
]

def classify_emergency(category: str, description: str) -> dict:
    desc_lower = description.lower()
    matched_high = [kw for kw in HIGH_PRIORITY_KEYWORDS if kw in desc_lower]
    matched_medium = [kw for kw in MEDIUM_PRIORITY_KEYWORDS if kw in desc_lower]
    
    if category in ["Fire"]:
        priority = "High"
        reason = "Fire emergencies are life-critical by default."
    elif matched_high:
        priority = "High"
        reason = f"High-priority critical keywords: {', '.join(matched_high)}"
    elif matched_medium or category in ["Medical Emergency", "Security Issue", "Accident"]:
        priority = "Medium"
        reason = f"Medium-priority urgency: {', '.join(matched_medium) if matched_medium else category}"
    else:
        priority = "Low"
        reason = "Standard reporting without life-safety threat keywords."
        
    return {"priority": priority, "matched_keywords": matched_high + matched_medium, "reason": reason}`;

  const sqliteSchema = `-- Campus Emergency System - SQLite Database Schema
-- File: database_setup.py (campus_emergency.db)

CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('student', 'admin')),
    roll_no TEXT,
    department TEXT,
    phone TEXT,
    email TEXT
);

CREATE TABLE emergency_reports (
    id TEXT PRIMARY KEY,
    student_username TEXT NOT NULL,
    student_name TEXT NOT NULL,
    roll_no TEXT,
    category TEXT NOT NULL CHECK(category IN ('Medical Emergency', 'Fire', 'Security Issue', 'Accident', 'Other')),
    location TEXT NOT NULL,
    description TEXT NOT NULL,
    priority TEXT NOT NULL CHECK(priority IN ('High', 'Medium', 'Low')),
    status TEXT NOT NULL DEFAULT 'Submitted' CHECK(status IN ('Submitted', 'In Progress', 'Resolved')),
    classification_reason TEXT,
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_username) REFERENCES users(username)
);`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 text-white rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center">
              <Code className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                BCA Project Viva Reference & Architecture
              </h3>
              <p className="text-xs text-slate-400">
                Campus Emergency System · Python Keyword Logic & SQLite Database
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 bg-slate-950 px-6 pt-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('python')}
            className={`px-4 py-2 border-b-2 transition-colors ${
              activeTab === 'python'
                ? 'border-blue-500 text-white'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Python Classifier (classify_emergency.py)
          </button>

          <button
            onClick={() => setActiveTab('sqlite')}
            className={`px-4 py-2 border-b-2 transition-colors ${
              activeTab === 'sqlite'
                ? 'border-blue-500 text-white'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            SQLite Schema (database_setup.py)
          </button>

          <button
            onClick={() => setActiveTab('tester')}
            className={`px-4 py-2 border-b-2 transition-colors ${
              activeTab === 'tester'
                ? 'border-blue-500 text-white'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Live Viva Tester
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto max-h-[65vh] text-xs">
          {activeTab === 'python' && (
            <div className="space-y-3">
              <div className="p-3 bg-blue-950/40 border border-blue-800/60 rounded-xl text-blue-200">
                <strong className="text-white block mb-1">Examiner Explanation Note:</strong>
                This simple Python algorithm checks for life-threatening keywords (e.g., <em>fire, unconscious, bleeding, explosion</em>) using standard sub-string searches in $O(N)$ time complexity. No complex or fragile AI is used, making it deterministic, transparent, and easy to justify in an examination.
              </div>
              <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] text-emerald-300 overflow-x-auto leading-relaxed">
                {pythonScript}
              </pre>
            </div>
          )}

          {activeTab === 'sqlite' && (
            <div className="space-y-3">
              <div className="p-3 bg-blue-950/40 border border-blue-800/60 rounded-xl text-blue-200">
                <strong className="text-white block mb-1">Database Architecture:</strong>
                Relational schema in SQLite3 with normalized tables for <code>users</code> and <code>emergency_reports</code>, with foreign key integrity, check constraints, and timestamps.
              </div>
              <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] text-cyan-300 overflow-x-auto leading-relaxed">
                {sqliteSchema}
              </pre>
            </div>
          )}

          {activeTab === 'tester' && (
            <div className="space-y-4">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <span className="font-bold text-white block">Test Any Emergency Phrase:</span>
                <div>
                  <label className="text-slate-400 block mb-1">Category:</label>
                  <select
                    value={testCategory}
                    onChange={(e) => setTestCategory(e.target.value as typeof testCategory)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                  >
                    <option value="Medical Emergency">Medical Emergency</option>
                    <option value="Fire">Fire</option>
                    <option value="Security Issue">Security Issue</option>
                    <option value="Accident">Accident</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Description:</label>
                  <input
                    type="text"
                    value={testDesc}
                    onChange={(e) => setTestDesc(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>

                <button
                  onClick={runTest}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Execute Classification</span>
                </button>
              </div>

              {/* Output */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <span className="text-slate-400 font-bold block">Python Function Output:</span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Assigned Priority:</span>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                      testResult.priority === 'High'
                        ? 'bg-red-600 text-white'
                        : testResult.priority === 'Medium'
                        ? 'bg-amber-600 text-white'
                        : 'bg-slate-700 text-slate-200'
                    }`}
                  >
                    {testResult.priority}
                  </span>
                </div>
                <p className="text-slate-300">
                  <strong>Reason: </strong>{testResult.reason}
                </p>
                {testResult.matchedKeywords.length > 0 && (
                  <p className="text-slate-400">
                    <strong>Matched Keywords: </strong>{testResult.matchedKeywords.join(', ')}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 flex justify-end bg-slate-950">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
