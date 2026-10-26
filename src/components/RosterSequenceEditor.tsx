import { useState } from 'react';
import { ProjectData, Student } from '../types/project';
import { ArrowUp, ArrowDown, Plus, Trash2, Hash, RotateCcw, Check } from 'lucide-react';

export function RosterSequenceEditor({
  data,
  onChange,
  onReset
}: {
  data: ProjectData;
  onChange: (updated: ProjectData) => void;
  onReset: () => void;
}) {
  const [baseRoll, setBaseRoll] = useState('22005011001');
  const [prefix, setPrefix] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const triggerNotify = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const updateStudent = (id: string, field: keyof Student, value: string) => {
    const updatedStudents = data.students.map((s) =>
      s.id === id ? { ...s, [field]: value } : s
    );
    onChange({ ...data, students: updatedStudents });
  };

  const moveStudent = (index: number, direction: 'up' | 'down') => {
    const newStudents = [...data.students];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newStudents.length) return;
    const temp = newStudents[index];
    newStudents[index] = newStudents[targetIndex];
    newStudents[targetIndex] = temp;
    onChange({ ...data, students: newStudents });
    triggerNotify('Sequence order changed');
  };

  const applySequentialRollNumbers = () => {
    const startNum = parseInt(baseRoll.replace(/\D/g, ''), 10);
    if (isNaN(startNum)) {
      alert('Please enter a valid numeric starting roll number.');
      return;
    }
    const updatedStudents = data.students.map((s, idx) => {
      const generated = (startNum + idx).toString();
      const finalRoll = prefix ? `${prefix}${generated}` : generated;
      return { ...s, rollNo: finalRoll };
    });
    onChange({ ...data, students: updatedStudents });
    triggerNotify(`Applied sequential roll numbers from ${baseRoll}`);
  };

  const addStudent = () => {
    const newId = `std-${Date.now()}`;
    const nextRoll = (parseInt(data.students[data.students.length - 1]?.rollNo || '22005011001', 10) + 1).toString();
    const newStudent: Student = {
      id: newId,
      name: `Student ${data.students.length + 1}`,
      rollNo: nextRoll,
      status: 'Present',
      signature: `Student ${data.students.length + 1}`,
      grade: 'A'
    };
    onChange({ ...data, students: [...data.students, newStudent] });
    triggerNotify('Student added to roster');
  };

  const removeStudent = (id: string) => {
    if (data.students.length <= 1) {
      alert('Must have at least 1 student in the project group.');
      return;
    }
    onChange({
      ...data,
      students: data.students.filter((s) => s.id !== id)
    });
    triggerNotify('Student removed from roster');
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 max-w-4xl mx-auto my-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-5 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Project & Roll Number Sequence Manager
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Update student names, rearrange the sequence order, and generate custom sequential roll numbers. Changes sync instantly across all 21 pages.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {successMsg && (
            <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
              <Check className="w-3.5 h-3.5" />
              {successMsg}
            </span>
          )}
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset to Default
          </button>
        </div>
      </div>

      {/* Quick Sequential Roll Number Generator */}
      <div className="bg-blue-50/70 border border-blue-200 rounded-lg p-4 my-5">
        <div className="flex items-center gap-2 mb-2 text-blue-950 font-semibold text-sm">
          <Hash className="w-4 h-4 text-blue-700" />
          <span>Quick Roll Number Sequence Generator</span>
        </div>
        <p className="text-xs text-blue-800 mb-3">
          Set your college starting roll number. Click "Apply Sequence" to auto-increment roll numbers for all team members in order.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-slate-700">Start Roll No:</label>
            <input
              type="text"
              value={baseRoll}
              onChange={(e) => setBaseRoll(e.target.value)}
              placeholder="e.g. 22005011001"
              className="bg-white border border-slate-300 rounded-md px-3 py-1.5 text-xs font-mono text-slate-900 w-40 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-slate-700">Prefix (optional):</label>
            <input
              type="text"
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
              placeholder="e.g. BCA-"
              className="bg-white border border-slate-300 rounded-md px-2.5 py-1.5 text-xs font-mono text-slate-900 w-24 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <button
            onClick={applySequentialRollNumbers}
            className="px-4 py-1.5 text-xs font-medium bg-blue-700 text-white rounded-md hover:bg-blue-800 transition-colors shadow-sm"
          >
            Apply Sequence to All
          </button>
        </div>
      </div>

      {/* Student Roster Table */}
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px] bg-slate-50">
              <th className="py-2.5 px-3 w-16">Seq #</th>
              <th className="py-2.5 px-3">Student Full Name</th>
              <th className="py-2.5 px-3 w-40">Roll Number</th>
              <th className="py-2.5 px-3 w-28">Meeting Status</th>
              <th className="py-2.5 px-3 w-24">Supervisor Grade</th>
              <th className="py-2.5 px-3 w-28 text-center">Re-order</th>
              <th className="py-2.5 px-3 w-12 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.students.map((student, idx) => (
              <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-2 px-3 font-semibold text-slate-600">
                  #{idx + 1}
                </td>
                <td className="py-2 px-3">
                  <input
                    type="text"
                    value={student.name}
                    onChange={(e) => updateStudent(student.id, 'name', e.target.value)}
                    className="w-full border border-slate-300 rounded px-2 py-1 text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </td>
                <td className="py-2 px-3">
                  <input
                    type="text"
                    value={student.rollNo}
                    onChange={(e) => updateStudent(student.id, 'rollNo', e.target.value)}
                    className="w-full border border-slate-300 rounded px-2 py-1 text-xs font-mono font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </td>
                <td className="py-2 px-3">
                  <select
                    value={student.status}
                    onChange={(e) => updateStudent(student.id, 'status', e.target.value as 'Present' | 'Absent')}
                    className="w-full border border-slate-300 rounded px-2 py-1 text-xs text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                  >
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                  </select>
                </td>
                <td className="py-2 px-3">
                  <select
                    value={student.grade || 'A+'}
                    onChange={(e) => updateStudent(student.id, 'grade', e.target.value)}
                    className="w-full border border-slate-300 rounded px-2 py-1 text-xs font-bold text-blue-900 bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                  >
                    <option value="A+">A+ (Outstanding)</option>
                    <option value="A">A (Excellent)</option>
                    <option value="B+">B+ (Good)</option>
                    <option value="B">B (Average)</option>
                    <option value="C">C (Not Satisfactory)</option>
                  </select>
                </td>
                <td className="py-2 px-3 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() => moveStudent(idx, 'up')}
                      disabled={idx === 0}
                      title="Move student up in sequence"
                      className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-200 disabled:opacity-30 disabled:pointer-events-none"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => moveStudent(idx, 'down')}
                      disabled={idx === data.students.length - 1}
                      title="Move student down in sequence"
                      className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-200 disabled:opacity-30 disabled:pointer-events-none"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
                <td className="py-2 px-3 text-center">
                  <button
                    onClick={() => removeStudent(student.id)}
                    title="Remove student"
                    className="p-1 rounded text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mb-6">
        <button
          onClick={addStudent}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Student Member
        </button>
        <span className="text-xs text-slate-500">
          Total Members: {data.students.length} students
        </span>
      </div>

      {/* Project Metadata Fields */}
      <div className="pt-5 border-t border-slate-200">
        <h3 className="text-sm font-bold text-slate-900 mb-3">
          Project Metadata & Faculty Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-medium text-slate-700 mb-1">Project Title</label>
            <input
              type="text"
              value={data.projectTitle}
              onChange={(e) => onChange({ ...data, projectTitle: e.target.value })}
              className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Project Subtitle / Scope</label>
            <input
              type="text"
              value={data.projectSubtitle}
              onChange={(e) => onChange({ ...data, projectSubtitle: e.target.value })}
              className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Project ID</label>
            <input
              type="text"
              value={data.projectId}
              onChange={(e) => onChange({ ...data, projectId: e.target.value })}
              className="w-full border border-slate-300 rounded px-2.5 py-1.5 font-mono text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Group ID</label>
            <input
              type="text"
              value={data.groupId}
              onChange={(e) => onChange({ ...data, groupId: e.target.value })}
              className="w-full border border-slate-300 rounded px-2.5 py-1.5 font-mono text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Supervisor Name</label>
            <input
              type="text"
              value={data.supervisorName}
              onChange={(e) => onChange({ ...data, supervisorName: e.target.value })}
              className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Supervisor Designation</label>
            <input
              type="text"
              value={data.supervisorDesignation}
              onChange={(e) => onChange({ ...data, supervisorDesignation: e.target.value })}
              className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
