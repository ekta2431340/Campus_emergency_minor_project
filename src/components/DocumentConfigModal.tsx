import { useState } from 'react';
import { ProjectData, Student } from '../types/project';
import { X, ArrowUp, ArrowDown, Plus, Trash2, Check, RotateCcw } from 'lucide-react';

export function DocumentConfigModal({
  isOpen,
  onClose,
  data,
  onChange,
  onReset
}: {
  isOpen: boolean;
  onClose: () => void;
  data: ProjectData;
  onChange: (updated: ProjectData) => void;
  onReset: () => void;
}) {
  const [baseRoll, setBaseRoll] = useState('22005011001');
  const [prefix, setPrefix] = useState('');
  const [savedNotice, setSavedNotice] = useState(false);

  if (!isOpen) return null;

  const triggerSaveNotice = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  const updateStudent = (id: string, field: keyof Student, value: string) => {
    const updated = data.students.map((s) =>
      s.id === id ? { ...s, [field]: value } : s
    );
    onChange({ ...data, students: updated });
    triggerSaveNotice();
  };

  const moveStudent = (index: number, direction: 'up' | 'down') => {
    const newStudents = [...data.students];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= newStudents.length) return;
    const temp = newStudents[index];
    newStudents[index] = newStudents[target];
    newStudents[target] = temp;
    onChange({ ...data, students: newStudents });
    triggerSaveNotice();
  };

  const applySequence = () => {
    const startNum = parseInt(baseRoll.replace(/\D/g, ''), 10);
    if (isNaN(startNum)) return;
    const updated = data.students.map((s, idx) => {
      const generated = (startNum + idx).toString();
      return { ...s, rollNo: prefix ? `${prefix}${generated}` : generated };
    });
    onChange({ ...data, students: updated });
    triggerSaveNotice();
  };

  const addStudent = () => {
    const nextRoll = (parseInt(data.students[data.students.length - 1]?.rollNo || '22005011001', 10) + 1).toString();
    const newStudent: Student = {
      id: `std-${Date.now()}`,
      name: `Student ${data.students.length + 1}`,
      rollNo: nextRoll,
      status: 'Present',
      signature: `Student ${data.students.length + 1}`,
      grade: 'A'
    };
    onChange({ ...data, students: [...data.students, newStudent] });
    triggerSaveNotice();
  };

  const removeStudent = (id: string) => {
    if (data.students.length <= 1) return;
    onChange({ ...data, students: data.students.filter((s) => s.id !== id) });
    triggerSaveNotice();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto no-print">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-300 w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 rounded-t-xl">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Document Properties & Team Roll Number Sequence
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Updates reflect immediately across all 21 pages of the official Progress Diary.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {savedNotice && (
              <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                <Check className="w-3.5 h-3.5" />
                Updated
              </span>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-800">
          {/* Quick Roll Number Sequencer */}
          <div className="bg-slate-100 p-4 rounded-lg border border-slate-300">
            <span className="font-bold text-slate-900 block mb-1">
              Sequential Roll Number Generator
            </span>
            <p className="text-slate-600 mb-3 text-[11px]">
              Set starting roll number to automatically assign sequential roll numbers to all members in order:
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-0.5">Start Roll No</label>
                <input
                  type="text"
                  value={baseRoll}
                  onChange={(e) => setBaseRoll(e.target.value)}
                  className="bg-white border border-slate-300 rounded px-2.5 py-1 text-xs font-mono w-40"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-0.5">Prefix (Optional)</label>
                <input
                  type="text"
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value)}
                  placeholder="e.g. 2200-"
                  className="bg-white border border-slate-300 rounded px-2.5 py-1 text-xs font-mono w-28"
                />
              </div>
              <div className="pt-4">
                <button
                  onClick={applySequence}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-medium"
                >
                  Apply Sequential Numbers
                </button>
              </div>
            </div>
          </div>

          {/* Team Members Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-slate-900 text-sm">Team Members & Roll Number Sequence</span>
              <button
                onClick={addStudent}
                className="flex items-center gap-1 text-xs text-blue-700 font-semibold hover:underline"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Member
              </button>
            </div>

            <table className="w-full border-collapse border border-slate-300 text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-semibold text-center">
                  <th className="border border-slate-300 py-1.5 px-2 w-12">Seq</th>
                  <th className="border border-slate-300 py-1.5 px-3 text-left">Student Full Name</th>
                  <th className="border border-slate-300 py-1.5 px-3 w-40">Roll Number</th>
                  <th className="border border-slate-300 py-1.5 px-2 w-28">Meeting Status</th>
                  <th className="border border-slate-300 py-1.5 px-2 w-20">Grade</th>
                  <th className="border border-slate-300 py-1.5 px-2 w-24">Reorder</th>
                  <th className="border border-slate-300 py-1.5 px-2 w-10">Del</th>
                </tr>
              </thead>
              <tbody>
                {data.students.map((student, idx) => (
                  <tr key={student.id}>
                    <td className="border border-slate-300 py-1 px-2 text-center font-bold text-slate-600">
                      #{idx + 1}
                    </td>
                    <td className="border border-slate-300 py-1 px-2">
                      <input
                        type="text"
                        value={student.name}
                        onChange={(e) => updateStudent(student.id, 'name', e.target.value)}
                        className="w-full border border-slate-300 rounded px-2 py-1 text-xs font-medium text-slate-900"
                      />
                    </td>
                    <td className="border border-slate-300 py-1 px-2">
                      <input
                        type="text"
                        value={student.rollNo}
                        onChange={(e) => updateStudent(student.id, 'rollNo', e.target.value)}
                        className="w-full border border-slate-300 rounded px-2 py-1 text-xs font-mono font-medium text-slate-900"
                      />
                    </td>
                    <td className="border border-slate-300 py-1 px-2">
                      <select
                        value={student.status}
                        onChange={(e) => updateStudent(student.id, 'status', e.target.value as 'Present' | 'Absent')}
                        className="w-full border border-slate-300 rounded px-1.5 py-1 text-xs bg-white"
                      >
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                      </select>
                    </td>
                    <td className="border border-slate-300 py-1 px-2">
                      <select
                        value={student.grade || 'A+'}
                        onChange={(e) => updateStudent(student.id, 'grade', e.target.value)}
                        className="w-full border border-slate-300 rounded px-1.5 py-1 text-xs font-bold bg-white"
                      >
                        <option value="A+">A+</option>
                        <option value="A">A</option>
                        <option value="B+">B+</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                      </select>
                    </td>
                    <td className="border border-slate-300 py-1 px-2 text-center">
                      <div className="flex justify-center gap-1">
                        <button
                          onClick={() => moveStudent(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1 rounded hover:bg-slate-200 disabled:opacity-20"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => moveStudent(idx, 'down')}
                          disabled={idx === data.students.length - 1}
                          className="p-1 rounded hover:bg-slate-200 disabled:opacity-20"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                    <td className="border border-slate-300 py-1 px-2 text-center">
                      <button
                        onClick={() => removeStudent(student.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Project Details Fields */}
          <div className="pt-4 border-t border-slate-200">
            <span className="font-bold text-slate-900 text-sm block mb-3">
              Project Identification & Faculty
            </span>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-1">Project Title</label>
                <input
                  type="text"
                  value={data.projectTitle}
                  onChange={(e) => onChange({ ...data, projectTitle: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-900"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-1">Project ID</label>
                <input
                  type="text"
                  value={data.projectId}
                  onChange={(e) => onChange({ ...data, projectId: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs font-mono text-slate-900"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-1">Supervisor Name</label>
                <input
                  type="text"
                  value={data.supervisorName}
                  onChange={(e) => onChange({ ...data, supervisorName: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-900"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-1">Supervisor Designation</label>
                <input
                  type="text"
                  value={data.supervisorDesignation}
                  onChange={(e) => onChange({ ...data, supervisorDesignation: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-900"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 flex justify-between items-center bg-slate-50 rounded-b-xl">
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset to Default
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 text-white rounded text-xs font-semibold hover:bg-slate-800"
          >
            Done & Return to Document
          </button>
        </div>
      </div>
    </div>
  );
}
