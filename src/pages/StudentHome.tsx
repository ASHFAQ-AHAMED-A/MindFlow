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
      <div className="min-h-[75vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-lg w-full bg-white/90 backdrop-blur-xl rounded-3xl border border-slate-200/80 p-10 shadow-2xl shadow-indigo-500/10"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="w-20 h-20 mx-auto mb-8 rounded-3xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30"
          >
            <Sparkles className="w-10 h-10 text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3 heading-font">Analyzing your situation...</h2>
          <p className="text-slate-500 text-sm leading-relaxed mb-8">Our AI triage engine is classifying your concern and mapping out dedicated academic & wellbeing workflows.</p>

          <div className="space-y-3.5 text-left">
            {[
              'Extracting core circumstances & sentiment',
              'Classifying multi-departmental categories',
              'Evaluating urgency level & available specialists',
            ].map((step, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.4 }}
                className="flex items-center gap-3.5 px-5 py-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/70"
              >
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ delay: i * 0.4, duration: 0.8, repeat: Infinity }}
                  className="w-2.5 h-2.5 rounded-full bg-indigo-600 shadow-sm shadow-indigo-500/50"
                />
                <span className="text-xs sm:text-sm font-semibold text-slate-700">{step}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  if (phase === 'result' && state.triageResult) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center py-6">
        <TriageResultComponent result={state.triageResult} onContinue={handleCreateCase} />
      </div>
    );
  }

  if (phase === 'creating') {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-lg w-full bg-white/90 backdrop-blur-xl rounded-3xl border border-slate-200/80 p-10 shadow-2xl shadow-emerald-500/10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 12, stiffness: 200 }}
            className="w-20 h-20 mx-auto mb-8 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30"
          >
            <Shield className="w-10 h-10 text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3 heading-font">Case Successfully Initialized!</h2>
          <p className="text-slate-500 text-sm leading-relaxed mb-8">CareFlow has provisioned your case and dispatched automated support tasks.</p>

          <div className="space-y-3 text-left">
            {[
              'Support record assigned to student profile',
              'Clustered with active campus initiatives',
              'Advisor extension approval routed',
              'Standby queue prioritized for earliest counselor slot',
            ].map((step, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.25 }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-50/60 border border-emerald-100 text-xs sm:text-sm font-medium text-slate-700"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                  ✓
                </div>
                <span>{step}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-16 pb-12">
      {/* Hero Section */}
      <div className="pt-6 md:pt-10">
        <StudentInput onSubmit={handleSubmit} />
      </div>

      {/* Feature Cards Grid */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4"
      >
        {[
          {
            icon: Sparkles,
            title: 'AI-Powered Triage',
            description: 'Our system analyzes free-form natural language to identify academic, financial, housing, and mental wellbeing concerns simultaneously.',
            color: 'text-indigo-600',
            bg: 'bg-indigo-50/80 border-indigo-100',
            iconGrad: 'from-indigo-600 to-indigo-700',
          },
          {
            icon: Clock,
            title: 'Automated Multi-Workflows',
            description: 'Extension approvals, financial reviews, and emergency accommodations trigger immediately without needing manual departmental visits.',
            color: 'text-violet-600',
            bg: 'bg-violet-50/80 border-violet-100',
            iconGrad: 'from-violet-600 to-purple-700',
          },
          {
            icon: Users,
            title: 'Smart Standby Queue',
            description: 'Never miss an appointment. If a counselor slot opens up through cancellations, the system matches high-urgency students in real-time.',
            color: 'text-emerald-600',
            bg: 'bg-emerald-50/80 border-emerald-100',
            iconGrad: 'from-emerald-600 to-teal-700',
          },
        ].map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + index * 0.1 }}
            className="group relative bg-white/90 backdrop-blur-sm rounded-3xl border border-slate-200/80 p-8 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${feature.iconGrad} text-white flex items-center justify-center mb-6 shadow-md shadow-slate-900/10 group-hover:scale-105 transition-transform`}>
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2.5 heading-font tracking-tight">{feature.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{feature.description}</p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-indigo-600 group-hover:text-indigo-700">
              <span>Learn more</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Existing Cases Section */}
      {state.cases.filter(c => c.studentId === state.currentStudent.id).length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="pt-4"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 heading-font">Your Active Support Journeys</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Track case status, active workflows, and pending advisor approvals</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-600 border border-indigo-100">
              {state.cases.filter(c => c.studentId === state.currentStudent.id).length} Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {state.cases
              .filter(c => c.studentId === state.currentStudent.id)
              .map((c) => (
                <div
                  key={c.id}
                  onClick={() => navigate(`/case/${c.id}`)}
                  className="bg-white/90 backdrop-blur-sm rounded-3xl border border-slate-200/80 p-6 shadow-sm hover:shadow-lg hover:border-indigo-200/80 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer flex items-center justify-between group"
                >
                  <div className="min-w-0 pr-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100/80">{c.id}</span>
                      <span className="text-xs font-semibold text-slate-400 capitalize">· {c.status.replace('_', ' ')}</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">{c.title}</h3>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      {c.categories.map(cat => (
                        <span key={cat} className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full capitalize">
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-slate-50 group-hover:bg-indigo-600 text-slate-400 group-hover:text-white flex items-center justify-center transition-all flex-shrink-0 shadow-sm">
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

