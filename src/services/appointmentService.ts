import { StandbyEntry, Appointment } from '../types';

export function findEligibleStandbyStudent(
  standbyQueue: StandbyEntry[],
  slot: Appointment
): StandbyEntry | null {
  // Filter waiting entries that match the service and duration
  const eligible = standbyQueue
    .filter(entry => entry.status === 'waiting')
    .filter(entry => entry.requestedDuration <= slot.duration);

  if (eligible.length === 0) return null;

  // Sort by priority (urgent > high > normal), then by creation time (earliest first)
  const priorityOrder: Record<string, number> = { urgent: 0, high: 1, normal: 2 };

  eligible.sort((a, b) => {
    const pDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (pDiff !== 0) return pDiff;
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  return eligible[0];
}

export function formatTimeSlot(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
