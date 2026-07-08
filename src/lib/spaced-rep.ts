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

  // Adjust days based on ease factor, normalized so neutral quality (EF unchanged)
  // yields the plain standard interval. Only quality deviations shorten/lengthen it,
  // instead of always multiplying the interval by the full ease factor.
  const adjustedDays = Math.ceil(daysUntilNextReview * (efFactor / initialEF));

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


