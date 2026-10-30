import type { EmergencyReport, ReportStatus, Role, User } from '../types/emergency';
import type { SignUpDetails, SignUpResult } from '../components/LoginPage';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/api${path}`, {
    ...init,
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers
    }
  });
  const body = await response.json() as T & { error?: string };
  if (!response.ok) {
    throw new Error(body.error ?? `Request failed (${response.status}).`);
  }
  return body;
}

export async function getCurrentUser(): Promise<User | null> {
  const result = await request<{ user: User | null }>('/session');
  return result.user;
}

export async function getReports(): Promise<EmergencyReport[]> {
  const result = await request<{ reports: EmergencyReport[] }>('/reports');
  return result.reports;
}

export async function signIn(email: string, password: string, role: Role): Promise<User> {
  const result = await request<{ user: User }>('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password, role })
  });
  return result.user;
}

export async function signUp(
  email: string,
  password: string,
  details: SignUpDetails
): Promise<{ user: User } & SignUpResult> {
  const result = await request<{ user: User } & SignUpResult>('/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, ...details })
  });
  return result;
}

export interface AdminRegistrationDetails {
  email: string;
  password: string;
  username: string;
  fullName: string;
  department: string;
  phone: string;
}

export async function registerAdmin(details: AdminRegistrationDetails): Promise<void> {
  await request<{ user: User }>('/admins', {
    method: 'POST',
    body: JSON.stringify(details)
  });
}

export interface AdminInviteRegistrationDetails extends AdminRegistrationDetails {
  inviteCode: string;
}

export async function registerAdminWithInvite(
  details: AdminInviteRegistrationDetails
): Promise<void> {
  await request<{ user: User }>('/admin-registration', {
    method: 'POST',
    body: JSON.stringify(details)
  });
}

export async function signOut(): Promise<void> {
  await request<{ ok: boolean }>('/logout', { method: 'POST' });
}

export async function createReport(report: EmergencyReport): Promise<EmergencyReport> {
  const result = await request<{ report: EmergencyReport }>('/reports', {
    method: 'POST',
    body: JSON.stringify(report)
  });
  return result.report;
}

export async function updateReport(
  id: string,
  status: ReportStatus,
  adminNotes: string
): Promise<EmergencyReport> {
  const result = await request<{ report: EmergencyReport }>(`/reports/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify({ status, adminNotes })
  });
  return result.report;
}
