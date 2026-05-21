/**
 * Spaced Repetition & SuperMemo-2 Algorithm
 * Calculates optimal revision dates for mistakes and revisions
 */

export interface RevisionSchedule {
  cycle: number;
  daysUntilNextReview: number;
  nextReviewDate: Date;
  efFactor: number; // Ease factor for SuperMemo-2
}

/**
 * Simple spaced repetition intervals (simplified version)
 * Cycle: 0->1 day, 1->3 days, 2->7 days, 3->15 days, 4->30 days
 */
export const STANDARD_INTERVALS_DAYS = [1, 3, 7, 15, 30, 60];

/**
 * Calculate next review date using standard intervals
 * @param currentCycle The current revision cycle (0-indexed)
 * @param quality Optional quality rating (0-5) for SuperMemo-2 calculation
 * @returns RevisionSchedule with next review date and updated metrics
 */
export function calculateNextReviewDate(
  currentCycle: number = 0,
  quality: number = 3, // 0-5 quality rating (default: neutral)
  initialEF: number = 2.5 // SuperMemo-2 ease factor
): RevisionSchedule {
  let cycle = currentCycle;
  let daysUntilNextReview = STANDARD_INTERVALS_DAYS[cycle] || 30;
  let efFactor = initialEF;

  // SuperMemo-2 algorithm: adjust ease factor based on quality
  if (quality < 3) {
    efFactor = Math.max(1.3, efFactor - (0.2 + (3 - quality) * 0.02));
  } else if (quality > 3) {
    efFactor = efFactor + (quality - 3) * 0.1;
  }

  // Adjust days based on ease factor
  const adjustedDays = Math.ceil(daysUntilNextReview * efFactor);

  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + adjustedDays);

  return {
    cycle: Math.min(cycle + 1, STANDARD_INTERVALS_DAYS.length - 1),
    daysUntilNextReview: adjustedDays,
    nextReviewDate,
    efFactor: parseFloat(efFactor.toFixed(2)),
  };
}

/**
 * Check if a mistake/revision is overdue for review
 */
export function isOverdue(scheduledDate: Date): boolean {
  return new Date() > new Date(scheduledDate);
}

/**
 * Calculate days until next review
 */
export function daysUntilReview(scheduledDate: Date): number {
  const now = new Date();
  const scheduled = new Date(scheduledDate);
  const diffTime = Math.abs(scheduled.getTime() - now.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return isOverdue(scheduledDate) ? -diffDays : diffDays;
}

/**
 * Get all mistakes/revisions due for today or overdue
 */
export function getOverdueItems<T extends { nextRevisionAt: string }>(
  items: T[]
): T[] {
  return items.filter((item) => isOverdue(new Date(item.nextRevisionAt)));
}

/**
 * Get mistakes/revisions due within N days
 */
export function getUpcomingItems<T extends { nextRevisionAt: string }>(
  items: T[],
  daysAhead: number = 7
): T[] {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() + daysAhead);

  return items.filter((item) => {
    const itemDate = new Date(item.nextRevisionAt);
    return itemDate <= cutoffDate && !isOverdue(itemDate);
  });
}

/**
 * Calculate optimal study load based on mistake frequency
 * Returns recommended daily review count
 */
export function calculateDailyReviewLoad(
  totalMistakes: number,
  daysAvailable: number = 30
): number {
  // Assume each mistake needs 2-3 reviews in first 30 days
  const totalReviewsNeeded = totalMistakes * 2.5;
  return Math.ceil(totalReviewsNeeded / daysAvailable);
}

/**
 * Generate a study schedule for a chapter based on completion percentage
 * and weak topics
 */
export function generateChapterSchedule(
  completion: number,
  weakTopicsCount: number,
  targetCompletionDays: number = 30
): Date[] {
  const schedule: Date[] = [];
  const startDate = new Date();

  // First review: immediate (today or tomorrow)
  schedule.push(new Date(startDate.getTime() + 24 * 60 * 60 * 1000));

  // Subsequent reviews based on weak topics and completion
  const reviewCount = Math.min(5, Math.ceil(weakTopicsCount / 2) + 2);
  const daysPerReview = Math.floor(targetCompletionDays / reviewCount);

  for (let i = 1; i < reviewCount; i++) {
    const nextReview = new Date(startDate);
    nextReview.setDate(nextReview.getDate() + daysPerReview * i);
    schedule.push(nextReview);
  }

  return schedule;
}

/**
 * Calculate time investment needed to complete a syllabus chapter
 * Based on: completion %, weak topics, PYQs solved/total
 */
export interface TimeEstimate {
  totalHoursNeeded: number;
  daysToComplete: number;
  hoursPerDay: number;
}

export function estimateTimeNeeded(
  completion: number,
  pyqsSolved: number,
  pyqsTotal: number,
  weakTopicsCount: number
): TimeEstimate {
  // Base time: 10 hours per chapter
  let baseTime = 10;

  // Add time for weak topics (1.5 hours each)
  baseTime += weakTopicsCount * 1.5;

  // Add time for remaining PYQs (15 mins each)
  const remainingPyqs = pyqsTotal - pyqsSolved;
  baseTime += (remainingPyqs * 0.25);

  // Reduce by completion percentage
  const hoursNeeded = Math.max(2, baseTime * ((100 - completion) / 100));

  // Assume 2 hours study per day for dedicated preparation
  const studyHoursPerDay = 2;
  const daysToComplete = Math.ceil(hoursNeeded / studyHoursPerDay);

  return {
    totalHoursNeeded: parseFloat(hoursNeeded.toFixed(1)),
    daysToComplete,
    hoursPerDay: studyHoursPerDay,
  };
}
