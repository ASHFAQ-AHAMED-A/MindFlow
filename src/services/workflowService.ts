import { Workflow, WorkflowType, WorkflowStep, WorkflowStatus } from '../types';

let workflowCounter = 400;

function generateWorkflowId(): string {
  return `WF-${++workflowCounter}`;
}

const workflowTemplates: Record<WorkflowType, Omit<WorkflowStep, 'id'>[]> = {
  academic_extension: [
    { name: 'Request Created', description: 'Academic extension request submitted', status: 'pending' },
    { name: 'Routed to Advisor', description: 'Request sent to academic advisor for review', status: 'pending' },
    { name: 'Advisor Review', description: 'Academic advisor reviewing extension request', status: 'pending' },
    { name: 'Decision', description: 'Extension approved or rejected', status: 'pending' },
    { name: 'Student Notified', description: 'Student notified of the decision', status: 'pending' },
  ],
  wellbeing_checkin: [
    { name: 'Check-in Requested', description: 'Wellbeing check-in identified', status: 'pending' },
    { name: 'Counselor Matching', description: 'Finding available counselor', status: 'pending' },
    { name: 'Slot Offered', description: '15-minute slot offered to student', status: 'pending' },
    { name: 'Student Confirms', description: 'Student confirms the appointment', status: 'pending' },
    { name: 'Check-in Completed', description: 'Initial assessment completed', status: 'pending' },
    { name: 'Next Steps Determined', description: 'Follow-up or resolution path decided', status: 'pending' },
  ],
  financial_support: [
    { name: 'Request Created', description: 'Financial support request submitted', status: 'pending' },
    { name: 'Documentation Check', description: 'Verifying required documents', status: 'pending' },
    { name: 'Financial Review', description: 'Under review by Financial Aid Office', status: 'pending' },
    { name: 'Eligibility Decision', description: 'Determine assistance eligibility', status: 'pending' },
    { name: 'Student Notified', description: 'Student informed of outcome', status: 'pending' },
  ],
  housing_support: [
    { name: 'Request Created', description: 'Housing support request submitted', status: 'pending' },
    { name: 'Housing Office Review', description: 'Request forwarded to Housing Office', status: 'pending' },
    { name: 'Options Assessment', description: 'Available options being evaluated', status: 'pending' },
    { name: 'Resolution', description: 'Housing arrangement resolved', status: 'pending' },
    { name: 'Student Notified', description: 'Student informed of outcome', status: 'pending' },
  ],
  general_support: [
    { name: 'Request Created', description: 'General support request submitted', status: 'pending' },
    { name: 'Assigned', description: 'Request assigned to support staff', status: 'pending' },
    { name: 'In Progress', description: 'Support staff working on request', status: 'pending' },
    { name: 'Resolution', description: 'Request resolved', status: 'pending' },
  ],
};

export function createWorkflow(caseId: string, type: WorkflowType): Workflow {
  const template = workflowTemplates[type];
  const steps: WorkflowStep[] = template.map((step, index) => ({
    ...step,
    id: `step-${index + 1}`,
    status: index === 0 ? 'completed' : index === 1 ? 'active' : 'pending',
    completedAt: index === 0 ? new Date().toISOString() : undefined,
  }));

  return {
    id: generateWorkflowId(),
    caseId,
    type,
    status: 'in_progress',
    currentStep: steps[1]?.name || steps[0].name,
    steps,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function advanceWorkflow(workflow: Workflow): Workflow {
  const updatedSteps = [...workflow.steps];
  let newStatus: WorkflowStatus = workflow.status;
  let newCurrentStep = workflow.currentStep;

  const activeIndex = updatedSteps.findIndex(s => s.status === 'active');

  if (activeIndex >= 0) {
    updatedSteps[activeIndex] = {
      ...updatedSteps[activeIndex],
      status: 'completed',
      completedAt: new Date().toISOString(),
    };

    if (activeIndex + 1 < updatedSteps.length) {
      updatedSteps[activeIndex + 1] = {
        ...updatedSteps[activeIndex + 1],
        status: 'active',
      };
      newCurrentStep = updatedSteps[activeIndex + 1].name;
    } else {
      newStatus = 'completed';
    }
  }

  return {
    ...workflow,
    steps: updatedSteps,
    status: newStatus,
    currentStep: newCurrentStep,
    updatedAt: new Date().toISOString(),
  };
}

export function getWorkflowProgress(workflow: Workflow): number {
  const completed = workflow.steps.filter(s => s.status === 'completed').length;
  return Math.round((completed / workflow.steps.length) * 100);
}
