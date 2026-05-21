import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/auth/login
 * Mock authentication endpoint - returns a user object with token
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    // Mock user for demo - accept any email/password
    const user = {
      id: "user-123",
      email,
      name: "JEE Aspirant",
      xp: 3450,
      level: 4,
      currentStreak: 12,
      longestStreak: 21,
      monkModeEnabled: false,
      createdAt: new Date().toISOString(),
    };

    // Mock token (in production, this would be a JWT)
    const token = Buffer.from(`${email}:${password}`).toString("base64");

    return NextResponse.json({
      success: true,
      user,
      token,
      message: "Mock authentication successful",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/auth/session
 * Get current session/user info
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json(
        { error: "No authorization header" },
        { status: 401 }
      );
    }

    // Mock user retrieval
    const user = {
      id: "user-123",
      email: "student@jee.com",
      name: "JEE Aspirant",
      xp: 3450,
      level: 4,
      currentStreak: 12,
      longestStreak: 21,
      monkModeEnabled: false,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Session retrieval failed" },
      { status: 500 }
    );
  }
}
