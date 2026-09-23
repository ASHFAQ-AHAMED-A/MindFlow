import { Student, MasterIssue, Case, Appointment, StandbyEntry, Notification, Workflow, Approval, StaffMember } from '../types';

// ─── Students ────────────────────────────────────────────────────

export const currentStudent: Student = {
  id: 'STU-1042',
  name: 'Aadhish Kumar',
  email: 'aadhish.k@university.edu',
  program: 'B.Tech Computer Science',
  year: 3,
  createdAt: '2024-08-15T09:00:00Z',
};

export const students: Student[] = [
  currentStudent,
  {
    id: 'STU-1001',
    name: 'Priya Sharma',
    email: 'priya.s@university.edu',
    program: 'B.Tech AI & ML',
    year: 3,
    createdAt: '2024-08-10T09:00:00Z',
  },
  {
    id: 'STU-1015',
    name: 'Ravi Mehta',
    email: 'ravi.m@university.edu',
    program: 'M.Tech Data Science',
    year: 1,
    createdAt: '2024-08-12T09:00:00Z',
  },
  {
    id: 'STU-1023',
    name: 'Ananya Reddy',
    email: 'ananya.r@university.edu',
    program: 'B.Tech Computer Science',
    year: 2,
    createdAt: '2024-08-14T09:00:00Z',
  },
  {
    id: 'STU-1031',
    name: 'Karthik Nair',
    email: 'karthik.n@university.edu',
    program: 'B.Tech Electronics',
    year: 4,
    createdAt: '2024-08-09T09:00:00Z',
  },
  {
    id: 'STU-1050',
    name: 'Fatima Ali',
    email: 'fatima.a@university.edu',
    program: 'B.Tech Computer Science',
    year: 3,
    createdAt: '2024-08-16T09:00:00Z',
  },
];

// ─── Staff ───────────────────────────────────────────────────────

export const staff: StaffMember[] = [
  {
    id: 'STAFF-001',
    name: 'Dr. Sarah Menon',
    role: 'Counselor',
    department: 'Student Wellbeing',
  },
  {
    id: 'STAFF-002',
    name: 'Prof. Rajesh Iyer',
    role: 'Academic Advisor',
    department: 'Computer Science',
  },
  {
    id: 'STAFF-003',
    name: 'Ms. Lakshmi Venkat',
    role: 'Financial Aid Officer',
    department: 'Financial Services',
  },
  {
    id: 'STAFF-004',
    name: 'Dr. Amit Patel',
    role: 'Counselor',
    department: 'Student Wellbeing',
  },
];

// ─── Master Issues ───────────────────────────────────────────────

export const masterIssues: MasterIssue[] = [
  {
    id: 'MI-2026-0042',
    title: 'ML Assignment Deadline',
    category: 'academic',
    description: 'Multiple students reporting concerns about the Machine Learning assignment deadline and requesting extensions.',
    caseCount: 126,
    trend: 'increasing',
    trendPercent: 43,
    status: 'active',
    commonRequest: 'Students need additional time for ML assignment completion.',
    suggestedAction: 'Review assignment deadline with course coordinator. Consider issuing a batch extension if more than 50% of class is affected.',
    priorityBreakdown: { normal: 102, high: 21, urgent: 3 },
    createdAt: '2026-09-21T08:00:00Z',
  },
  {
    id: 'MI-2026-0038',
    title: 'Exam Stress & Wellbeing',
    category: 'wellbeing',
    description: 'Cluster of students reporting exam-related stress and anxiety, seeking wellbeing support and academic guidance.',
    caseCount: 82,
    trend: 'increasing',
    trendPercent: 28,
    status: 'active',
    commonRequest: 'Students seeking stress management support and exam preparation guidance.',
    suggestedAction: 'Schedule group wellbeing workshop. Increase counselor availability during exam period.',
    priorityBreakdown: { normal: 58, high: 19, urgent: 5 },
    createdAt: '2026-09-19T10:00:00Z',
  },
  {
    id: 'MI-2026-0035',
    title: 'Housing Fee Concern',
    category: 'financial',
    description: 'Students reporting difficulty with hostel/housing fee payments and seeking financial assistance options.',
    caseCount: 31,
    trend: 'stable',
    trendPercent: 5,
    status: 'active',
    commonRequest: 'Payment plan options or financial aid for housing fees.',
    suggestedAction: 'Review payment plan eligibility criteria. Connect affected students with financial aid office.',
    priorityBreakdown: { normal: 24, high: 6, urgent: 1 },
    createdAt: '2026-09-18T14:00:00Z',
  },
];

// ─── Pre-existing Cases ──────────────────────────────────────────

