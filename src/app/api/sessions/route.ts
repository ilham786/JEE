import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * POST /api/sessions
 * Create a new study session
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, subject, chapter, taskType, mode, durationMinutes, notes, focusScore } = body;

    if (!userId || !subject || !chapter || !taskType || !mode) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const session = await db.studySession.create({
      data: {
        userId,
        subject,
        chapter,
        taskType,
        mode,
        startTime: new Date(),
        endTime: new Date(),
        durationMinutes: durationMinutes || 50,
        focusScore: focusScore || 80,
        notes: notes || "",
      },
    });

    return NextResponse.json({
      success: true,
      session,
    });
  } catch (error) {
    console.error("Session creation failed:", error);
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/sessions?userId=...&limit=10
 * Get study sessions for a user
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");
    const limit = parseInt(searchParams.get("limit") || "10");

    if (!userId) {
      return NextResponse.json(
        { error: "userId required" },
        { status: 400 }
      );
    }

    const sessions = await db.studySession.findMany({
      where: { userId },
      take: limit,
      orderBy: { startTime: "desc" },
    });

    return NextResponse.json({
      success: true,
      sessions,
      total: sessions.length,
    });
  } catch (error) {
    console.error("Session retrieval failed:", error);
    return NextResponse.json(
      { error: "Failed to retrieve sessions" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/sessions/[id]
 * Update a study session
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, notes, focusScore, endTime } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Session ID required" },
        { status: 400 }
      );
    }

    const session = await db.studySession.update({
      where: { id },
      data: {
        notes: notes || undefined,
        focusScore: focusScore || undefined,
        endTime: endTime ? new Date(endTime) : undefined,
      },
    });

    return NextResponse.json({
      success: true,
      session,
    });
  } catch (error) {
    console.error("Session update failed:", error);
    return NextResponse.json(
      { error: "Failed to update session" },
      { status: 500 }
    );
  }
}
