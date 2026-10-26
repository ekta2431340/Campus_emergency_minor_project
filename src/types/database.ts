type Profile = {
  id: string;
  username: string;
  full_name: string;
  role: 'student' | 'admin';
  roll_no: string | null;
  department: string | null;
  phone: string | null;
  email: string | null;
};

type EmergencyReportRow = {
  id: string;
  user_id: string;
  student_username: string;
  student_name: string;
  roll_no: string | null;
  category: 'Medical Emergency' | 'Fire' | 'Security Issue' | 'Accident' | 'Other';
  location: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Submitted' | 'In Progress' | 'Resolved';
  matched_keywords: string[];
  classification_reason: string;
  admin_notes: string | null;
  submitted_at: string;
  updated_at: string;
};

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'role'> & { role?: Profile['role'] };
        Update: Partial<Profile>;
        Relationships: [];
      };
      emergency_reports: {
        Row: EmergencyReportRow;
        Insert: Omit<
          EmergencyReportRow,
          'status' | 'matched_keywords' | 'admin_notes' | 'submitted_at' | 'updated_at'
        > & {
          status?: EmergencyReportRow['status'];
          matched_keywords?: string[];
          admin_notes?: string | null;
          submitted_at?: string;
          updated_at?: string;
        };
        Update: Partial<EmergencyReportRow>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
