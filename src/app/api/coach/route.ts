import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  generateCoachSuggestions,
  getNextFocusChapter,
  calculateDailyGoal,
  analyzePerformance,
  getMotivationalMessage,
  type CoachSuggestion,
} from "@/lib/coach-logic";

/**
 * GET /api/coach?userId=...&daysUntilExam=90
 * Get AI coach suggestions and recommendations
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");
    const daysUntilExam = parseInt(searchParams.get("daysUntilExam") || "90");

    if (!userId) {
      return NextResponse.json(
        { error: "userId required" },
        { status: 400 }
      );
    }

    // Fetch user and related data
    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        mistakes: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Mock syllabus data structure (in production, fetch from DB)
    const mockSyllabus = {
      Physics: [
        { id: "p1", name: "Electrostatics", completion: 80, pyqsSolved: 40, pyqsTotal: 60, weakTopics: ["Dipole Integration"], revisionCycles: 2 },
        { id: "p2", name: "Current", completion: 95, pyqsSolved: 55, pyqsTotal: 60, weakTopics: [], revisionCycles: 3 },
        { id: "p3", name: "Magnetism", completion: 40, pyqsSolved: 15, pyqsTotal: 50, weakTopics: ["Ampere's Law"], revisionCycles: 1 },
      ],
      Chemistry: [
        { id: "c1", name: "Chemical Bonding", completion: 100, pyqsSolved: 80, pyqsTotal: 80, weakTopics: [], revisionCycles: 4 },
        { id: "c2", name: "Coordination Compounds", completion: 60, pyqsSolved: 30, pyqsTotal: 50, weakTopics: ["Crystal Field"], revisionCycles: 1 },
        { id: "c3", name: "Gaseous State", completion: 90, pyqsSolved: 40, pyqsTotal: 40, weakTopics: [], revisionCycles: 3 },
      ],
      Maths: [
        { id: "m1", name: "Integration", completion: 70, pyqsSolved: 60, pyqsTotal: 90, weakTopics: ["Wallis Formula"], revisionCycles: 2 },
        { id: "m2", name: "Matrices", completion: 100, pyqsSolved: 60, pyqsTotal: 60, weakTopics: [], revisionCycles: 4 },
        { id: "m3", name: "Trigonometry", completion: 90, pyqsSolved: 50, pyqsTotal: 50, weakTopics: [], revisionCycles: 3 },
      ],
    };

    // Count mistakes by subject
    const mistakesBySubject = {
      Physics: user.mistakes.filter((m) => m.subject === "Physics").length,
      Chemistry: user.mistakes.filter((m) => m.subject === "Chemistry").length,
      Maths: user.mistakes.filter((m) => m.subject === "Maths").length,
    };

    // Generate recommendations
    const suggestions = generateCoachSuggestions(
      mockSyllabus,
      user.mistakes.length,
      user.currentStreak,
      50 // Mock recent study minutes
    );

    const nextFocus = getNextFocusChapter(mockSyllabus);
    const dailyGoal = calculateDailyGoal(mockSyllabus, daysUntilExam);
    const performance = analyzePerformance(mockSyllabus, mistakesBySubject);
    const motivation = getMotivationalMessage(
      user.xp,
      user.level,
      user.currentStreak,
      user.mistakes.length * 0.5 // Mock total study hours
    );

    return NextResponse.json({
      success: true,
      suggestions,
      nextFocus,
      dailyGoal,
      performance,
      motivation,
      userMetrics: {
        xp: user.xp,
        level: user.level,
        streak: user.currentStreak,
        mistakes: user.mistakes.length,
      },
    });
  } catch (error) {
    console.error("Coach suggestions failed:", error);
    return NextResponse.json(
      { error: "Failed to generate coach suggestions" },
      { status: 500 }
    );
  }
}