export const cases: Case[] = [
  {
    id: 'CASE-0998',
    studentId: 'STU-1001',
    title: 'ML Assignment Extension Request',
    description: 'I cannot complete the ML assignment by the deadline. Need an extension.',
    categories: ['academic'],
    priority: 'normal',
    status: 'in_progress',
    masterIssueId: 'MI-2026-0042',
    createdAt: '2026-09-22T09:30:00Z',
    updatedAt: '2026-09-22T14:00:00Z',
    timeline: [
      { id: 'evt-1', timestamp: '2026-09-22T09:30:00Z', type: 'system', title: 'Case created', description: 'Support request received and case created.' },
      { id: 'evt-2', timestamp: '2026-09-22T09:30:05Z', type: 'ai', title: 'AI Triage completed', description: 'Identified: Academic pressure. Priority: Normal.' },
      { id: 'evt-3', timestamp: '2026-09-22T09:31:00Z', type: 'system', title: 'Linked to Master Issue', description: 'Associated with MI-2026-0042: ML Assignment Deadline.' },
      { id: 'evt-4', timestamp: '2026-09-22T10:00:00Z', type: 'workflow', title: 'Extension workflow started', description: 'Academic extension request routed to Prof. Rajesh Iyer.' },
    ],
  },
  {
    id: 'CASE-1005',
    studentId: 'STU-1015',
    title: 'Exam Stress and Support Need',
    description: 'I\'m extremely stressed about upcoming exams. Having trouble sleeping and concentrating.',
    categories: ['wellbeing', 'academic'],
    priority: 'high',
    status: 'in_progress',
    masterIssueId: 'MI-2026-0038',
    createdAt: '2026-09-22T11:00:00Z',
    updatedAt: '2026-09-22T16:00:00Z',
    timeline: [
      { id: 'evt-5', timestamp: '2026-09-22T11:00:00Z', type: 'system', title: 'Case created', description: 'Support request received.' },
      { id: 'evt-6', timestamp: '2026-09-22T11:00:08Z', type: 'ai', title: 'AI Triage completed', description: 'Identified: Wellbeing concern + Academic pressure. Priority: High.' },
      { id: 'evt-7', timestamp: '2026-09-22T11:01:00Z', type: 'system', title: 'Check-in scheduled', description: '15-minute wellbeing check-in booked for Sep 23 at 2:15 PM.' },
    ],
  },
  {
    id: 'CASE-1010',
    studentId: 'STU-1023',
    title: 'Housing Fee Payment Concern',
    description: 'I am unable to pay my hostel fee this semester. Need help with financial assistance.',
    categories: ['financial', 'housing'],
    priority: 'normal',
    status: 'waiting',
    masterIssueId: 'MI-2026-0035',
    createdAt: '2026-09-22T14:00:00Z',
    updatedAt: '2026-09-23T08:00:00Z',
    timeline: [
      { id: 'evt-8', timestamp: '2026-09-22T14:00:00Z', type: 'system', title: 'Case created', description: 'Support request received.' },
      { id: 'evt-9', timestamp: '2026-09-22T14:00:06Z', type: 'ai', title: 'AI Triage completed', description: 'Identified: Financial concern + Housing. Priority: Normal.' },
      { id: 'evt-10', timestamp: '2026-09-22T14:05:00Z', type: 'workflow', title: 'Financial review initiated', description: 'Case forwarded to Financial Aid Office for review.' },
    ],
  },
  {
    id: 'CASE-1018',
    studentId: 'STU-1031',
    title: 'ML Deadline + Financial Stress',
    description: 'I can\'t finish the ML project and I\'m also worried about paying next semester fees.',
    categories: ['academic', 'financial'],
    priority: 'high',
    status: 'assigned',
    masterIssueId: 'MI-2026-0042',
    createdAt: '2026-09-23T07:00:00Z',
    updatedAt: '2026-09-23T08:00:00Z',
    timeline: [
      { id: 'evt-11', timestamp: '2026-09-23T07:00:00Z', type: 'system', title: 'Case created', description: 'Support request received.' },
      { id: 'evt-12', timestamp: '2026-09-23T07:00:10Z', type: 'ai', title: 'AI Triage completed', description: 'Identified: Academic + Financial. Priority: High.' },
    ],
  },
];

// ─── Appointments ────────────────────────────────────────────────

export const appointments: Appointment[] = [
  {
    id: 'APT-201',
    caseId: 'CASE-1005',
    studentId: 'STU-1015',
    staffId: 'STAFF-001',
    staffName: 'Dr. Sarah Menon',
    type: 'checkin_15min',
    startTime: '2026-09-23T14:15:00Z',
    endTime: '2026-09-23T14:30:00Z',
    duration: 15,
    status: 'confirmed',
  },
  {
    id: 'APT-202',
    caseId: 'CASE-0998',
    studentId: 'STU-1001',
    staffId: 'STAFF-001',
    staffName: 'Dr. Sarah Menon',
    type: 'checkin_15min',
    startTime: '2026-09-23T14:00:00Z',
    endTime: '2026-09-23T14:15:00Z',
    duration: 15,
    status: 'confirmed',
  },
  {
    id: 'APT-203',
    caseId: '',
    studentId: 'STU-1050',
    staffId: 'STAFF-001',
    staffName: 'Dr. Sarah Menon',
    type: 'follow_up',
    startTime: '2026-09-23T15:00:00Z',
    endTime: '2026-09-23T15:30:00Z',
    duration: 30,
    status: 'scheduled',
  },
  {
    id: 'APT-204',
    caseId: '',
    studentId: '',
    staffId: 'STAFF-004',
    staffName: 'Dr. Amit Patel',
    type: 'checkin_15min',
    startTime: '2026-09-23T15:00:00Z',
    endTime: '2026-09-23T15:15:00Z',
    duration: 15,
    status: 'scheduled',
  },
  {
    id: 'APT-205',
    caseId: '',
    studentId: '',
    staffId: 'STAFF-004',
    staffName: 'Dr. Amit Patel',
    type: 'checkin_15min',
    startTime: '2026-09-23T16:00:00Z',
    endTime: '2026-09-23T16:15:00Z',
    duration: 15,
    status: 'scheduled',
  },
];

