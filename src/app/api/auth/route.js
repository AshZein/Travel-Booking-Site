import { NextResponse } from "next/server";
import { verifyRefreshToken, generateToken } from "@/utils/auth";

export async function POST(request) {
    try {
        const { refreshToken } = await request.json();
        
        if (!refreshToken) {
            return NextResponse.json({ message: "Refresh token is required" }, { status: 400 });
        }

        const user = verifyRefreshToken(refreshToken);

        if (!user) {
            return NextResponse.json({ message: "Invalid refresh token" }, { status: 401 });
        }

        const newAccessToken = generateToken({
            userId: user.userId,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
          });

          return NextResponse.json({ accessToken: newAccessToken }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Failed to refresh token", error: error.message }, { status: 500 });
    }
}

export async function PATCH() {
    return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
}

export async function GET() {
    return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
}

export async function PUT() {
    return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
}

export async function DELETE() {
    return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
}