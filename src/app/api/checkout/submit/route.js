import { prisma } from "@/utils/db";
import { NextResponse } from "next/server";
import { verifyToken } from "@/utils/auth";
import { generateItineraryRef } from "@/utils/itinerary";

export async function POST(request) {
    const baseUrl = process.env.BASE_URL;
    try {
        // Verify user token
        const user = verifyToken(request);
        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        // Parse the request body
        const {
            flightCredentials,
            billingAddress,
            creditCardInfo,
            selectedOutboundFlights,
            selectedReturnFlights,
            selectedHotel,
            selectedRoom,
            selectedHotelCheckIn,
            selectedHotelCheckOut,
            selectedHotelPrice
        } = await request.json();

        // Validate the received data
        if (
            !flightCredentials ||
            !billingAddress ||
            !creditCardInfo ||
            !selectedOutboundFlights ||
            selectedOutboundFlights.length === 0
        ) {
            return new Response(
                JSON.stringify({ error: 'Missing required fields' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Extract the Authorization header from the incoming request
        const authHeader = request.headers.get('Authorization');

        // Log the received data (for debugging purposes)
        console.log('Flight Credentials:', flightCredentials);
        console.log('Billing Address:', billingAddress);
        console.log('Credit Card Info:', creditCardInfo);
        console.log('Selected Outbound Flights:', selectedOutboundFlights);
        console.log('Selected Return Flights:', selectedReturnFlights);
        console.log('Selected Hotel:', selectedHotel);
        console.log('Selected Room:', selectedRoom);
        console.log('Selected Hotel Check-In:', typeof selectedHotelCheckIn);
        console.log('Selected Hotel Check-Out:', typeof selectedHotelCheckOut);
        console.log('Selected Hotel Price:', selectedHotelPrice);

        // Create a new itinerary
        const itineraryRef = await generateItineraryRef();
        const itinerary = await prisma.itinerary.create({
            data: {
                userId: user.userId,
                itineraryRef: itineraryRef,
            },
        });

        // Book outbound flight if selected
        if (selectedOutboundFlights.length > 0) {
            const outboundFlightIds = selectedOutboundFlights.map(flight => flight.id); // Extract flight IDs

            console.log('Outbound Flight Payload:', {
                firstName: flightCredentials.firstName,
                lastName: flightCredentials.lastName,
                email: billingAddress.email,
                passportNumber: flightCredentials.passportNumber,
                flightIds: outboundFlightIds, // Send only flight IDs
            });

            const outboundFlightResponse = await fetch(`${baseUrl}/api/flight/booking`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': authHeader, // Forward the Authorization header
                },
                body: JSON.stringify({
                    firstName: flightCredentials.firstName,
                    lastName: flightCredentials.lastName,
                    email: billingAddress.email,
                    passportNumber: flightCredentials.passportNumber,
                    flightIds: outboundFlightIds, // Send only flight IDs
                }),
            });

            if (!outboundFlightResponse.ok) {
                const errorData = await outboundFlightResponse.json();
                console.error('Error creating outbound flight booking:', errorData);
                return NextResponse.json(
                    { message: `Failed to book outbound flight: ${errorData.message}` },
                    { status: outboundFlightResponse.status }
                );
            }

            const outboundFlightData = await outboundFlightResponse.json();
            await prisma.itinerary.update({
                where: {
                    itineraryId: itinerary.itineraryId ,
                },
                data: {
                    forwardFlightBookingRef: outboundFlightData.bookingReference,
                },
            });
        }

        // Book return flight if selected
        if (selectedReturnFlights.length > 0) {
            const returnFlightIds = selectedReturnFlights.map(flight => flight.id); // Extract flight IDs

            console.log('Return Flight Payload:', {
                firstName: flightCredentials.firstName,
                lastName: flightCredentials.lastName,
                email: billingAddress.email,
                passportNumber: flightCredentials.passportNumber,
                flightIds: returnFlightIds, // Send only flight IDs
            });

            const returnFlightResponse = await fetch(`${baseUrl}/api/flight/booking`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': authHeader, // Forward the Authorization header
                },
                body: JSON.stringify({
                    firstName: flightCredentials.firstName,
                    lastName: flightCredentials.lastName,
                    email: billingAddress.email,
                    passportNumber: flightCredentials.passportNumber,
                    flightIds: returnFlightIds, // Send only flight IDs
                }),
            });

            if (!returnFlightResponse.ok) {
                const errorData = await returnFlightResponse.json();
                console.error('Error creating return flight booking:', errorData);
                return NextResponse.json(
                    { message: `Failed to book return flight: ${errorData.message}` },
                    { status: returnFlightResponse.status }
                );
            }

            const returnFlightData = await returnFlightResponse.json();
            await prisma.itinerary.update({
                where: {
                    itineraryId: itinerary.itineraryId ,
                },
                data: {
                    returnFlightBookingRef: returnFlightData.bookingReference,
                },
            });
        }

        // book hotel if selected
        if (selectedHotel){
            const hotelBookingResponse = await fetch(`${baseUrl}/api/hotel/booking`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': authHeader, // Forward the Authorization header
                },
                body: JSON.stringify({
                    email: billingAddress.email,
                    hotelId: selectedHotel.hotelId,
                    roomId: selectedRoom.roomId,
                    checkIn: selectedHotelCheckIn,
                    checkOut: selectedHotelCheckOut,
                    price: selectedHotelPrice,
                }),
            });

            if (!hotelBookingResponse.ok) {
                const errorData = await hotelBookingResponse.json();
                console.error('Error creating hotel booking:', errorData);
                return NextResponse.json(
                    { message: `Failed to book hotel: ${errorData.message}` },
                    { status: hotelBookingResponse.status }
                );
            }

            const hotelBookingData = await hotelBookingResponse.json();
            await prisma.itinerary.update({
                where: {
                    itineraryId: itinerary.itineraryId ,
                },
                data: {
                    hotelBookingRef: hotelBookingData.referenceId,
                },
            });
        }

        // Return a success response
        return new Response(
            JSON.stringify({ message: 'Checkout data submitted successfully' }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('Error processing checkout submission:', error);
        return new Response(
            JSON.stringify({ error: 'Internal Server Error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}