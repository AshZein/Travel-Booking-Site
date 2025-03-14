import { handleImageUpload } from "@/utils/imageHandler";
import { verifyToken } from "@/utils/auth";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const user = verifyToken(request);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get("image"); 

    console.log("🔍 Received Form Data for User Image:", { file, userId: user.userId });

    if (!file) {
      return NextResponse.json({ message: "Missing required field: image" }, { status: 400 });
    }

    // Call the image handler function to save the file
    const response = await handleImageUpload(file, "user", user.userId);
    return NextResponse.json(response, { status: response.status });

  } catch (error) {
    console.error("❌ Error processing user image:", error.message);
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
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
