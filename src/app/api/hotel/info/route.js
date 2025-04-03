import { prisma } from "@/utils/db";
import { NextResponse } from "next/server";

// get detailed hotel information
export async function GET(request) {
    const searchParams = new URL(request.url).searchParams;
    const hotelId = searchParams.get("hotelId");

    if (!hotelId) {
        return NextResponse.json({ message: "hotelId is required" }, { status: 400 });
    }

    if (isNaN(Number(hotelId))) {
        return NextResponse.json({ error: "hotelId must be a valid number" }, { status: 400 });
    }

    const hotelData = await prisma.Hotel.findFirst({
        where: {
            hotelId: Number(hotelId),
        },
    });

    if (!hotelData) {
        return NextResponse.json({ error: "Hotel not found" }, { status: 404 });
    }

    const amenities = await prisma.amenity.findMany({
        where: {
            hotelId: hotelData.hotelId,
        },
        select: {
            amenity: true,
        },
    });

    const hotel = {
        hotelId: hotelData.hotelId,
        name: hotelData.name,
        address: hotelData.address,
        city: hotelData.city,
        country: hotelData.country,
        latitude: hotelData.latitude,
        longitude: hotelData.longitude,
        starRating: hotelData.starRating,
        amenities: amenities,
    };

    return NextResponse.json(hotel);
}