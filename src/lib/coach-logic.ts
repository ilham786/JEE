/**
 * AI Study Coach Logic
 * Heuristics for personalized study recommendations, weak area identification,
 * and adaptive learning suggestions
 */

import type { ChapterProgress } from "@/store/use-mistake-store";

export interface CoachSuggestion {
  priority: "high" | "medium" | "low";
  category: "weakness" | "revision" | "pace" | "balance" | "motivation";
  message: string;
  actionHref?: string;
  actionText?: string;
}

export interface StudyRecommendation {
  nextFocus: string;
  reason: string;
  estimatedTimeMinutes: number;
  difficulty: "easy" | "medium" | "hard";
}

/**
 * Analyze weak topics and generate coach suggestions
 */
export function generateCoachSuggestions(
  syllabus: Record<string, ChapterProgress[]>,
  mistakeCount: number,
  currentStreak: number,
  recentStudyMinutes: number
): CoachSuggestion[] {
  const suggestions: CoachSuggestion[] = [];

  // Identify the weakest subject
  const allChapters = Object.entries(syllabus).flatMap(([subject, chapters]) =>
    chapters.map((ch) => ({ subject, ...ch }))
  );

  const weakestChapter = allChapters.reduce((prev, current) =>
    (prev.completion || 0) > (current.completion || 0) ? current : prev
  );

  if (weakestChapter && (weakestChapter.completion || 0) < 50) {
    suggestions.push({
      priority: "high",
      category: "weakness",
      message: `Your ${weakestChapter.subject} chapter "${weakestChapter.name}" is only ${weakestChapter.completion}% complete. Time to focus here!`,
      actionHref: "/mistakes",
      actionText: "Review weak topics",
    });
  }

  // Check for high mistake count
  if (mistakeCount > 10) {
    suggestions.push({
      priority: "high",
      category: "revision",
      message: `You have ${mistakeCount} mistakes logged. Let's work on spaced repetition to solidify concepts.`,
      actionHref: "/revisions",
      actionText: "Start revision cycle",
    });
  }

  // Motivation: Streak
  if (currentStreak < 3) {
    suggestions.push({
      priority: "medium",
      category: "motivation",
      message: "Your study streak is low. Consistent daily effort builds momentum!",
      actionHref: "/study",
      actionText: "Start a study session",
    });
  } else if (currentStreak >= 7) {
    suggestions.push({
      priority: "low",
      category: "motivation",
      message: `🔥 Amazing ${currentStreak}-day streak! Keep the momentum going!`,
    });
  }

  // Study balance check
  const physicsCompletion = syllabus.Physics?.[0]?.completion || 0;
  const chemistryCompletion = syllabus.Chemistry?.[0]?.completion || 0;
  const mathsCompletion = syllabus.Maths?.[0]?.completion || 0;

  const avgCompletion = (physicsCompletion + chemistryCompletion + mathsCompletion) / 3;
  const maxCompletion = Math.max(physicsCompletion, chemistryCompletion, mathsCompletion);

  if (maxCompletion - (Math.min(physicsCompletion, chemistryCompletion, mathsCompletion) || 0) > 30) {
    suggestions.push({
      priority: "medium",
      category: "balance",
      message: "Your subject progress is imbalanced. Focus on the lagging subjects.",
    });
  }

  // Pace assessment
  if (recentStudyMinutes < 30) {
    suggestions.push({
      priority: "low",
      category: "pace",
      message: "You've studied less than 30 minutes today. Consider a short deep work session.",
      actionHref: "/study",
      actionText: "Start Deep Work",
    });
  }

  return suggestions.slice(0, 3); // Return top 3 suggestions
}

/**
 * Get the next chapter to focus on based on priority
 */
export function getNextFocusChapter(
  syllabus: Record<string, ChapterProgress[]>
): StudyRecommendation {
  const allChapters = Object.entries(syllabus).flatMap(([subject, chapters]) =>
    chapters.map((ch) => ({ subject, ...ch }))
  );

  // Priority: lowest completion first
  const nextChapter = allChapters.reduce((prev, current) =>
    (prev.completion || 0) > (current.completion || 0) ? current : prev
  );

  const remainingPyqs = (nextChapter.pyqsTotal || 0) - (nextChapter.pyqsSolved || 0);
  const weakTopicCount = nextChapter.weakTopics?.length || 0;

  // Estimate time: 15 mins per weak topic + 15 mins per remaining PYQ
  let estimatedTime = weakTopicCount * 15 + remainingPyqs * 15;
  estimatedTime = Math.max(30, Math.min(estimatedTime, 120)); // Clamp between 30-120 mins

  let difficulty: "easy" | "medium" | "hard" = "medium";
  if ((nextChapter.completion || 0) < 30) difficulty = "hard";
  else if ((nextChapter.completion || 0) > 80) difficulty = "easy";

  return {
    nextFocus: `${nextChapter.subject} - ${nextChapter.name}`,
    reason: `${nextChapter.completion}% complete, ${weakTopicCount} weak topics, ${remainingPyqs} PYQs remaining`,
    estimatedTimeMinutes: estimatedTime,
    difficulty,
  };
}

