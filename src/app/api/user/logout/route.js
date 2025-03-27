import { NextResponse } from "next/server";
import { verifyRefreshToken } from "@/utils/auth"; 
// If you have a database table for refresh tokens, import prisma or your DB logic

export async function POST(request) {
  try {
    const { refreshToken } = await request.json();

    // If no refreshToken in request
    if (!refreshToken) {
      return NextResponse.json(
        { message: "Refresh token is required" },
        { status: 400 }
      );
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      return NextResponse.json(
        { message: "Invalid refresh token" },
        { status: 401 }
      );
    }

    // If you store refresh tokens in the DB, remove or blacklist it here:
    // await prisma.refreshToken.delete({ where: { token: refreshToken } });
    // or place it on a blocklist, etc.

    // Return success response
    return NextResponse.json({ message: "Logout successful" }, { status: 200 });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { message: "Server error during logout", error: error.message },
      { status: 500 }
    );
  }
}

// Block unused methods to match your existing style
export async function GET() {
  return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
}

export async function PATCH() {
  return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
}
