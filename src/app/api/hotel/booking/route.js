import { prisma } from "@/utils/db";
import { NextResponse } from "next/server";
import { verifyToken } from "@/utils/auth";
import { sendNotification } from "@/utils/notification";
import { generateHotelRef } from "../../../../utils/hotel";
import { numberRoomAvailable } from "../../../../utils/hotel";


export async function POST(request){
    // verify user token
    const user = verifyToken(request);
    if (!user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // retrieve parameters
    const {  email, hotelId, roomId, price, checkIn, checkOut } = await request.json();


    const checkInS = new Date(checkIn); 
    const checkOutS = new Date(checkOut);
    

    if (!email || !hotelId || !roomId || !price || !checkInS || !checkOutS){
        return NextResponse.json({error: 'email, hotelId, roomId, price, checkIn, checkOut, and bookingMade are required parameters'}, {status: 400});
    }

    // input type checking
    if (typeof email !== 'string' || typeof hotelId !== 'number' || typeof roomId !== 'number' || !(Number.isInteger(price))){
        return NextResponse.json({error: 'email must be a string. hotelId, and roomId must be a number. price must be an integer.'}, {status: 400});
    }
    if (isNaN(checkInS.getTime()) || isNaN(checkOutS.getTime()) ){
        return NextResponse.json({error: 'checkIn, checkOut must be a valid DateTime'}, {status: 400});
    }

    const hotelExists = await prisma.hotel.findFirst({
        where: {
            hotelId: Number(hotelId),
        },
        });
        if (!hotelExists) {
        return NextResponse.json({ message: "hotel not found" }, { status: 400 });
        }
        const oldRoom = await prisma.hotelRoomType.findFirst({
        where: {
            roomId: roomId
        }
    });

    let userId = user.userId;

    if (!oldRoom) {
        return NextResponse.json({error: 'roomType doesnt exist for this hotel'}, {status: 400});
    }

    const userExists = await prisma.user.findFirst({
    where: {
        userId: Number(userId),
    },
    });

    if (!userExists) {
        return NextResponse.json({ message: "user not found" }, { status: 400 });
    }

    
    const referenceId = await generateHotelRef();
    const numRoomavail = await numberRoomAvailable(hotelExists.hotelId, checkInS, checkOutS, true);
    const roomAvailability = numRoomavail.rooms[roomId];
    console.log(roomAvailability);
    if (roomAvailability <= 0){
        return NextResponse.json({ message: "This room is not available for this date" }, { status: 404 });
    }
    const booking = await prisma.hotelBooking.create(
    {
        data: {
            userId,
            referenceId,
            hotelId,
            roomId,
            price,
            checkIn: checkInS,
            checkOut: checkOutS,
            bookingMade: new Date(),
        }
    });
    await sendNotification(userId, `Hotel booking made with reference ID ${referenceId}`, 'USER');
    return NextResponse.json(booking, {status: 201}); 
}

export async function GET(request){
    // verify user token
    const user = verifyToken(request);
    if (!user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    const hotelId = Number(request.nextUrl.searchParams.get("hotelId"));
    const manager = await prisma.HotelManager.findUnique({
        where: {  
            userId_hotelId: {
                userId: user.userId,
                hotelId: Number(hotelId),
              },
        },
      });
    if (!manager){
        return NextResponse.json({ message: "Unauthorized, you do not have access to see bookings" }, { status: 401 });
    }   
    const hotelExists = await prisma.hotel.findFirst({
        where: {
            hotelId: Number(hotelId),
        },
        });
        if (!hotelExists) {
        return NextResponse.json({ message: "hotel not found" }, { status: 400 });
        }
    const date = request.nextUrl.searchParams.get("date"); 
    const roomType = request.nextUrl.searchParams.get("roomType"); 
    if (date === null && roomType === null){
        const bookings = await prisma.hotelBooking.findMany({
            where: {
                hotelId: Number(hotelId)
            }
        });
        return NextResponse.json(bookings);
    }
    if (date === null && roomType !== null){
        const oldRoom = await prisma.hotelRoomType.findFirst({
            where: {
                hotelId: hotelId,
                roomType: roomType
            }
        });
        if (!oldRoom) {
            return NextResponse.json({error: 'roomType doesnt exist for this hotel'}, {status: 400});
            }
        const bookings = await prisma.hotelBooking.findMany({
            where: {
                hotelId: Number(hotelId),
                roomId: Number(oldRoom.roomId)
            }
        });
        return NextResponse.json(bookings);

    }
    
    else if (date !== null && roomType === null){
        const timeDate = new Date(date);
        if (isNaN(timeDate.getTime())) {
            return NextResponse.json({error: 'Not a proper date'}, {status: 400});
            }
        const bookings = await prisma.hotelBooking.findMany({
            where: {
                hotelId: Number(hotelId),
                checkIn: {
                    lte: timeDate,
                },
                checkOut: {
                    gte: timeDate
                }     
            }
        });
        return NextResponse.json(bookings);
    }
    else{
        const oldRoom = await prisma.hotelRoomType.findFirst({
            where: {
                hotelId: hotelId,
                roomType: roomType
            }
        });
        if (!oldRoom) {
            return NextResponse.json({error: 'roomType doesnt exist for this hotel'}, {status: 400});
            }
        const timeDate = new Date(date);
        if (isNaN(timeDate.getTime())) {
            return NextResponse.json({error: 'Not a proper date'}, {status: 400});
        }  
        const bookings = await prisma.hotelBooking.findMany({
            where: {
                hotelId: hotelId,
                roomId: Number(oldRoom.roomId),
                checkIn: {
                    lte: timeDate,
                },
                checkOut: {
                    gte: timeDate
                }     
            }
        });
        return NextResponse.json(bookings);
    }
}   

export async function PATCH(request) {
    try {
        // Verify user token
        const user = verifyToken(request);
        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        // Parse the request body to get the referenceId
        const { referenceId } = await request.json();
        if (!referenceId) {
            return NextResponse.json({ message: "Booking reference is required" }, { status: 400 });
        }

        // Fetch the booking
        const booking = await prisma.hotelBooking.findUnique({
            where: {
                referenceId: referenceId,
                bookingCanceled: false,
            },
        });

        if (!booking) {
            return NextResponse.json({ message: "Booking not found or already canceled" }, { status: 404 });
        }

        // Update the booking to mark it as canceled
        await prisma.hotelBooking.update({
            where: { referenceId: referenceId },
            data: {
                bookingCanceled: true,
                canceledDate: new Date(),
            },
        });

        return NextResponse.json({ message: "Booking successfully canceled" }, { status: 200 });
    } catch (error) {
        console.error("Error canceling booking:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT() {
    return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
}

export async function DELETE() {
    return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
}