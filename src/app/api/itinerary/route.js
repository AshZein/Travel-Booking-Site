import { prisma } from "@/utils/db";
import { NextResponse } from "next/server";
import { verifyToken } from "@/utils/auth";
import { sendNotification } from "@/utils/notification";
import { generateItineraryRef } from "@/utils/itinerary";

export async function POST(request){
    // verify user token
    const user = verifyToken(request);
    if (!user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // retrieve parameters
    const { email } = await request.json();
    try {
        // retrieve userRecord
        const userRecord = await prisma.User.findUnique({
            where: {
                email: email
            }
        });

        if (!userRecord) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // create itinerary
        const itineraryRef = await generateItineraryRef();
        const itinerary = await prisma.Itinerary.create({
            data: {
                userId: userRecord.userId,
                itineraryRef: itineraryRef
            },
            select: {
                itineraryRef: true,
                forwardFlightBookingRef: true,
                returnFlightBookingRef: true,
                hotelBookingRef: true
            }
        });

        // send notification
        sendNotification({
            userId: user.userId,
            message: `Itinerary created`
        });

        return NextResponse.json(itinerary);
    } catch(error){
        console.log(error.stack);
        return NextResponse.json({ message: "Error creating itinerary" }, { status: 500 });
    }
}

export async function GET(request){
    // verify user token
    const user = verifyToken(request);
    if (!user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // retrieve parameters
    const { searchParams } = new URL(request.url);
    const itineraryRef = searchParams.get('itineraryRef');

    // retrieve itinerary
    const itinerary = await prisma.Itinerary.findUnique({
        where: {
            itineraryRef
        },
         select: {
            itineraryRef: true,
            forwardFlightBookingRef: true,
            returnFlightBookingRef: true,
            hotelBookingRef: true
         }
    });

    if (!itinerary){
        return NextResponse.json({ message: "Itinerary not found" }, { status: 404 });
    }

    if (itinerary.userId !== user.userId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(itinerary);
}

export async function PATCH(request){
    // verify user token
    const user = verifyToken(request);
    if (!user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // itineraryRef: unique reference number for itinerary
    // data {"forwardFlightBookingRef": string, "returnFlightBookingRef": string, "hotelBookingRef":string} 
    // retrieve parameters
    const { itineraryRef, newData } = await request.json();

    try {
        // retrieve itinerary
        const itinerary = await prisma.Itinerary.findUnique({
            where: {
                itineraryRef
            }
        });


    if (!itinerary){
        return NextResponse.json({ message: "Itinerary not found" }, { status: 404 });
    }

    if (itinerary.userId !== user.userId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // filter out null values
    let data = {};
    if (data.forwardFlightBookingRef !== undefined) data.forwardFlightBookingRef = newData.forwardFlightBookingRef;
    if (data.returnFlightBookingRef !== undefined) data.returnFlightBookingRef = newData.returnFlightBookingRef;
    if (data.hotelBookingRef !== undefined) data.hotelBookingRef = newData.hotelBookingRef;

    
        // update itinerary
        const updatedItinerary = await prisma.Itinerary.update({
            where: {
                itineraryRef
            },
            data,
        });

        return NextResponse.json(updatedItinerary);
    } catch(error){
        console.log(error.stack);
        return NextResponse.json({ message: "Error updating itinerary" }, { status: 500 });
    }

}

// delete itinerary for when user doesn't complete a checkout
export async function DELETE(request){
    // verify user token
    const user = verifyToken(request);
    if (!user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // retrieve parameters
    const { itineraryRef } = await request.json();

    try {
        // retrieve itinerary
        const itinerary = await prisma.Itinerary.findUnique({
            where: {
                itineraryRef
            }
        });

        if (!itinerary){
            return NextResponse.json({ message: "Itinerary not found" }, { status: 404 });
        }

        if (itinerary.userId !== user.userId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        // delete hotel booking
        if(itinerary.hotelBookingRef){
            await prisma.HotelBooking.delete({
                where: {
                    hotelBookingRef: itinerary.hotelBookingRef
                }
            });
        }

        // delete forward flight booking
        if(itinerary.forwardFlightBookingRef){
            await prisma.FlightBooking.delete({
                where: {
                    bookingReference: itinerary.forwardFlightBookingRef
                }
            });
        }
        // delete return flight booking
        if(itinerary.returnFlightBookingRef){
            await prisma.FlightBooking.delete({
                where: {
                    bookingReference: itinerary.returnFlightBookingRef
                }
            });
        }

        // delete itinerary
        await prisma.Itinerary.delete({
            where: {
                itineraryRef
            }
        });

        return NextResponse.json({ message: "Itinerary deleted" });
    } catch(error){
        console.log(error.stack);
        return NextResponse.json({ message: "Error deleting itinerary" }, { status: 500 });
    }
} 