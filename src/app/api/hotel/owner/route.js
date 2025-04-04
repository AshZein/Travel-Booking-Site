// api/hotel/list
import { prisma } from "@/utils/db";
import { NextResponse } from "next/server";
import { numberRoomAvailable } from "@/utils/hotel";
import { isValidDate } from "@/utils/inputValid";
import { verifyToken } from "@/utils/auth";


export async function GET(request){
    // assumptions:
    // - minStarRating and maxStarRating are input as max range in the front end (i.e. 1 and 5 respectively)
    // - startPrice and endPrice are input as max range in the front end (e.g. 0 and 1000 respectively)
    const { searchParams } = new URL(request.url);
    const user = verifyToken(request);
    if (!user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const userId = user.userId;
    const hotels = await prisma.hotelManager.findMany({
        where: {
          userId: userId, // Filter by userId
        },
        include: {
          hotel: true, // Include hotel details in the result
        },
      });
      return NextResponse.json(hotels); 
}

export async function PATCH() {
    return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
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