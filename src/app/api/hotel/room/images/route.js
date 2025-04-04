import { prisma } from "@/utils/db";
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
    const file = formData.get("image"); // Ensure Postman sends the file as "image"
    const roomId = formData.get("roomId");

    console.log("🔍 Received Form Data for Room Image:", { file, roomId });

    if (!file) {
      return NextResponse.json({ message: "Missing required field: image" }, { status: 400 });
    }
    if (!roomId) {
      return NextResponse.json({ message: "Missing required field: roomId" }, { status: 400 });
    }

    // Convert roomId to a number
    const roomIdNum = Number(roomId);
    if (isNaN(roomIdNum)) {
      return NextResponse.json({ message: "Invalid roomId format" }, { status: 400 });
    }

    const hotelId = await prisma.HotelRoomType.findUnique({
      where: { roomId: roomIdNum },
      select: { hotelId: true },
    });

    if (!hotelId) {
      return NextResponse.json({ message: "Room not found" }, { status: 404 });
    }

    // Check if user is the manager of the hotel
    const manager = await prisma.HotelManager.findUnique({
      where: { userId_hotelId: { userId: user.userId, hotelId: hotelId.hotelId } },
      
    });

    if (!manager) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Call the image handler function
    const response = await handleImageUpload(file, "hotel_room", roomIdNum);

    await prisma.RoomImage.create({
      data: {
        roomId: roomIdNum,
        image: response.filePath,
      },
    });

    return NextResponse.json(response, { status: response.status });

  } catch (error) {
    //console.error("❌ Error processing room image:", error.message);
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url); // Use the `request` parameter
    const roomId = searchParams.get("roomId");
    console.log("Fetching image for roomId:", roomId);

    if (!roomId) {
      return NextResponse.json({ message: "Missing roomId" }, { status: 400 });
    }

    const roomImages = await prisma.RoomImage.findMany({
      where: { roomId: Number(roomId) },
    });

    if (!roomImages || roomImages.length === 0) {
      return NextResponse.json({ message: "Image not found" }, { status: 404 });
    }

    return NextResponse.json({ images: roomImages.map((img) => img.image) }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}

export async function PUT() {
  return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
}