/**
 * Calculate daily learning goal based on exam date and syllabus
 */
export function calculateDailyGoal(
  syllabus: Record<string, ChapterProgress[]>,
  daysUntilExam: number
): {
  dailyHours: number;
  chaptersPerWeek: number;
  message: string;
} {
  const allChapters = Object.entries(syllabus).flatMap(([_, chapters]) => chapters);
  const totalChapters = allChapters.length;
  const avgCompletion = allChapters.reduce((sum, ch) => sum + (ch.completion || 0), 0) / totalChapters;
  const chaptersRemaining = totalChapters * ((100 - avgCompletion) / 100);

  const weeksRemaining = Math.ceil(daysUntilExam / 7);
  const chaptersPerWeek = Math.ceil(chaptersRemaining / weeksRemaining);
  const dailyHours = (chaptersPerWeek * 10) / 7; // ~10 hours per chapter

  let message = `You need to complete ${chaptersRemaining.toFixed(0)} more chapters in ${weeksRemaining} weeks.`;
  if (dailyHours > 6) {
    message += " ⚠️ Intense schedule - stay focused!";
  } else if (dailyHours < 2) {
    message += " 👍 Manageable pace!";
  }

  return {
    dailyHours: parseFloat(dailyHours.toFixed(1)),
    chaptersPerWeek,
    message,
  };
}

/**
 * Analyze performance trends and identify patterns
 */
export interface PerformanceAnalysis {
  strongAreas: string[];
  weakAreas: string[];
  overallTrend: "improving" | "declining" | "stable";
  recommendedFocus: string;
}

export function analyzePerformance(
  syllabus: Record<string, ChapterProgress[]>,
  mistakesBySubject: Record<string, number>
): PerformanceAnalysis {
  const allChapters = Object.entries(syllabus).flatMap(([subject, chapters]) =>
    chapters.map((ch) => ({ subject, ...ch }))
  );

  const strongAreas = allChapters
    .filter((ch) => (ch.completion || 0) > 80)
    .map((ch) => `${ch.subject} - ${ch.name}`);

  const weakAreas = allChapters
    .filter((ch) => (ch.completion || 0) < 50)
    .map((ch) => `${ch.subject} - ${ch.name}`);

  // Simple trend analysis based on mistake frequency per subject
  let overallTrend: "improving" | "declining" | "stable" = "stable";
  const mistakeCounts = Object.values(mistakesBySubject);
  if (mistakeCounts.length > 1) {
    const recent = mistakeCounts.slice(-3).reduce((a, b) => a + b, 0);
    const older = mistakeCounts.slice(0, -3).reduce((a, b) => a + b, 0);
    if (recent < older) overallTrend = "improving";
    else if (recent > older) overallTrend = "declining";
  }

  const recommendedFocus = weakAreas[0] || "General Revision";

  return {
    strongAreas: strongAreas.slice(0, 3),
    weakAreas: weakAreas.slice(0, 3),
    overallTrend,
    recommendedFocus,
  };
}

/**
 * Generate motivation message based on user metrics
 */
export function getMotivationalMessage(
  xp: number,
  level: number,
  streak: number,
  totalStudyHours: number
): string {
  const messages: string[] = [];

  if (streak >= 30) {
    messages.push("🏆 30-day streak! You're unstoppable!");
  } else if (streak >= 7) {
    messages.push(`🔥 ${streak}-day streak keeps you consistent!`);
  }

  if (level >= 10) {
    messages.push(`⭐ Level ${level} unlocked! You're a study legend!`);
  } else if (level >= 5) {
    messages.push(`📈 Level ${level} - Keep climbing!`);
  }

  if (totalStudyHours >= 100) {
    messages.push(`📚 ${totalStudyHours} hours invested in mastery!`);
  }

  if (messages.length === 0) {
    messages.push("💪 Every session brings you closer to your goal!");
  }

  return messages[Math.floor(Math.random() * messages.length)];
}
