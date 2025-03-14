import { prisma } from "@/utils/db";
import { NextResponse } from "next/server"
import { verifyToken } from "@/utils/auth";


export async function POST(request){
    const user = verifyToken(request);
    if (!user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { name, address, city, country, latitude, longitude, starRating } = await request.json();
        if (!name || !address || !city || !country || !latitude || !longitude || !starRating){
            return NextResponse.json({error: 'name, address, city, country, latitude, longitude, and starRating are required parameters'}, {status: 400});
        }
        // input type checking
        if (typeof name !== 'string' || typeof address !== 'string' || typeof city !== 'string' || typeof country !== 'string'){
            return NextResponse.json({error: 'name, address, and city must be strings'}, {status: 400});
        }
        if (typeof latitude !== 'number' || typeof longitude !== 'number' || !(Number.isInteger(starRating))){
            return NextResponse.json({error: 'Latitude and longitute must be a number. StarRating must be an integer.'}, {status: 400});
        }

        const oldhotel = await prisma.Hotel.findFirst({
            where: {
                name: name,
                address: address
            }
        });
        if (oldhotel) {
            return NextResponse.json({error: 'Hotel already exists'}, {status: 400});
          }
        const hotel = await prisma.Hotel.create(
            {
                data: {
                    name,
                    address,
                    city: city.toLowerCase(),
                    country: country.toLowerCase(),
                    latitude,
                    longitude,
                    starRating,
                    
                }
            }
        );
        await prisma.HotelManager.create(
            {
                data:{
                    userId : user.userId,

                    hotelId : hotel.hotelId
                }
            }
        )

        return NextResponse.json(hotel); 
}

// get detailed hotel information
export async function GET(request){
    const searchParams = new URL(request.url);
    const name = searchParams.get("name");
    const address = searchParams.get("address");

    if (!name || !address){
        return NextResponse.json({message: 'name and address is required'}, {status: 400});
    }

    if (typeof name !== 'string' || typeof address !== 'string'){
        return NextResponse.json({error: 'name and address must be strings'}, {status: 400});
    }

    const hotelData = await prisma.Hotel.findFirst({
        where: {
            name: name,
            address: address
        }
    });
    if (!hotel) {
        return NextResponse.json({error: 'Hotel not found'}, {status: 404});
    }

    const amenities = await prisma.HotelAmenity.findMany({
        where: {
            hotelId: hotelData.hotelId
        },
        select:{
            amenity: true,
        }
    });

    const roomtypes = await prisma.RoomType.findMany({
        where: {
            hotelId: hotelData.hotelId
        },
         select:{
            price:true,
            numberAvailable:true,
            roomType:true,
         }
    });

    const hotel = {
        name: hotelData.name,
        address: hotelData.address,
        city: hotelData.city,
        country: hotelData.country,
        latitude: hotelData.latitude,
        longitude: hotelData.longitude,
        starRating: hotelData.starRating,
        amenities: amenities,
        roomtypes: roomtypes
    };

    return NextResponse.json(hotel);
}

export async function PATCH() {
    return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
}

export async function PUT() {
    return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
}

export async function DELETE() {
    return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
}