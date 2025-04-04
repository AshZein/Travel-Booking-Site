import { prisma } from "@/utils/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const JWT_EXPIRY_TIME = process.env.JWT_EXPIRY_TIME;
const JWT_REFRESH_EXPIRY_TIME = process.env.JWT_REFRESH_EXPIRY_TIME;

// User login
export async function POST(request) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
  }

  // email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if(!emailRegex.test(email)){
    return NextResponse.json({ message: "Invalid email format" }, { status: 400 });
  }

  try {
    const user = await prisma.User.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    const payload = { 
        userId: user.userId,
        email : user.email,
        firstName : user.firstName,
        lastName : user.lastName
    };

    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY_TIME });
    const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRY_TIME });
    return NextResponse.json({ accessToken, refreshToken });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
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
