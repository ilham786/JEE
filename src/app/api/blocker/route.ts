import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * GET /api/blocker?userId=...
 * Get all blocked websites for a user
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId required" },
        { status: 400 }
      );
    }

    const blockedWebsites = await db.blockedWebsite.findMany({
      where: { userId, isActive: true },
    });

    return NextResponse.json({
      success: true,
      blockedWebsites,
      total: blockedWebsites.length,
    });
  } catch (error) {
    console.error("Blocked websites retrieval failed:", error);
    return NextResponse.json(
      { error: "Failed to retrieve blocked websites" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/blocker
 * Add a website to blocklist
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, domain } = body;

    if (!userId || !domain) {
      return NextResponse.json(
        { error: "userId and domain required" },
        { status: 400 }
      );
    }

    // Normalize domain
    const normalizedDomain = domain
      .toLowerCase()
      .replace(/^(https?:\/\/)?(www\.)?/, "");

    // Check if already exists
    const existing = await db.blockedWebsite.findFirst({
      where: { userId, domain: normalizedDomain },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Domain already blocked" },
        { status: 409 }
      );
    }

    const blockedWebsite = await db.blockedWebsite.create({
      data: {
        userId,
        domain: normalizedDomain,
        isActive: true,
      },
    });

    return NextResponse.json({
      success: true,
      blockedWebsite,
    });
  } catch (error) {
    console.error("Blocker creation failed:", error);
    return NextResponse.json(
      { error: "Failed to add blocked website" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/blocker/[id]
 * Remove a website from blocklist
 */
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Blocker ID required" },
        { status: 400 }
      );
    }

    const blockedWebsite = await db.blockedWebsite.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json({
      success: true,
      message: "Website unblocked",
      blockedWebsite,
    });
  } catch (error) {
    console.error("Blocker deletion failed:", error);
    return NextResponse.json(
      { error: "Failed to remove blocked website" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/blocker/[id]
 * Toggle blocker status
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, isActive } = body;

    if (!id || isActive === undefined) {
      return NextResponse.json(
        { error: "Blocker ID and isActive status required" },
        { status: 400 }
      );
    }

    const blockedWebsite = await db.blockedWebsite.update({
      where: { id },
      data: { isActive },
    });

    return NextResponse.json({
      success: true,
      blockedWebsite,
    });
  } catch (error) {
    console.error("Blocker update failed:", error);
    return NextResponse.json(
      { error: "Failed to update blocker" },
      { status: 500 }
    );
  }
}
