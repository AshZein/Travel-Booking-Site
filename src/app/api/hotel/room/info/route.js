import { prisma } from "@/utils/db";
import { NextResponse } from "next/server"
import { verifyToken } from "@/utils/auth";
import { numberRoomAvailable } from "@/utils/hotel";
import { sendNotification } from "@/utils/notification";

export async function POST(){
    return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
}

export async function GET(request){

    const checkInS = request.nextUrl.searchParams.get("checkIn");
    const checkOutS = request.nextUrl.searchParams.get("checkOut"); 
    const hotelId = request.nextUrl.searchParams.get("hotelId"); 
    const hotel = await prisma.Hotel.findFirst({
        where: {
            hotelId: Number(hotelId),
        },
      });
    if (!hotel) {
        return NextResponse.json({ message: "hotel not found" }, { status: 400 });
    }  
    const checkIn = new Date(checkInS); 
    const checkOut = new Date(checkOutS);
    const rooms = await prisma.HotelRoomType.findMany({
        where: { hotelId: hotel.hotelId},
        select: {
            roomId: true,
            hotelId: true,
            roomType: true,
            price: true,
            numberAvailable: true,
            amenities: true 
        }
    });
    const roomInfo = await numberRoomAvailable(hotel.hotelId, checkIn, checkOut, true); 
    for (const element of rooms) {
        const availability = roomInfo.rooms[element.roomId];
        element.roomAvailability = availability;       
    }
    return NextResponse.json(rooms)
    
}

export async function PATCH(request) {
    return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
}

export async function PUT() {
    return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
}

export async function DELETE() {
    return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
}