import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import StudentInput from '../components/StudentInput';
import TriageResultComponent from '../components/TriageResult';
import { triageRequest } from '../services/aiService';
import { findMatchingMasterIssue } from '../services/clusteringService';
import { createWorkflow } from '../services/workflowService';
import { useApp } from '../context/AppContext';
import { Case, TimelineEvent, StandbyEntry, Notification } from '../types';
import { Shield, Sparkles, Clock, Users, ArrowRight } from 'lucide-react';

type Phase = 'input' | 'analyzing' | 'result' | 'creating';

export default function StudentHome() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>('input');
  const [inputText, setInputText] = useState('');

  const handleSubmit = async (text: string) => {
    setInputText(text);
    setPhase('analyzing');

    try {
      const result = await triageRequest(text);
      dispatch({ type: 'SET_TRIAGE_RESULT', payload: result });
      setPhase('result');
    } catch {
      setPhase('input');
    }
  };

  const handleCreateCase = () => {
    if (!state.triageResult) return;
    setPhase('creating');

    const now = new Date().toISOString();
    const caseId = `CASE-${1100 + state.cases.length}`;

    // Create the case
    const newCase: Case = {
      id: caseId,
      studentId: state.currentStudent.id,
      title: state.triageResult.summary,
      description: inputText,
      categories: state.triageResult.categories,
      priority: state.triageResult.priority,
      status: 'triaged',
      createdAt: now,
      updatedAt: now,
      timeline: [
        {
          id: `evt-${Date.now()}-1`,
          timestamp: now,
          type: 'system',
          title: 'Case Created',
          description: 'Your support request has been received and a case has been created.',
        },
        {
          id: `evt-${Date.now()}-2`,
          timestamp: now,
          type: 'ai',
          title: 'AI Triage Completed',
          description: `Identified: ${state.triageResult.categories.join(', ')}. Priority: ${state.triageResult.priority}.`,
        },
      ],
    };

    dispatch({ type: 'ADD_CASE', payload: newCase });

    // Check for master issue clustering
    const clusterMatch = findMatchingMasterIssue(state.triageResult, state.masterIssues);
    if (clusterMatch) {
      const updatedCase = { ...newCase, masterIssueId: clusterMatch.masterIssue.id, status: 'clustered' as const };
      dispatch({
        type: 'UPDATE_CASE',
        payload: {
          id: caseId,
          updates: { masterIssueId: clusterMatch.masterIssue.id, status: 'clustered' },
        },
      });

      dispatch({
        type: 'UPDATE_MASTER_ISSUE',
        payload: {
          id: clusterMatch.masterIssue.id,
          updates: {
            caseCount: clusterMatch.masterIssue.caseCount + 1,
            priorityBreakdown: {
              ...clusterMatch.masterIssue.priorityBreakdown,
              [state.triageResult.priority]: clusterMatch.masterIssue.priorityBreakdown[state.triageResult.priority] + 1,
            },
          },
        },
      });

      const clusterEvent: TimelineEvent = {
        id: `evt-${Date.now()}-3`,
        timestamp: now,
        type: 'system',
        title: 'Linked to Master Issue',
        description: `Similar issue detected: "${clusterMatch.masterIssue.title}" (${clusterMatch.masterIssue.caseCount + 1} related cases).`,
      };
      dispatch({ type: 'ADD_TIMELINE_EVENT', payload: { caseId, event: clusterEvent } });
    }

    // Create workflows based on suggested actions
    if (state.triageResult.suggestedActions.includes('academic_extension_workflow')) {
      const wf = createWorkflow(caseId, 'academic_extension');
      dispatch({ type: 'ADD_WORKFLOW', payload: wf });
      dispatch({
        type: 'ADD_TIMELINE_EVENT',
        payload: {
          caseId,
          event: {
            id: `evt-${Date.now()}-4`,
            timestamp: now,
            type: 'workflow',
            title: 'Academic Extension Workflow Started',
            description: 'Extension request routed to academic advisor for review.',
          },
        },
      });

      // Add approval
      dispatch({
        type: 'ADD_APPROVAL',
        payload: {
          id: `APR-${200 + state.approvals.length}`,
          caseId,
          type: 'academic_extension',
          requestDetails: '48-hour extension request',
          approver: 'Prof. Rajesh Iyer',
          status: 'pending',
          newDeadline: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
          createdAt: now,
        },
      });
    }

    if (state.triageResult.suggestedActions.includes('15_min_checkin')) {
      const wf = createWorkflow(caseId, 'wellbeing_checkin');
      dispatch({ type: 'ADD_WORKFLOW', payload: wf });

      // No slot available -> add to standby
      const standbyEntry: StandbyEntry = {
        id: `SBY-${100 + state.standbyQueue.length}`,
        caseId,
        studentId: state.currentStudent.id,
        studentName: state.currentStudent.name,
        priority: state.triageResult.priority,
        eligibleService: 'wellbeing_checkin',
        requestedDuration: 15,
        createdAt: now,
        status: 'waiting',
      };
      dispatch({ type: 'ADD_STANDBY', payload: standbyEntry });

      dispatch({
        type: 'ADD_TIMELINE_EVENT',
        payload: {
          caseId,
          event: {
            id: `evt-${Date.now()}-5`,
            timestamp: now,
            type: 'system',
            title: 'Check-in Requested',
            description: 'No immediate appointment available. Added to priority-aware standby queue.',
          },
        },
      });
    }

    // Update case status
    dispatch({
      type: 'UPDATE_CASE',
      payload: { id: caseId, updates: { status: 'in_progress' } },
    });

    // Add notification
    const notification: Notification = {
      id: `NOT-${Date.now()}`,
      studentId: state.currentStudent.id,
      type: 'case_update',
      title: 'Case Created Successfully',
      message: `Your support case ${caseId} has been created. AI triage completed and workflows have been initiated.`,
      read: false,
      actionUrl: `/case/${caseId}`,
      actionLabel: 'View Case',
      createdAt: now,
    };
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });

    // Navigate to case after a short delay
    setTimeout(() => {
      navigate(`/case/${caseId}`);
    }, 1500);
  };

  if (phase === 'analyzing') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-indigo-100 flex items-center justify-center"
          >
            <Sparkles className="w-8 h-8 text-indigo-600" />
          </motion.div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Analyzing your situation...</h2>
          <p className="text-slate-500">AI is understanding your needs to provide the best support path.</p>

          <div className="mt-8 space-y-3 max-w-sm mx-auto">
            {['Understanding your concern', 'Classifying support areas', 'Assessing priority'].map((step, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.5 }}
                className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white border border-slate-200"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ delay: i * 0.5, duration: 0.5 }}
                  className="w-2 h-2 rounded-full bg-indigo-500"
                />
                <span className="text-sm text-slate-600">{step}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  if (phase === 'result' && state.triageResult) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-8">
        <TriageResultComponent result={state.triageResult} onContinue={handleCreateCase} />
      </div>
    );
  }

  if (phase === 'creating') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 10 }}
            className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-emerald-100 flex items-center justify-center"
          >
            <Shield className="w-8 h-8 text-emerald-600" />
          </motion.div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Case Created!</h2>
          <p className="text-slate-500 mb-4">ServiceNow is orchestrating your support workflows automatically.</p>

          <div className="space-y-2 text-left">
            {['Creating support case...', 'Linking to master issue...', 'Initiating workflows...', 'Setting up appointment...'].map((step, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.3 }}
                className="flex items-center gap-2 text-sm text-slate-600"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.3 + 0.2 }}
                  className="text-emerald-500"
                >
                  ✓
                </motion.div>
                {step}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center py-12">
        <StudentInput onSubmit={handleSubmit} />
      </div>

      {/* Feature Cards */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="grid grid-cols-3 gap-4 mt-8"
      >
        {[
          {
            icon: Sparkles,
            title: 'AI-Powered Triage',
            description: 'We understand your situation automatically — no department selection needed.',
            color: 'text-violet-600',
            bg: 'bg-violet-50',
          },
          {
            icon: Clock,
            title: 'Instant Workflows',
            description: 'ServiceNow orchestrates approvals, appointments, and notifications automatically.',
            color: 'text-indigo-600',
            bg: 'bg-indigo-50',
          },
          {
            icon: Users,
            title: 'Continuous Support',
            description: "You'll receive updates every step of the way until your issue is resolved.",
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
          },
        ].map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 + index * 0.1 }}
            className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm"
          >
            <div className={`w-10 h-10 rounded-xl ${feature.bg} flex items-center justify-center mb-3`}>
              <feature.icon className={`w-5 h-5 ${feature.color}`} />
            </div>
            <h3 className="text-sm font-semibold text-slate-900 mb-1">{feature.title}</h3>
            <p className="text-xs text-slate-500">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Existing Cases */}
      {state.cases.filter(c => c.studentId === state.currentStudent.id).length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-8"
        >
          <h2 className="text-lg font-bold text-slate-900 mb-4">Your Active Cases</h2>
          <div className="space-y-3">
            {state.cases
              .filter(c => c.studentId === state.currentStudent.id)
              .map((c) => (
                <div
                  key={c.id}
                  onClick={() => navigate(`/case/${c.id}`)}
                  className="bg-white rounded-2xl border border-slate-200/60 p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs font-mono text-slate-400">{c.id}</span>
                    <h3 className="text-sm font-semibold text-slate-900">{c.title}</h3>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </div>
              ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