// ─── Standby Queue ───────────────────────────────────────────────

export const standbyQueue: StandbyEntry[] = [
  {
    id: 'SBY-001',
    caseId: 'CASE-1018',
    studentId: 'STU-1031',
    studentName: 'Karthik Nair',
    priority: 'high',
    eligibleService: 'wellbeing_checkin',
    requestedDuration: 15,
    createdAt: '2026-09-23T08:30:00Z',
    status: 'waiting',
  },
  {
    id: 'SBY-002',
    caseId: 'CASE-0998',
    studentId: 'STU-1001',
    studentName: 'Priya Sharma',
    priority: 'normal',
    eligibleService: 'wellbeing_checkin',
    requestedDuration: 15,
    createdAt: '2026-09-23T09:00:00Z',
    status: 'waiting',
  },
];

// ─── Workflows ───────────────────────────────────────────────────

export const workflows: Workflow[] = [
  {
    id: 'WF-301',
    caseId: 'CASE-0998',
    type: 'academic_extension',
    status: 'waiting_approval',
    currentStep: 'advisor_review',
    steps: [
      { id: 's1', name: 'Request Created', description: 'Extension request submitted', status: 'completed', completedAt: '2026-09-22T10:00:00Z' },
      { id: 's2', name: 'Routed to Advisor', description: 'Sent to Prof. Rajesh Iyer', status: 'completed', completedAt: '2026-09-22T10:05:00Z' },
      { id: 's3', name: 'Advisor Review', description: 'Pending review by academic advisor', status: 'active' },
      { id: 's4', name: 'Decision', description: 'Approve or reject extension', status: 'pending' },
      { id: 's5', name: 'Student Notified', description: 'Notify student of decision', status: 'pending' },
    ],
    createdAt: '2026-09-22T10:00:00Z',
    updatedAt: '2026-09-22T14:00:00Z',
  },
  {
    id: 'WF-302',
    caseId: 'CASE-1010',
    type: 'financial_support',
    status: 'in_progress',
    currentStep: 'financial_review',
    steps: [
      { id: 's1', name: 'Request Created', description: 'Financial support request submitted', status: 'completed', completedAt: '2026-09-22T14:05:00Z' },
      { id: 's2', name: 'Documentation Check', description: 'Verify supporting documents', status: 'completed', completedAt: '2026-09-22T16:00:00Z' },
      { id: 's3', name: 'Financial Review', description: 'Under review by Financial Aid Office', status: 'active' },
      { id: 's4', name: 'Decision', description: 'Determine assistance eligibility', status: 'pending' },
      { id: 's5', name: 'Student Notified', description: 'Notify student of outcome', status: 'pending' },
    ],
    createdAt: '2026-09-22T14:05:00Z',
    updatedAt: '2026-09-23T08:00:00Z',
  },
];

// ─── Approvals ───────────────────────────────────────────────────

export const approvals: Approval[] = [
  {
    id: 'APR-101',
    caseId: 'CASE-0998',
    type: 'academic_extension',
    requestDetails: '48-hour extension for ML Assignment (CS-501)',
    approver: 'Prof. Rajesh Iyer',
    status: 'pending',
    newDeadline: '2026-09-27T23:59:00Z',
    createdAt: '2026-09-22T10:00:00Z',
  },
];

// ─── Notifications ───────────────────────────────────────────────

export const notifications: Notification[] = [
  {
    id: 'NOT-001',
    studentId: 'STU-1015',
    type: 'checkin_booked',
    title: 'Check-in Confirmed',
    message: 'Your 15-minute wellbeing check-in has been confirmed for Sep 23 at 2:15 PM with Dr. Sarah Menon.',
    read: true,
    actionUrl: '/appointments',
    actionLabel: 'View Appointment',
    createdAt: '2026-09-22T11:05:00Z',
  },
  {
    id: 'NOT-002',
    studentId: 'STU-1001',
    type: 'case_update',
    title: 'Extension Under Review',
    message: 'Your academic extension request for ML Assignment is now under review by Prof. Rajesh Iyer.',
    read: true,
    actionUrl: '/case/CASE-0998',
    actionLabel: 'View Case',
    createdAt: '2026-09-22T10:10:00Z',
  },
];
