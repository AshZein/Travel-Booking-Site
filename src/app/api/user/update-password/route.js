import { prisma } from "@/utils/db";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function PUT(req) {
  try {
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return new Response(JSON.stringify({ message: "Invalid or expired token" }), { status: 401 });
    }

    const userId = decoded.userId;
    if (!userId) {
      return new Response(JSON.stringify({ message: "Invalid token" }), { status: 401 });
    }

    const body = await req.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword || newPassword.length < 6) {
      return new Response(
        JSON.stringify({ message: "Both fields are required. New password must be at least 6 characters." }),
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { userId },
    });

    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
    }

    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch) {
      return new Response(JSON.stringify({ message: "Current password is incorrect" }), { status: 401 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { userId },
      data: { password: hashedPassword },
    });

    return new Response(JSON.stringify({ success: true, message: "Password updated successfully" }), { status: 200 });

  } catch (error) {
    console.error("Password update error:", error);
    return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
  }
}