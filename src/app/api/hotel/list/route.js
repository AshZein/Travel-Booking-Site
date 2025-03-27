// api/hotel/list
import { prisma } from "@/utils/db";
import { NextResponse } from "next/server";
import { numberRoomAvailable } from "@/utils/hotel";
import { isValidDate } from "@/utils/inputValid";


export async function GET(request){
    // assumptions:
    // - minStarRating and maxStarRating are input as max range in the front end (i.e. 1 and 5 respectively)
    // - startPrice and endPrice are input as max range in the front end (e.g. 0 and 1000 respectively)
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city')?.toLowerCase();
    const checkin = searchParams.get('checkin');
    const checkout = searchParams.get("checkout");
    const minStarRating = Number(searchParams.get('minStarRating'));
    const maxStarRating = Number(searchParams.get('maxStarRating'));
    const name = searchParams.get('name');
    const startPrice = Number(searchParams.get('startPrice'));
    const endPrice = Number(searchParams.get('endPrice'));

    // required input parameters
    if (!city || !checkin || !checkout){
        return NextResponse.json({error: 'city, checkin, and checkout are required parameters'}, {status: 400});
    }
    // input type checking
    if (typeof city !== 'string' || typeof checkin !== 'string' || typeof checkout !== 'string'){
        return NextResponse.json({error: 'city, checkin, and checkout must be strings'}, {status: 400});
    }
    if (typeof minStarRating !== 'number' || typeof maxStarRating !== 'number' || typeof startPrice !== 'number' || typeof endPrice !== 'number'){
        return NextResponse.json({error: 'minStarRating, maxStarRating, startPrice, and endPrice must be numbers'}, {status: 400});
    }
    if (typeof name !== 'string'){
        return NextResponse.json({error: 'name must be a string'}, {status: 400});
    }
    
    // input validation
    if (!isValidDate(checkin) || !isValidDate(checkout)){
        return NextResponse.json({error: 'checkin and checkout must be in the format YYYY-MM-DD'}, {status: 400});
    }
    if (minStarRating < 1 || minStarRating > 5 || maxStarRating < 1 || maxStarRating > 5){
        return NextResponse.json({error: 'minStarRating and maxStarRating must be between 1 and 5'}, {status: 400});
    }
    if (minStarRating > maxStarRating){
        return NextResponse.json({error: 'minStarRating must be less than or equal to maxStarRating'}, {status: 400});
    }
    if (startPrice < 0 || endPrice < 0){
        return NextResponse.json({error: 'startPrice and endPrice must be greater than or equal to 0'}, {status: 400});
    }
    if (startPrice > endPrice){
        return NextResponse.json({error: 'startPrice must be less than or equal to endPrice'}, {status: 400});
    }
    
    try { 
        const matchHotels = await prisma.Hotel.findMany({
            where: {
                city,
                AND: [
                    {
                        starRating: {
                            gte: minStarRating
                        }
                    },
                    {
                        starRating: {
                            lte: maxStarRating
                        }
                    },
                    {
                        name: {
                            equals: name
                        }
                    },
                ]
            },
            select: {
                hotelId: true,
                name: true,
                address: true,
                starRating: true,
                latitude: true,
                longitude: true
            }
        });

       
        // iterate over each hotel and check if it has rooms available
        const availableHotels = {};
        for (const hotel of matchHotels){
            const hotelId = hotel.hotelId; 
            const numRoomsAvailable = await numberRoomAvailable(hotelId, new Date(checkin), new Date(checkout), false);
            if (numRoomsAvailable.rooms && Object.keys(numRoomsAvailable.rooms).length > 0){ // the hotel has rooms available
                // find starting price of hotel
                const roomTypes = await prisma.HotelRoomType.findMany({
                    where: {
                        hotelId,
                        AND : [
                            {
                                price: {
                                    gte: startPrice
                                }
                            },
                            {
                                price: {
                                    lte: endPrice
                                }
                            }
                        ]
                    },
                    select: {
                        price: true
                    }
                });
                let minPrice = Number.MAX_VALUE;
                for (const roomType of roomTypes){
                    if (roomType.price < minPrice){
                        minPrice = roomType.price;
                    }
                }

                // add hotel to availableHotels
                availableHotels[hotelId] = {
                    name: hotel.name,
                    address: hotel.address,
                    longitude: hotel.longitude,
                    latitude: hotel.latitude,
                    starRating: hotel.starRating,
                    startingPrice: minPrice,
                };
            } 
        }

        // return should include hotel name, address, star rating, starting price, coordinates 
        return NextResponse.json(availableHotels);
    } catch (error){
        console.log(error.stack);
        return NextResponse.json({error: 'internal server error'}, {status: 500});
    }


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