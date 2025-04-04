import { prisma } from "@/utils/db";
import { NextResponse } from "next/server";
import { verifyToken } from "@/utils/auth";

export async function POST(request){
    try{
        // Verify user token
        const user = verifyToken(request);
        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const {
            userId,
            passportNum,
            billingFirstName,
            billingLastName,
            billingStreet,
            billingCity,
            billingProvince,
            billingCountry,
            billingPhoneNum,
            billingEmail,
            itineraryRef,
            hotelCost,
            departureFlightCost,
            returnFlightCost
        } = body;

        const invoice = await prisma.invoice.create({
            data: {
            userId,
            passportNum,
            billingFirstName,
            billingLastName,
            billingStreet,
            billingCity,
            billingProvince,
            billingCountry,
            billingPhoneNum,
            billingEmail,
            itineraryRef,
            hotelCost,
            departureFlightCost,
            returnFlightCost
            }
        });

        return NextResponse.json(invoice, { status: 201 });
    }
    catch (error) {
        console.error('Error processing checkout submission:', error);
        return new Response(
            JSON.stringify({ error: 'Internal Server Error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
