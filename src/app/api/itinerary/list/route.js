import { prisma } from "@/utils/db";
import { NextResponse } from "next/server";
import { verifyToken } from "@/utils/auth";

// get a list of all itineraries for the user
export async function GET(request){
    // verify user token
    const user = verifyToken(request);
    if (!user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    try {
        const itineraries = await prisma.Itinerary.findMany({
            where: {
                userId: user.userId
            }
        });

        if (itineraries.length === 0) {
            return NextResponse.json({ message: "No itineraries found" }, { status: 404 });
        }

        return NextResponse.json(itineraries);
    } catch(error){
        return NextResponse.json({ message: "Error retrieving itineraries" }, { status: 500 });
        
    }
}