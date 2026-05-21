import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isOverdue, getOverdueItems, getUpcomingItems } from "@/lib/spaced-rep";

/**
 * GET /api/revisions?userId=...&overdue=true&upcoming=7
 * Get revisions for a user with filtering options
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");
    const showOverdue = searchParams.get("overdue") === "true";
    const upcomingDays = parseInt(searchParams.get("upcoming") || "0");

    if (!userId) {
      return NextResponse.json(
        { error: "userId required" },
        { status: 400 }
      );
    }

    let revisions = await db.revision.findMany({
      where: { userId },
      orderBy: { scheduledDate: "asc" },
    });

    // Convert to format compatible with spaced-rep helpers
    const revisionsWithNextRevision = revisions.map((r) => ({
      ...r,
      nextRevisionAt: r.scheduledDate.toISOString(),
    }));

    // Apply filters
    if (showOverdue) {
      const overdueRevisions = getOverdueItems(revisionsWithNextRevision);
      revisions = overdueRevisions.map((r) => {
        const originalRevision = revisions.find((rev) => rev.id === r.id);
        return originalRevision!;
      });
    }
    if (upcomingDays > 0) {
      const upcomingRevisions = getUpcomingItems(revisionsWithNextRevision, upcomingDays);
      revisions = upcomingRevisions.map((r) => {
        const originalRevision = revisions.find((rev) => rev.id === r.id);
        return originalRevision!;
      });
    }

    return NextResponse.json({
      success: true,
      revisions,
      total: revisions.length,
    });
  } catch (error) {
    console.error("Revision retrieval failed:", error);
    return NextResponse.json(
      { error: "Failed to retrieve revisions" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/revisions
 * Create a new revision entry
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, mistakeId, subject, chapter, scheduledDate } = body;

    if (!userId || !subject || !chapter) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const revision = await db.revision.create({
      data: {
        userId,
        mistakeId: mistakeId || null,
        subject,
        chapter,
        scheduledDate: new Date(scheduledDate),
        status: "Pending",
        revisionCycle: 1,
      },
    });

    return NextResponse.json({
      success: true,
      revision,
    });
  } catch (error) {
    console.error("Revision creation failed:", error);
    return NextResponse.json(
      { error: "Failed to create revision" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/revisions/[id]
 * Update revision status (mark as completed)
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, completedAt } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Revision ID required" },
        { status: 400 }
      );
    }

    const revision = await db.revision.update({
      where: { id },
      data: {
        status: status || undefined,
        completedAt: completedAt ? new Date(completedAt) : undefined,
      },
    });

    return NextResponse.json({
      success: true,
      revision,
    });
  } catch (error) {
    console.error("Revision update failed:", error);
    return NextResponse.json(
      { error: "Failed to update revision" },
      { status: 500 }
    );
  }
}
