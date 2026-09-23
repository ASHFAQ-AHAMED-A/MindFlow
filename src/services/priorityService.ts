import { PriorityLevel, SupportCategory } from '../types';

interface PriorityInput {
  text: string;
  categories: SupportCategory[];
  deadlineHours?: number;
  existingCaseCount?: number;
}

export function calculatePriority(input: PriorityInput): {
  priority: PriorityLevel;
  score: number;
  explanation: string;
  factors: string[];
} {
  let score = 0;
  const factors: string[] = [];

  const lower = input.text.toLowerCase();

  // Urgency signals
  const urgentSignals = ['emergency', 'urgent', 'crisis', 'harm', 'danger', 'unsafe'];
  if (urgentSignals.some(s => lower.includes(s))) {
    score += 100;
    factors.push('Immediate support signal detected');
  }

  // Deadline proximity
  if (lower.includes('tomorrow') || lower.includes('today') || lower.includes('tonight')) {
    score += 40;
    factors.push('Deadline within 24 hours');
  } else if (lower.includes('this week') || lower.includes('few days')) {
    score += 20;
    factors.push('Deadline within the week');
  }

  if (input.deadlineHours !== undefined) {
    if (input.deadlineHours < 24) {
      score += 40;
      factors.push(`Deadline in ${input.deadlineHours} hours`);
    } else if (input.deadlineHours < 48) {
      score += 25;
      factors.push(`Deadline in ${input.deadlineHours} hours`);
    }
  }

  // Multiple categories = coordination needed
  if (input.categories.length >= 3) {
    score += 25;
    factors.push('Multiple support areas require coordination');
  } else if (input.categories.length >= 2) {
    score += 15;
    factors.push('Two support areas involved');
  }

  // Wellbeing concern
  if (input.categories.includes('wellbeing')) {
    score += 15;
    factors.push('Wellbeing support recommended');
  }

  // Emotional intensity
  const intensityWords = ['extremely', 'very', 'really', 'so much', "can't", 'unable', 'impossible', 'desperate', 'overwhelmed'];
  const intensityCount = intensityWords.filter(w => lower.includes(w)).length;
  if (intensityCount >= 2) {
    score += 15;
    factors.push('High emotional intensity in request');
  } else if (intensityCount === 1) {
    score += 5;
  }

  // Determine priority level
  let priority: PriorityLevel;
  let explanation: string;

  if (score >= 80) {
    priority = 'urgent';
    explanation = 'Immediate support concern detected. This case has been flagged for expedited review per institutional policy.';
  } else if (score >= 30) {
    priority = 'high';
    explanation = 'Elevated priority due to time sensitivity and/or multiple support needs.';
  } else {
    priority = 'normal';
    explanation = 'Standard processing timeline. No immediate escalation signals detected.';
  }

  return { priority, score, explanation, factors };
}
