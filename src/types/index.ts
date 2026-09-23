// ─── Priority & Status Enums ─────────────────────────────────────

export type PriorityLevel = 'normal' | 'high' | 'urgent';

export type CaseStatus =
  | 'new'
  | 'triaged'
  | 'clustered'
  | 'assigned'
  | 'in_progress'
  | 'waiting'
  | 'escalated'
  | 'resolved'
  | 'closed';

export type WorkflowType =
  | 'academic_extension'
  | 'wellbeing_checkin'
  | 'financial_support'
  | 'housing_support'
  | 'general_support';

export type WorkflowStatus =
  | 'pending'
  | 'in_progress'
  | 'waiting_approval'
  | 'approved'
  | 'rejected'
  | 'completed';

export type AppointmentStatus =
  | 'scheduled'
  | 'confirmed'
  | 'cancelled'
  | 'completed'
  | 'no_show';

export type StandbyStatus = 'waiting' | 'notified' | 'claimed' | 'expired';

export type NotificationType =
  | 'appointment_available'
  | 'extension_approved'
  | 'extension_rejected'
  | 'checkin_booked'
  | 'case_update'
  | 'standby_matched'
  | 'sla_warning'
  | 'general';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export type SupportCategory =
  | 'academic'
  | 'wellbeing'
  | 'financial'
  | 'housing'
  | 'career'
  | 'it'
  | 'general';

// ─── Core Entities ───────────────────────────────────────────────

export interface Student {
  id: string;
  name: string;
  email: string;
  program: string;
  year: number;
  avatar?: string;
  createdAt: string;
}

export interface Case {
  id: string;
  studentId: string;
  title: string;
  description: string;
  categories: SupportCategory[];
  priority: PriorityLevel;
  status: CaseStatus;
  masterIssueId?: string;
  createdAt: string;
  updatedAt: string;
  timeline: TimelineEvent[];
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  type: 'system' | 'ai' | 'staff' | 'student' | 'workflow';
  title: string;
  description: string;
  icon?: string;
}

export interface MasterIssue {
  id: string;
  title: string;
  category: SupportCategory;
  description: string;
  caseCount: number;
  trend: 'increasing' | 'stable' | 'decreasing';
  trendPercent: number;
  status: 'active' | 'monitoring' | 'resolved';
  commonRequest: string;
  suggestedAction: string;
  priorityBreakdown: {
    normal: number;
    high: number;
    urgent: number;
  };
  createdAt: string;
}

export interface Appointment {
  id: string;
  caseId: string;
  studentId: string;
  staffId: string;
  staffName: string;
  type: 'checkin_15min' | 'follow_up' | 'full_session';
  startTime: string;
  endTime: string;
  duration: number; // minutes
  status: AppointmentStatus;
}

export interface StandbyEntry {
  id: string;
  caseId: string;
  studentId: string;
  studentName: string;
  priority: PriorityLevel;
  eligibleService: string;
  requestedDuration: number;
  createdAt: string;
  status: StandbyStatus;
}

export interface Workflow {
  id: string;
  caseId: string;
  type: WorkflowType;
  status: WorkflowStatus;
  currentStep: string;
  steps: WorkflowStep[];
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'active' | 'completed' | 'skipped';
  completedAt?: string;
}

export interface Notification {
  id: string;
  studentId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
  createdAt: string;
}

export interface Approval {
  id: string;
  caseId: string;
  type: 'academic_extension' | 'financial_aid' | 'housing';
  requestDetails: string;
  approver: string;
  status: ApprovalStatus;
  newDeadline?: string;
  createdAt: string;
  resolvedAt?: string;
}

// ─── AI Triage ───────────────────────────────────────────────────

export interface TriageResult {
  summary: string;
  categories: SupportCategory[];
  situations: string[];
  entities: Record<string, string>;
  suggestedActions: string[];
  priority: PriorityLevel;
  confidence: number;
  priorityExplanation: string;
}

// ─── Staff ───────────────────────────────────────────────────────

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  department: string;
  avatar?: string;
}

// ─── Dashboard Stats ─────────────────────────────────────────────

export interface DashboardStats {
  activeCases: number;
  highPriority: number;
  urgent: number;
  waiting: number;
  availableSlots: number;
  standbyStudents: number;
  cancellationsToday: number;
  slaAtRisk: number;
}

// ─── While-You-Wait ──────────────────────────────────────────────

export interface WaitAction {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  url?: string;
}

// ─── App State ───────────────────────────────────────────────────

export interface AppState {
  currentStudent: Student;
  cases: Case[];
  masterIssues: MasterIssue[];
  appointments: Appointment[];
  standbyQueue: StandbyEntry[];
  notifications: Notification[];
  workflows: Workflow[];
  approvals: Approval[];
  triageResult: TriageResult | null;
  isStudentMode: boolean;
}

export type AppAction =
  | { type: 'SET_TRIAGE_RESULT'; payload: TriageResult }
  | { type: 'ADD_CASE'; payload: Case }
  | { type: 'UPDATE_CASE'; payload: { id: string; updates: Partial<Case> } }
  | { type: 'ADD_TIMELINE_EVENT'; payload: { caseId: string; event: TimelineEvent } }
  | { type: 'UPDATE_MASTER_ISSUE'; payload: { id: string; updates: Partial<MasterIssue> } }
  | { type: 'ADD_APPOINTMENT'; payload: Appointment }
  | { type: 'UPDATE_APPOINTMENT'; payload: { id: string; updates: Partial<Appointment> } }
  | { type: 'ADD_STANDBY'; payload: StandbyEntry }
  | { type: 'UPDATE_STANDBY'; payload: { id: string; updates: Partial<StandbyEntry> } }
  | { type: 'REMOVE_STANDBY'; payload: string }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'ADD_WORKFLOW'; payload: Workflow }
  | { type: 'UPDATE_WORKFLOW'; payload: { id: string; updates: Partial<Workflow> } }
  | { type: 'ADD_APPROVAL'; payload: Approval }
  | { type: 'UPDATE_APPROVAL'; payload: { id: string; updates: Partial<Approval> } }
  | { type: 'TOGGLE_MODE' }
  | { type: 'CANCEL_APPOINTMENT'; payload: string };
