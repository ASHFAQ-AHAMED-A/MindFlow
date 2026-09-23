import React, { createContext, useContext, useReducer, type Dispatch } from 'react';
import { AppState, AppAction } from '../types';
import {
  currentStudent,
  cases as initialCases,
  masterIssues as initialMasterIssues,
  appointments as initialAppointments,
  standbyQueue as initialStandby,
  notifications as initialNotifications,
  workflows as initialWorkflows,
  approvals as initialApprovals,
} from '../data/mockData';

const initialState: AppState = {
  currentStudent,
  cases: initialCases,
  masterIssues: initialMasterIssues,
  appointments: initialAppointments,
  standbyQueue: initialStandby,
  notifications: initialNotifications,
  workflows: initialWorkflows,
  approvals: initialApprovals,
  triageResult: null,
  isStudentMode: true,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_TRIAGE_RESULT':
      return { ...state, triageResult: action.payload };

    case 'ADD_CASE':
      return { ...state, cases: [...state.cases, action.payload] };

    case 'UPDATE_CASE':
      return {
        ...state,
        cases: state.cases.map(c =>
          c.id === action.payload.id ? { ...c, ...action.payload.updates } : c
        ),
      };

    case 'ADD_TIMELINE_EVENT':
      return {
        ...state,
        cases: state.cases.map(c =>
          c.id === action.payload.caseId
            ? { ...c, timeline: [...c.timeline, action.payload.event] }
            : c
        ),
      };

    case 'UPDATE_MASTER_ISSUE':
      return {
        ...state,
        masterIssues: state.masterIssues.map(mi =>
          mi.id === action.payload.id ? { ...mi, ...action.payload.updates } : mi
        ),
      };

    case 'ADD_APPOINTMENT':
      return { ...state, appointments: [...state.appointments, action.payload] };

    case 'UPDATE_APPOINTMENT':
      return {
        ...state,
        appointments: state.appointments.map(a =>
          a.id === action.payload.id ? { ...a, ...action.payload.updates } : a
        ),
      };

    case 'CANCEL_APPOINTMENT':
      return {
        ...state,
        appointments: state.appointments.map(a =>
          a.id === action.payload ? { ...a, status: 'cancelled' as const } : a
        ),
      };

    case 'ADD_STANDBY':
      return { ...state, standbyQueue: [...state.standbyQueue, action.payload] };

    case 'UPDATE_STANDBY':
      return {
        ...state,
        standbyQueue: state.standbyQueue.map(s =>
          s.id === action.payload.id ? { ...s, ...action.payload.updates } : s
        ),
      };

    case 'REMOVE_STANDBY':
      return {
        ...state,
        standbyQueue: state.standbyQueue.filter(s => s.id !== action.payload),
      };

    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [action.payload, ...state.notifications] };

    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(n =>
          n.id === action.payload ? { ...n, read: true } : n
        ),
      };

    case 'ADD_WORKFLOW':
      return { ...state, workflows: [...state.workflows, action.payload] };

    case 'UPDATE_WORKFLOW':
      return {
        ...state,
        workflows: state.workflows.map(w =>
          w.id === action.payload.id ? { ...w, ...action.payload.updates } : w
        ),
      };

    case 'ADD_APPROVAL':
      return { ...state, approvals: [...state.approvals, action.payload] };

    case 'UPDATE_APPROVAL':
      return {
        ...state,
        approvals: state.approvals.map(a =>
          a.id === action.payload.id ? { ...a, ...action.payload.updates } : a
        ),
      };

    case 'TOGGLE_MODE':
      return { ...state, isStudentMode: !state.isStudentMode };

    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: Dispatch<AppAction>;
} | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
