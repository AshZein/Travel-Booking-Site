import { prisma } from "@/utils/db";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function PUT(req) {
  try {
    const authHeader = req.headers.get("Authorization");
    //console.log("Auth Header:", authHeader);

    const token = authHeader?.split(" ")[1];
    //console.log("Extracted Token:", token);

    if (!token) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
      //console.log("Decoded JWT:", decoded);
    } catch (err) {
      console.log("TOKEN VERIFY FAILED:", err.message);
      return new Response(JSON.stringify({ message: "Invalid or expired token" }), { status: 401 });
    }

    const userId = decoded.userId;
    if (!userId) {
      return new Response(JSON.stringify({ message: "Missing userId in token" }), { status: 401 });
    }

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
      where: { userId }, // match your schema
      data: { [field]: value },
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error("Error updating user:", err);
    return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
  }
}