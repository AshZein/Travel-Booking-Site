// api/flight/booking
import { prisma } from "@/utils/db";
import { NextResponse } from "next/server";
import { verifyToken } from "@/utils/auth";
import { sendNotification } from "@/utils/notification";

const AFS_API_URL = process.env.AFS_API_URL;
const API_KEY = process.env.AFS_KEY;

export async function GET(request) {
    // verify user token
    const user = verifyToken(request);
    if (!user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // retrieve parameters
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const bookingReference = searchParams.get('bookingReference');

    // email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)){
        return res.status(400).json({ message: "Invalid email format" });
    }

    // retrieve userRecord lastname, needed for fetching booking from afs
    const userRecord = await prisma.User.findUnique({
        where: {
            email
        },
        select: {
            userId: true,
            lastName: true
        }
    });

    // no userRecord with that email
    if (!userRecord) {
        return NextResponse.json({ message: "No userRecord with that email." }, { status: 404 });
    }

    if (!bookingReference) { // retrieve all bookings associated with this userRecord
        let bookings = [];
        const flightBookings = await prisma.FlightBooking.findMany({
            where: {
                userId: userRecord.userRecordId
            },
            select: {
                bookingReference: true
            }
        });

        // retrieve all bookings
        for (const booking of flightBookings) {
            const response = await fetch(`${AFS_API_URL}/api/bookings/retrieve?lastName=${userRecord.lastName.toLowerCase()}&bookingReference=${booking.bookingReference}`, {
                method: 'GET',
                headers: {
                    'x-api-key': API_KEY
                }
            });

            // verify if afs fetch is ok
            if (!response.ok) {
                console.error(`Failed to retrieve booking for last name: ${userRecord.lastName} & booking reference: ${booking.bookingReference}`);
                return NextResponse.json({ message: "Failed to retrieve booking." }, { status: response.status });
            }

            const afsBooking = await response.json();
            bookings.push(afsBooking);
        }

        return NextResponse.json({ data: bookings }, { status: 200 });
        
    } else { // retrieve booking associated with this booking reference
        const response = await fetch(`${AFS_API_URL}/api/bookings/retrieve?lastName=${userRecord.lastName.toLowerCase()}&bookingReference=${bookingReference}`, {
            method: 'GET',
            headers: {
                'x-api-key': API_KEY
            }
        });

        // verify if afs fetch is ok
        if (!response.ok) {
            console.error(`Failed to retrieve booking for last name: ${userRecord.lastName} & booking reference: ${bookingReference}`);
            return NextResponse.json({ message: "Failed to retrieve booking." }, { status: response.status });
        }

        const afsBooking = await response.json();
        return NextResponse.json({ data: afsBooking }, { status: 200 });
    }

}

export async function POST(request){
    // verify user token
    const user = verifyToken(request);
    if (!user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // assumptions:
    // flightIds will always be valid list of flights
    // email always corresponds to an existing userRecord
    const { firstName, lastName, email, passportNumber, flightIds } = await request.json();

    // required input parameters
    if (!firstName || !lastName || !email || !passportNumber || !flightIds){
        return NextResponse.json({error: 'firstName, lastName, email, passportNumber, and flightIds are required parameters'}, {status: 400});
    }
    // input type checking
    if (typeof firstName !== 'string' || typeof lastName !== 'string' || typeof email !== 'string' || typeof passportNumber !== 'string'){
        return NextResponse.json({error: 'firstName, lastName, email, and passportNumber must be strings'}, {status: 400});
    }
    if (!Array.isArray(flightIds)){
        return NextResponse.json({error: 'flightIds must be an array'}, {status: 400});
    }
    if (flightIds.some(id => typeof id !== 'string')){
        return NextResponse.json({error: 'flightIds must be an array of strings'}, {status: 400});
    }

    // make booking through afs
    try {
        const response = await fetch(`${AFS_API_URL}/api/bookings`, {
            method: 'POST',
            headers: {
                //'Content-Type': 'application/json',
                'x-api-key': API_KEY
            },
            body: JSON.stringify({
                firstName,
                lastName,
                email,
                passportNumber,
                flightIds
            })
        });

        if (!response.ok){
            console.log(firstName, lastName, email, passportNumber, flightIds);
            console.log(response);
            throw new Error('Failed to book');
        }
        const bookingInfo = await response.json();

        // determine userRecord's id
        const userId = await prisma.User.findFirst({
            where: {
                email
            },
            select: {
                userId: true
            }
        });
        
        // save booking to database
        const booking = await prisma.FlightBooking.create({
            data: {
                userId: userId.userId,
                bookingReference: bookingInfo.bookingReference,
                bookingMade: bookingInfo.createdAt,
            },
            select: {
                bookingReference: true,
                bookingMade: true
            }
        });

        await sendNotification(userId.userId, `Good news, your flight booking with reference ${booking.bookingReference} has been made.`, 'USER');

        return NextResponse.json({ data: booking }, { status: 201 });

    } catch (error){
        console.log('Error creating booking:', error.stack);
        return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
    }
}

export async function PUT(request) {
    // verify user token
    const user = verifyToken(request);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
  
    const { bookingReference } = await request.json();
  
    // required input parameters
    if (!bookingReference) {
      return NextResponse.json({ error: 'bookingReference is a required parameter' }, { status: 400 });
    }
  
    try {
     const existingBooking = await prisma.FlightBooking.findUnique({
        where: {
            userId: user.userId,
            bookingReference: bookingReference
        }
     });

     if (!existingBooking) {
        return NextResponse.json({ error: 'Booking does not exist' }, { status: 404 });
    }

      // Update booking status to canceled
      const booking = await prisma.FlightBooking.update({
        where: { bookingReference },
        data: { bookingCanceled: true },
      });
  
      await sendNotification(user.userId, `Your flight booking with reference ${bookingReference} has been canceled.`, 'USER');
  
      return NextResponse.json({ data: booking }, { status: 200 });
    } catch (error) {
      console.log('Error canceling booking:', error.stack);
      return NextResponse.json({ error: 'Failed to cancel booking' }, { status: 500 });
    }
}

export async function PATCH() {
    return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
}

export async function DELETE() {
    return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
}