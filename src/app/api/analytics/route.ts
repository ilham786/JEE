import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * GET /api/analytics?userId=...&days=30
 * Get aggregated analytics for user (study time, focus score, streaks, etc)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");
    const days = parseInt(searchParams.get("days") || "30");

    if (!userId) {
      return NextResponse.json(
        { error: "userId required" },
        { status: 400 }
      );
    }

    // Fetch user
    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        studySessions: {
          where: {
            startTime: {
              gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
            },
          },
          orderBy: { startTime: "desc" },
        },
        mistakes: true,
        distractionLogs: {
          where: {
            timestamp: {
              gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Calculate analytics
    const totalStudyMinutes = user.studySessions.reduce(
      (sum, session) => sum + session.durationMinutes,
      0
    );

    const avgFocusScore =
      user.studySessions.length > 0
        ? Math.round(
            user.studySessions.reduce(
              (sum, session) => sum + (session.focusScore || 0),
              0
            ) / user.studySessions.length
          )
        : 0;

    const totalDistractionMinutes = user.distractionLogs.reduce(
      (sum, log) => sum + log.durationMinutes,
      0
    );

    // Sessions by subject
    const sessionsBySubject: Record<string, number> = {};
    user.studySessions.forEach((session) => {
      sessionsBySubject[session.subject] =
        (sessionsBySubject[session.subject] || 0) + session.durationMinutes;
    });

    // Mistakes by subject
    const mistakesBySubject: Record<string, number> = {};
    user.mistakes.forEach((mistake) => {
      mistakesBySubject[mistake.subject] =
        (mistakesBySubject[mistake.subject] || 0) + 1;
    });

    // Daily breakdown
    const dailyData: Record<string, any> = {};
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split("T")[0];

      const dailySessions = user.studySessions.filter(
        (session) => session.startTime.toISOString().split("T")[0] === dateStr
      );

      const dailyMinutes = dailySessions.reduce(
        (sum, session) => sum + session.durationMinutes,
        0
      );

      dailyData[dateStr] = {
        date: dateStr,
        studyMinutes: dailyMinutes,
        sessions: dailySessions.length,
        avgFocus:
          dailySessions.length > 0
            ? Math.round(
                dailySessions.reduce(
                  (sum, s) => sum + (s.focusScore || 0),
                  0
                ) / dailySessions.length
              )
            : 0,
      };
    }

    return NextResponse.json({
      success: true,
      analytics: {
        period: { days, startDate: new Date(Date.now() - days * 24 * 60 * 60 * 1000), endDate: new Date() },
        totalStudyMinutes,
        totalSessions: user.studySessions.length,
        avgFocusScore,
        totalDistractionMinutes,
        sessionsBySubject,
        mistakesBySubject,
        totalMistakes: user.mistakes.length,
        dailyData: Object.values(dailyData),
        userMetrics: {
          xp: user.xp,
          level: user.level,
          currentStreak: user.currentStreak,
          longestStreak: user.longestStreak,
        },
      },
    });
  } catch (error) {
    console.error("Analytics retrieval failed:", error);
    return NextResponse.json(
      { error: "Failed to retrieve analytics" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/analytics/daily
 * Create or update daily analytics entry
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, date, totalStudyMinutes, deepWorkMinutes, distractedMinutes, focusScore } = body;

    if (!userId || !date) {
      return NextResponse.json(
        { error: "userId and date required" },
        { status: 400 }
      );
    }

    const dailyDate = new Date(date);
    dailyDate.setHours(0, 0, 0, 0);

    // Check if entry exists
    const existing = await db.dailyAnalytics.findFirst({
      where: {
        userId,
        date: dailyDate,
      },
    });

    let analytics;
    if (existing) {
      analytics = await db.dailyAnalytics.update({
        where: { id: existing.id },
        data: {
          totalStudyMinutes: totalStudyMinutes || existing.totalStudyMinutes,
          deepWorkMinutes: deepWorkMinutes || existing.deepWorkMinutes,
          distractedMinutes: distractedMinutes || existing.distractedMinutes,
          focusScore: focusScore || existing.focusScore,
        },
      });
    } else {
      analytics = await db.dailyAnalytics.create({
        data: {
          userId,
          date: dailyDate,
          totalStudyMinutes: totalStudyMinutes || 0,
          deepWorkMinutes: deepWorkMinutes || 0,
          distractedMinutes: distractedMinutes || 0,
          focusScore: focusScore || 0,
        },
      });
    }

    return NextResponse.json({
      success: true,
      analytics,
    });
  } catch (error) {
    console.error("Daily analytics creation failed:", error);
    return NextResponse.json(
      { error: "Failed to create daily analytics" },
      { status: 500 }
    );
  }
}
