import { prisma } from "@/utils/db";
import { handleImageUpload } from "@/utils/imageHandler";
import { verifyToken } from "@/utils/auth";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const user = verifyToken(req);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Parse form data (Next.js App Router uses req.formData())
    const formData = await req.formData();
    const file = formData.get("image"); // Ensure Postman sends the file as "image"
    const hotelId = formData.get("hotelId");
    const type = formData.get("type");

    console.log(file, hotelId, type);

    if (!hotelId || !type || !file) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    if (!["hotel_itself", "hotel_logo", "hotel_room"].includes(type)) {
      return NextResponse.json({ message: "Invalid image type" }, { status: 400 });
    }

    // Check if user is the manager of the hotel
    const manager = await prisma.HotelManager.findUnique({
      where: { userId_hotelId: { userId: user.userId, hotelId: Number(hotelId) } },
      
    });

    if (!manager) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Call the image handler function (which just saves the file)
    const response = await handleImageUpload(file, type, hotelId);

    if (type === "hotel_itself"){
      await prisma.HotelImage.create({
        data: {
          hotelId: Number(hotelId),
          image: response.filePath,
        },
      });
    } else if (type === "hotel_logo") {
      await prisma.Hotel.update({
        where: { hotelId: Number(hotelId) },
        data: { logo: response.filePath },
      });
    }

    return NextResponse.json(response, { status: response.status });

  } catch (error) {
    //console.error("❌ Error processing image:", error);
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
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
