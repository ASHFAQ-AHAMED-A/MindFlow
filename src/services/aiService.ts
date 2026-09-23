import { TriageResult, SupportCategory, PriorityLevel } from '../types';

interface KeywordRule {
  keywords: string[];
  category: SupportCategory;
  situation: string;
}

const keywordRules: KeywordRule[] = [
  {
    keywords: ['assignment', 'deadline', 'extension', 'submit', 'project', 'exam', 'grade', 'gpa', 'coursework', 'lecture', 'class', 'professor', 'course', 'study', 'homework'],
    category: 'academic',
    situation: 'academic_pressure',
  },
  {
    keywords: ['stress', 'stressed', 'anxiety', 'anxious', 'overwhelm', 'overwhelmed', 'sleep', 'concentrate', 'focus', 'worried', 'panic', 'burnout', 'lonely', 'isolated', 'sad', 'crying', 'depressed', 'hopeless', 'scared'],
    category: 'wellbeing',
    situation: 'wellbeing_concern',
  },
  {
    keywords: ['fee', 'fees', 'pay', 'payment', 'money', 'afford', 'financial', 'scholarship', 'loan', 'tuition', 'cost', 'expensive', 'broke'],
    category: 'financial',
    situation: 'financial_concern',
  },
  {
    keywords: ['hostel', 'housing', 'dorm', 'room', 'accommodation', 'roommate', 'rent', 'lease', 'landlord', 'maintenance'],
    category: 'housing',
    situation: 'housing_concern',
  },
  {
    keywords: ['career', 'job', 'internship', 'placement', 'resume', 'interview', 'recruit'],
    category: 'career',
    situation: 'career_concern',
  },
  {
    keywords: ['wifi', 'internet', 'laptop', 'software', 'password', 'login', 'system', 'portal', 'technical'],
    category: 'it',
    situation: 'it_concern',
  },
];

const urgencyKeywords = ['emergency', 'urgent', 'immediately', 'crisis', 'harm', 'danger', 'unsafe', 'suicidal', 'help me now'];
const deadlineKeywords = ['tomorrow', 'today', 'tonight', 'due tomorrow', 'hours left', 'few hours', 'last day'];

function detectPriority(text: string, categories: SupportCategory[]): { priority: PriorityLevel; explanation: string } {
  const lower = text.toLowerCase();

  // Check for urgent signals
  if (urgencyKeywords.some(k => lower.includes(k))) {
    return {
      priority: 'urgent',
      explanation: 'Immediate support concern detected. This case has been flagged for expedited review per institutional policy.',
    };
  }

  // Check for deadline proximity
  const hasDeadline = deadlineKeywords.some(k => lower.includes(k));
  const multipleCategories = categories.length >= 2;

  if (hasDeadline || multipleCategories) {
    return {
      priority: 'high',
      explanation: hasDeadline && multipleCategories
        ? 'Imminent deadline with multiple support dependencies detected.'
        : hasDeadline
          ? 'Imminent deadline detected (< 48 hours).'
          : 'Multiple support areas involved, requiring coordinated response.',
    };
  }

  return {
    priority: 'normal',
    explanation: 'Standard timeline. No immediate escalation signals detected.',
  };
}

function generateSuggestedActions(categories: SupportCategory[]): string[] {
  const actions: string[] = [];

  if (categories.includes('academic')) {
    actions.push('academic_extension_workflow');
  }
  if (categories.includes('wellbeing')) {
    actions.push('15_min_checkin');
  }
  if (categories.includes('financial')) {
    actions.push('financial_support_review');
  }
  if (categories.includes('housing')) {
    actions.push('housing_support_case');
  }
  if (categories.includes('career')) {
    actions.push('career_guidance_session');
  }
  if (categories.includes('it')) {
    actions.push('it_support_ticket');
  }

  return actions;
}

function extractEntities(text: string): Record<string, string> {
  const entities: Record<string, string> = {};
  const lower = text.toLowerCase();

  // Look for course/assignment mentions
  const mlPatterns = ['ml', 'machine learning', 'ml assignment', 'ml project'];
  if (mlPatterns.some(p => lower.includes(p))) {
    entities['assignment'] = 'Machine Learning Assignment (CS-501)';
  }

  // Look for housing/hostel mentions
  if (lower.includes('hostel') || lower.includes('accommodation')) {
    entities['housing'] = 'Hostel Fee';
  }

  // Look for exam mentions
  if (lower.includes('exam') || lower.includes('examination')) {
    entities['exam'] = 'Upcoming Examinations';
  }

  // Look for assignment deadline
  if (lower.includes('deadline') || lower.includes('due')) {
    entities['deadline'] = 'Assignment Deadline';
  }

  return entities;
}

export async function triageRequest(text: string): Promise<TriageResult> {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  const lower = text.toLowerCase();
  const matchedCategories: SupportCategory[] = [];
  const situations: string[] = [];

  for (const rule of keywordRules) {
    if (rule.keywords.some(k => lower.includes(k))) {
      if (!matchedCategories.includes(rule.category)) {
        matchedCategories.push(rule.category);
      }
      if (!situations.includes(rule.situation)) {
        situations.push(rule.situation);
      }
    }
  }

  // If nothing matched, default to general
  if (matchedCategories.length === 0) {
    matchedCategories.push('general');
    situations.push('general_inquiry');
  }

  const { priority, explanation } = detectPriority(text, matchedCategories);
  const suggestedActions = generateSuggestedActions(matchedCategories);
  const entities = extractEntities(text);

  // Build summary using non-diagnostic language
  const categoryLabels: Record<SupportCategory, string> = {
    academic: 'academic deadline pressure',
    wellbeing: 'wellbeing concern',
    financial: 'financial concern',
    housing: 'housing-related concern',
    career: 'career-related inquiry',
    it: 'technical support need',
    general: 'general support inquiry',
  };

  const summaryParts = matchedCategories.map(c => categoryLabels[c]);
  const summary = `Student reports ${summaryParts.join(' and ')}.`;

  const confidence = Math.min(0.95, 0.6 + matchedCategories.length * 0.1 + (Object.keys(entities).length * 0.05));

  return {
    summary,
    categories: matchedCategories,
    situations,
    entities,
    suggestedActions,
    priority,
    confidence: Math.round(confidence * 100) / 100,
    priorityExplanation: explanation,
  };
}
