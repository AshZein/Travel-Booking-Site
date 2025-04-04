import { prisma } from "@/utils/db";
import { NextResponse } from "next/server";

export async function GET(request){
    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city")?.toLowerCase();
    const country = searchParams.get("country")?.toLowerCase();

    if (!city || !country){
        return NextResponse.error("city and country are required parameters", { status: 400 });
    }

    const hotelSuggestions = await prisma.hotel.findMany({ 
        where: { 
            city, 
            country 
        },
        select :{
            name: true,
            city: true,
            address: true,
        }
    });

    if (hotelSuggestions.length > 5){
        return NextResponse.json(hotelSuggestions.slice(0, 5));
    }

    return NextResponse.json(hotelSuggestions);
}