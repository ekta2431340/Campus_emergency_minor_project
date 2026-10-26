import { useState } from 'react';
import { UserProfile } from '../../types/sos';
import { X, Check, User, Phone, Shield, Hash, Plus, Trash2 } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onSave: (updatedUser: UserProfile) => void;
}

export function StudentProfileModal({
  isOpen,
  onClose,
  user,
  onSave
}: ProfileModalProps) {
  const [formData, setFormData] = useState<UserProfile>(user);
  const [savedNotice, setSavedNotice] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      onClose();
    }, 1000);
  };

  const incrementRollNumber = () => {
    const numericPart = formData.rollNo.replace(/\D/g, '');
    if (numericPart) {
      const nextNum = (parseInt(numericPart, 10) + 1).toString();
      setFormData({ ...formData, rollNo: nextNum });
    }
  };

  const addEmergencyContact = () => {
    setFormData({
      ...formData,
      emergencyContacts: [
        ...formData.emergencyContacts,
        { name: 'New Contact', relation: 'Guardian', phone: '+91 ' }
      ]
    });
  };

  const removeContact = (index: number) => {
    setFormData({
      ...formData,
      emergencyContacts: formData.emergencyContacts.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 text-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Student Safety Credentials & Profile</h2>
              <p className="text-xs text-slate-400">
                Transmitted automatically with distress beacons to PSIT Security Control
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSave} className="p-6 space-y-4 text-xs overflow-y-auto max-h-[75vh]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-400 font-semibold block mb-1">Student Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-slate-400 font-semibold">Roll Number</label>
                <button
                  type="button"
                  onClick={incrementRollNumber}
                  className="text-[10px] text-blue-400 hover:underline flex items-center gap-0.5"
                  title="Next sequence roll number"
                >
                  <Hash className="w-3 h-3" />
                  +1 Sequence
                </button>
              </div>
              <input
                type="text"
                value={formData.rollNo}
                onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="text-slate-400 font-semibold block mb-1">Department / Course</label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-slate-400 font-semibold block mb-1">Contact Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-slate-400 font-semibold block mb-1">Blood Group (Medical Card)</label>
              <select
                value={formData.bloodGroup}
                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {['O+ve', 'O-ve', 'A+ve', 'A-ve', 'B+ve', 'B-ve', 'AB+ve', 'AB-ve'].map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-slate-400 font-semibold block mb-1">Hostel Block & Room</label>
              <input
                type="text"
                value={`${formData.hostelBlock}, ${formData.roomNo}`}
                onChange={(e) => {
                  const parts = e.target.value.split(',');
                  setFormData({
                    ...formData,
                    hostelBlock: parts[0]?.trim() || formData.hostelBlock,
                    roomNo: parts[1]?.trim() || formData.roomNo
                  });
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Emergency Contacts (ICE) */}
          <div className="pt-3 border-t border-slate-800">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-slate-300">
                In Case of Emergency (ICE) Contacts
              </span>
              <button
                type="button"
                onClick={addEmergencyContact}
                className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                Add Contact
              </button>
            </div>

            <div className="space-y-2">
              {formData.emergencyContacts.map((contact, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800"
                >
                  <input
                    type="text"
                    value={contact.name}
                    onChange={(e) => {
                      const updated = [...formData.emergencyContacts];
                      updated[idx].name = e.target.value;
                      setFormData({ ...formData, emergencyContacts: updated });
                    }}
                    placeholder="Name"
                    className="flex-1 bg-transparent border-none text-white text-xs focus:outline-none"
                  />
                  <input
                    type="text"
                    value={contact.relation}
                    onChange={(e) => {
                      const updated = [...formData.emergencyContacts];
                      updated[idx].relation = e.target.value;
                      setFormData({ ...formData, emergencyContacts: updated });
                    }}
                    placeholder="Relation"
                    className="w-24 bg-transparent border-none text-slate-400 text-xs focus:outline-none"
                  />
                  <input
                    type="text"
                    value={contact.phone}
                    onChange={(e) => {
                      const updated = [...formData.emergencyContacts];
                      updated[idx].phone = e.target.value;
                      setFormData({ ...formData, emergencyContacts: updated });
                    }}
                    placeholder="Phone"
                    className="w-32 bg-transparent border-none text-slate-300 font-mono text-xs focus:outline-none"
                  />
                  {formData.emergencyContacts.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeContact(idx)}
                      className="p-1 text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center gap-1.5 transition-colors"
            >
              {savedNotice ? <Check className="w-4 h-4" /> : null}
              <span>{savedNotice ? 'Saved!' : 'Save Credentials'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
