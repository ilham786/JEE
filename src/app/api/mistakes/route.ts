import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { calculateNextReviewDate } from "@/lib/spaced-rep";

/**
 * POST /api/mistakes
 * Create a new mistake entry
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, subject, chapter, errorType, description, explanation, screenshotUrl } = body;

    if (!userId || !subject || !chapter || !errorType || !description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Calculate initial revision date (1 day from now)
    const nextRevisionSchedule = calculateNextReviewDate(0, 3);

    const mistake = await db.mistake.create({
      data: {
        userId,
        subject,
        chapter,
        errorType,
        description,
        explanation: explanation || "",
        screenshotUrl: screenshotUrl || null,
        nextRevisionAt: nextRevisionSchedule.nextReviewDate,
      },
    });

    return NextResponse.json({
      success: true,
      mistake,
    });
  } catch (error) {
    console.error("Mistake creation failed:", error);
    return NextResponse.json(
      { error: "Failed to create mistake" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/mistakes?userId=...&subject=...&limit=10
 * Get mistakes for a user with optional filtering
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");
    const subject = searchParams.get("subject");
    const limit = parseInt(searchParams.get("limit") || "10");

    if (!userId) {
      return NextResponse.json(
        { error: "userId required" },
        { status: 400 }
      );
    }

    const mistakes = await db.mistake.findMany({
      where: {
        userId,
        ...(subject && { subject }),
      },
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      mistakes,
      total: mistakes.length,
    });
  } catch (error) {
    console.error("Mistake retrieval failed:", error);
    return NextResponse.json(
      { error: "Failed to retrieve mistakes" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/mistakes/[id]
 * Update a mistake (mark as revised, add explanation, etc)
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, explanation, quality } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Mistake ID required" },
        { status: 400 }
      );
    }

    // Fetch current mistake
    const currentMistake = await db.mistake.findUnique({
      where: { id },
    });

    if (!currentMistake) {
      return NextResponse.json(
        { error: "Mistake not found" },
        { status: 404 }
      );
    }

    // Calculate next revision date
    const nextRevisionSchedule = calculateNextReviewDate(
      currentMistake.timesRevised,
      quality || 3
    );

    const updatedMistake = await db.mistake.update({
      where: { id },
      data: {
        explanation: explanation || currentMistake.explanation,
        timesRevised: currentMistake.timesRevised + 1,
        nextRevisionAt: nextRevisionSchedule.nextReviewDate,
      },
    });

    return NextResponse.json({
      success: true,
      mistake: updatedMistake,
      nextReview: nextRevisionSchedule,
    });
  } catch (error) {
    console.error("Mistake update failed:", error);
    return NextResponse.json(
      { error: "Failed to update mistake" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/mistakes/[id]
 * Delete a mistake
 */
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Mistake ID required" },
        { status: 400 }
      );
    }

    await db.mistake.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Mistake deleted",
    });
  } catch (error) {
    console.error("Mistake deletion failed:", error);
    return NextResponse.json(
      { error: "Failed to delete mistake" },
      { status: 500 }
    );
  }
}
