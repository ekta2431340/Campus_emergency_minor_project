export interface Student {
  id: string;
  name: string;
  rollNo: string;
  signature?: string;
  status: 'Present' | 'Absent';
  grade?: string;
}

export interface WeeklyLog {
  weekNo: number;
  meetingDate: string;
  workDoneCurrent: string;
  workDoneNext: string;
  supervisorComments: string;
  supervisorSignatureDate: string;
}

export interface ScheduleItem {
  activity: string;
  deadline: string;
  incharge: string;
  document: string;
}

export interface SynopsisData {
  title: string;
  introduction: string;
  problemStatement: string;
  objectives: string[];
  systemArchitecture: string[];
  techStack: {
    frontend: string;
    backend: string;
    aiMl: string;
    database: string;
    apis: string;
  };
  keyModules: Array<{ name: string; desc: string }>;
  expectedOutcomes: string[];
  hardwareRequirements: string[];
  softwareRequirements: string[];
}

export interface ProjectData {
  projectTitle: string;
  projectSubtitle: string;
  subjectCode: string;
  session: string;
  groupId: string;
  projectId: string;
  course: string;
  collegeName: string;
  collegeAddress: string;
  universityName: string;
  departmentName: string;
  supervisorName: string;
  supervisorDesignation: string;
  hodName: string;
  projectType: string;
  supervisorOverallRemark: string;
  students: Student[];
  abstract: string;
  synopsis: SynopsisData;
  schedule: ScheduleItem[];
  weeklyLogs: WeeklyLog[];
}
