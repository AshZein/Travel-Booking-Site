import { prisma } from "@/utils/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs"


// User registration
export async function POST(request) {
  const {firstName, lastName, email, password, phoneNumber} = await request.json();

  if (!email || !password || !firstName || !lastName || !phoneNumber) {
    return NextResponse.json({ message: "firstName, lastName, email, password, and phoneNumber are required" }, { status: 400 });
  }

  // email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if(!emailRegex.test(email)){
    return NextResponse.json({ message: "Invalid email format" }, { status: 400 });
  }

  try {
    const existingUser = await prisma.User.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ message: "Email already in use" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: hashedPassword,
        phoneNumber: phoneNumber
      },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        phoneNumber: true
      }
    });

    return NextResponse.json({ user: newUser }, {message: "User created successfully"}, {status: 201});
  } catch (error) {
    console.log(error.stack);
    return NextResponse.json({ message: "Error creating user" }, { status: 500 });
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