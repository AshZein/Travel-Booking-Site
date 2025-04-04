import { prisma } from "@/utils/db";
import { NextResponse } from "next/server";
import { verifyToken } from "@/utils/auth";

// Get user profile
export async function GET(request) {
  try {
    // verify user token
    const userToken = verifyToken(request);
    if (!userToken) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    const user = await prisma.User.findUnique({
      where: { userId: userToken.userId },
      select: { userId: true, firstName: true, lastName: true, email: true, phoneNumber: true },
    });

    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    return NextResponse.json({ user });
  } catch (error) {
    console.log(error.stack);
    return NextResponse.json({ message: "Error fetching user profile" }, { status: 500 });
  }
}

// Update user profile
export async function PATCH(request) {
  try {
    const { firstName, lastName, newEmail, oldEmail, phoneNumber } = await request.json();

    if (!oldEmail) return NextResponse.json({ message: "Old Email is required" }, { status: 400 });
   

    // Filter out fields that are null or undefined
    const data = {};
    if (firstName !== undefined) data.firstName = firstName;
    if (lastName !== undefined) data.lastName = lastName;
    if (email !== undefined){
      // email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if(!emailRegex.test(email)){
        return NextResponse.json({ message: "Invalid email format" }, { status: 400 });
      }

      data.email = newEmail;
    }
    if (phoneNumber !== undefined) data.phoneNumber = phoneNumber;

    const updatedUser = await prisma.User.update({
      where: { email: oldEmail},
      data,
      select: {firstName: true, lastName: true, email: true, phoneNumber: true},
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    if (error.code === 'P2025') {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Error updating user profile" }, { status: 500 });
  }
}

export async function POST(){
  return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
}