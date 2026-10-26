import { User, EmergencyReport } from '../types/emergency';

export const INITIAL_USERS: User[] = [
  {
    id: 'u-1',
    username: 'student1',
    role: 'student',
    fullName: 'Musskan Verma',
    rollNo: '22005011001',
    department: 'BCA (Dept. of Computer Applications)',
    phone: '+91 98765 43210',
    email: 'musskan.verma@campus.edu'
  },
  {
    id: 'u-2',
    username: 'student2',
    role: 'student',
    fullName: 'Aman Gupta',
    rollNo: '22005011002',
    department: 'BCA (Dept. of Computer Applications)',
    phone: '+91 98765 43211',
    email: 'aman.gupta@campus.edu'
  },
  {
    id: 'u-3',
    username: 'student3',
    role: 'student',
    fullName: 'Ananya Dixit',
    rollNo: '22005011003',
    department: 'BCA (Dept. of Computer Applications)',
    phone: '+91 98765 43212',
    email: 'ananya.dixit@campus.edu'
  },
  {
    id: 'u-4',
    username: 'student4',
    role: 'student',
    fullName: 'Ayush Srivastava',
    rollNo: '22005011004',
    department: 'BCA (Dept. of Computer Applications)',
    phone: '+91 98765 43213',
    email: 'ayush.srivastava@campus.edu'
  },
  {
    id: 'u-admin',
    username: 'admin',
    role: 'admin',
    fullName: 'Chief Proctor & Security Administrator',
    rollNo: 'STAFF-041',
    department: 'Campus Security & Emergency Response Unit',
    phone: '+91 512 269 6400',
    email: 'emergency.admin@campus.edu'
  }
];

export const INITIAL_REPORTS: EmergencyReport[] = [
  {
    id: 'CES-2026-101',
    studentUsername: 'student1',
    studentName: 'Musskan Verma',
    rollNo: '22005011001',
    category: 'Medical Emergency',
    location: 'Academic Block B - 2nd Floor Corridor (Near Lab 4)',
    description: 'A student fainted and is unconscious on the floor. Breathing is irregular, immediate medical assistance requested.',
    priority: 'High',
    status: 'In Progress',
    matchedKeywords: ['unconscious', 'fainted'],
    classificationReason: 'Critical high-urgency keywords detected: unconscious, fainted',
    adminNotes: 'Campus medical van dispatched with nurse at 10:45 AM. Guard Manoj Tiwari on site.',
    submittedAt: '2026-10-23 10:42 AM',
    updatedAt: '2026-10-23 10:45 AM'
  },
  {
    id: 'CES-2026-102',
    studentUsername: 'student1',
    studentName: 'Musskan Verma',
    rollNo: '22005011001',
    category: 'Security Issue',
    location: 'Central Library Basement Reading Hall',
    description: 'Unidentified individual loitering around backpacks and acting suspicious near student lockers.',
    priority: 'Medium',
    status: 'Submitted',
    matchedKeywords: ['security issue'],
    classificationReason: 'Elevated priority automatically assigned for category: Security Issue',
    submittedAt: '2026-10-23 11:15 AM'
  },
  {
    id: 'CES-2026-103',
    studentUsername: 'student2',
    studentName: 'Aman Gupta',
    rollNo: '22005011002',
    category: 'Fire',
    location: 'Chemistry Laboratory 2 - Ground Floor',
    description: 'Electrical short circuit near chemical fume hood with black smoke spreading fast.',
    priority: 'High',
    status: 'In Progress',
    matchedKeywords: ['smoke', 'fire', 'short circuit'],
    classificationReason: 'Fire emergencies are flagged as High Priority by default for life safety.',
    adminNotes: 'Fire extinguishers deployed. Main power breaker tripped. Evacuating Lab 2.',
    submittedAt: '2026-10-23 09:30 AM',
    updatedAt: '2026-10-23 09:33 AM'
  },
  {
    id: 'CES-2026-104',
    studentUsername: 'student2',
    studentName: 'Aman Gupta',
    rollNo: '22005011002',
    category: 'Accident',
    location: 'Sports Complex Basketball Court',
    description: 'Student fell heavily during basketball match, suspected ankle fracture and severe pain.',
    priority: 'High',
    status: 'Resolved',
    matchedKeywords: ['fracture', 'accident', 'fall'],
    classificationReason: 'Critical high-urgency keywords detected: fracture',
    adminNotes: 'First aid applied with ice splint. Patient shifted to college dispensary. Resolved.',
    submittedAt: '2026-10-22 04:15 PM',
    updatedAt: '2026-10-22 04:45 PM'
  },
  {
    id: 'CES-2026-105',
    studentUsername: 'student1',
    studentName: 'Musskan Verma',
    rollNo: '22005011001',
    category: 'Other',
    location: 'Girls Hostel 2 Entrance Gate',
    description: 'Street light lamp pole sparking continuously in light drizzle.',
    priority: 'Medium',
    status: 'Resolved',
    matchedKeywords: ['spark'],
    classificationReason: 'Medium-urgency keywords detected: spark',
    adminNotes: 'Electrician repaired insulated wiring. Operational and safe.',
    submittedAt: '2026-10-21 07:20 PM',
    updatedAt: '2026-10-21 08:00 PM'
  }
];

export const CAMPUS_LOCATIONS = [
  'Academic Block A - Foyer & Classrooms',
  'Academic Block B - Computer Labs (Labs 1-6)',
  'Central Library & Digital Reading Room',
  'Girls Hostel 1 (Ground & Upper Floors)',
  'Girls Hostel 2 (Entrance & Dining Area)',
  'Boys Hostel 1 & Courtyard',
  'Boys Hostel 2 & Common Room',
  'Central Cafeteria & Food Court',
  'Sports Complex & Gymnasium',
  'Main Security Gate 1 (NH-19 Highway Entry)',
  'Security Gate 2 (Rear Parking Area)',
  'College Dispensary & Medical Center',
  'Auditorium & Conference Block'
];
