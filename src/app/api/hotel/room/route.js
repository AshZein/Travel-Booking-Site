import { prisma } from "@/utils/db";
import { NextResponse } from "next/server"
import { verifyToken } from "@/utils/auth";
import { numberRoomAvailable } from "@/utils/hotel";
import { sendNotification } from "@/utils/notification";

export async function POST(request){
    const user = verifyToken(request);
    if (!user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { hotelId, roomType, price, numberAvailable, amenities } = await request.json();
    if (!hotelId || !roomType || !price || !numberAvailable || !amenities){
        return NextResponse.json({error: 'hotelId, roomType, price, numberAvailable, and amenities are required parameters'}, {status: 400});
    }
    const hotelExists = await prisma.Hotel.findFirst({
        where: {
            hotelId: Number(hotelId),
        },
      });
      if (!hotelExists) {
        return NextResponse.json({ message: "hotel not found" }, { status: 400 });
      }
      if (typeof roomType !== 'string'){
        return NextResponse.json({error: 'roomType must be a string'}, {status: 400});
    }
    if (typeof price !== 'number' || !(Number.isInteger(numberAvailable)) || !(Number.isInteger(hotelId))){
        return NextResponse.json({error: 'price must be a number. numberAvailable and hotelId must be an integer.'}, {status: 400});
    }
    if (!Array.isArray(amenities)){
        return NextResponse.json({error: 'amenities must be an array'}, {status: 400});
    }
    // Check if the user is a hotel manager
    const manager = await prisma.HotelManager.findUnique({
        where: {  
            userId_hotelId: {
                userId: user.userId,
                hotelId: Number(hotelId),
              },
        },
      });
    if (!manager){
        return NextResponse.json({ message: "Unauthorized, you do not have access to make a room" }, { status: 401 });
    }   
    const oldRoom = await prisma.HotelRoomType.findFirst({
        where: {
            hotelId: hotelId,
            roomType: roomType
        }
    });
    if (oldRoom) {
        return NextResponse.json({error: 'Room already exists'}, {status: 400});
      }
      const room = await prisma.HotelRoomType.create(
        {
            data: {
                hotelId,
                roomType,
                price,
                numberAvailable
            }
        }
    );
        for (const element of amenities) {
        const amenity = await prisma.RoomAmenity.create({
            data: {
                roomId: room.roomId,
                amenity: element
            }
    });
    }
    return NextResponse.json(room); 


}

export async function GET(request){
    const decoded = verifyToken(request);
    if (!decoded) {
      return NextResponse.json({ message: "Unauthorized. Invalid token." }, { status: 401 });
    }
    const hotelId = request.nextUrl.searchParams.get("hotelId");
    // Check if the user is a hotel manager
    const manager = await prisma.HotelManager.findUnique({
        where: {  
            userId_hotelId: { 
                userId: decoded.userId, 
                hotelId: Number(hotelId)
            }  
        },
      });
  
      if (!manager) {
        return NextResponse.json({ message: "Unauthorized. You are not a hotel manager." }, { status: 403 });
      }
    const checkIn = request.nextUrl.searchParams.get("checkIn");
    const checkOut = request.nextUrl.searchParams.get("checkOut"); 
    const hotel = await prisma.Hotel.findFirst({
        where: {
            hotelId: Number(hotelId),
        },
      });
    if (!hotel) {
        return NextResponse.json({ message: "hotel not found" }, { status: 400 });
    }  
    const roomInfo = await numberRoomAvailable(hotel.hotelId, new Date(checkIn), new Date(checkOut), true);
    return NextResponse.json(roomInfo);
}

export async function PATCH(request) {
    const decoded = verifyToken(request);
    if (!decoded) {
      return NextResponse.json({ message: "Unauthorized. Invalid token." }, { status: 401 });
    }
    const hotelId = request.nextUrl.searchParams.get("hotelId");
    // Check if the user is a hotel manager
    const manager = await prisma.HotelManager.findUnique({
        where: {  
            userId_hotelId: {
                userId: decoded.userId,
                hotelId: Number(hotelId)
            }
        },
      });
      if (!manager) {
        return NextResponse.json({ message: "Unauthorized. You are not a hotel manager." }, { status: 403 });
      }
    const roomId = request.nextUrl.searchParams.get("roomId");
    const oldRoom = await prisma.HotelRoomType.findFirst({
        where: {
            roomId: Number(roomId)
        }
    });
    if (!oldRoom) {
        return NextResponse.json({error: 'Room does not exist'}, {status: 400});
    }
    const { newRoomCount } = await request.json();
    if (!newRoomCount){
        return NextResponse.json({error: 'newRoomCount is a required parameter'}, {status: 400});
    }
    if (!(Number.isInteger(newRoomCount))){
        return NextResponse.json({error: 'newRoomCount must be an integer.'}, {status: 400});
    }
    const timeDate = new Date();
    const allBookings = await prisma.HotelBooking.findMany({
        where: {
            hotelId: Number(hotelId),
            roomId: Number(roomId),
            bookingCanceled: false   
        }
    });

    await prisma.HotelRoomType.updateMany({
        where: {
            roomId: Number(oldRoom.roomId)
        },
        data: { 
            numberAvailable: newRoomCount
        }

    });
    for (const element of allBookings) {
        const roominfo = await numberRoomAvailable(element.hotelId, element.checkIn, element.checkOut, true);
        const roomAvailability = roominfo.rooms[oldRoom.roomId];
        if (roomAvailability < 0){
            await prisma.hotelBooking.update({
            where: {id: element.id},
            data: {
                bookingCanceled: true,
                canceledDate: new Date()
            }
            
        });
        await sendNotification(element.userId, `Hotel booking with reference ID ${element.referenceId} canceled`, 'USER');
        await sendNotification(manager.userId, `Hotel booking with reference ID ${element.referenceId} canceled`, 'HOTEL_MANAGER');
    }
}


    
    // Now update the canceled bookings in the database

    const updatedRoom = await prisma.HotelRoomType.findUnique({
        where: { roomId: Number(oldRoom.roomId) }
    });
    return NextResponse.json(updatedRoom.numberAvailable);
  }

export async function PUT() {
    return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
}

export async function DELETE() {
    return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
}