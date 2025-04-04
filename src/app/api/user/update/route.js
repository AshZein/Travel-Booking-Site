import { prisma } from "@/utils/db";
import jwt from "jsonwebtoken";

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

    const userId = decoded.userId || decoded.id; // Update to match your token

    const body = await req.json();
    const allowedFields = ["firstName", "lastName", "email", "phoneNumber"];
    const field = Object.keys(body)[0];
    const value = body[field];

    if (!allowedFields.includes(field)) {
      return new Response(JSON.stringify({ message: "Invalid field" }), { status: 400 });
    }

    if (typeof value !== "string" || value.trim() === "") {
      return new Response(JSON.stringify({ message: "Invalid value" }), { status: 400 });
    }

    await prisma.user.update({
      where: { userId: userId }, 
      data: { [field]: value },
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error("Error updating user:", err);
    return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
  }
}