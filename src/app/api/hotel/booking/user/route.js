import { prisma } from "@/utils/db";
import { NextResponse } from "next/server";
import { verifyToken } from "@/utils/auth";

export async function GET(request) {
    try {
        // Verify user token
        const user = verifyToken(request);
        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        // Retrieve the booking reference from query parameters
        const bookingReference = request.nextUrl.searchParams.get("bookingReference");
        if (!bookingReference) {
            return NextResponse.json({ message: "Booking reference is required" }, { status: 400 });
        }

        // Fetch the hotel booking
        const booking = await prisma.hotelBooking.findFirst({
            where: {
                userId: user.userId,
                referenceId: bookingReference,
            },
            select: {
                referenceId: true,
                hotelId: true,
                roomId: true,
                price: true,
                checkIn: true,
                checkOut: true,
                bookingMade: true,
                bookingCanceled: true,
                canceledDate: true,
                hotel: {
                    select: {
                        name: true,
                        address: true,
                        city: true,
                        country: true,
                    },
                },
                hotelRoomType: {
                    select: {
                        roomType: true,
                        price: true,
                    },
                },
            },
        });

        if (!booking) {
            return NextResponse.json({ message: "Booking not found" }, { status: 404 });
        }

        return NextResponse.json(booking, { status: 200 });
    } catch (error) {
        console.error("Error retrieving hotel booking:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}