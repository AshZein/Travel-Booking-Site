import { prisma } from "@/utils/db";
import { NextResponse } from "next/server";
import { verifyToken } from "@/utils/auth";
import { generateItineraryRef } from "@/utils/itinerary";

export async function POST(request) {
    try {
        // verify user token
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

        // Example: Log the received data (you can replace this with database logic)
        console.log('Flight Credentials:', flightCredentials);
        console.log('Billing Address:', billingAddress);
        console.log('Credit Card Info:', creditCardInfo);
        console.log('Selected Outbound Flights:', selectedOutboundFlights);
        console.log('Selected Return Flights:', selectedReturnFlights);

        // Example: Save the data to a database (replace this with your database logic)
        // await saveToDatabase({
        //     flightCredentials,
        //     billingAddress,
        //     creditCardInfo,
        //     selectedOutboundFlights,
        //     selectedReturnFlights,
        // });

        // Create a new itinerary
        const itineraryRef = await generateItineraryRef();
        const itinerary = prisma.itinerary.create({
            where: {
                userId: user.userId,
                itineraryRef: itineraryRef
            },
        });

        // book outbound flight if selected
        if (selectedOutboundFlights.length > 0) {
            const outboundFlight = fetch("/api/flight/booking",
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        firstName: flightCredentials.firstName,
                        lastName: flightCredentials.lastName,
                        email: flightCredentials.email,
                        passportNumber: flightCredentials.passportNumber,
                        flightIds: selectedOutboundFlights,
                    }),
                }
            );
            prisma.itinerary.update({
                where: {
                    userId: user.userId,
                    itineraryRef: itineraryRef
                },
                data: {
                    outboundFlightBookingRef: outboundFlight.bookingReference,
                }
            });
        }

        // book return flight if selected
        if (selectedReturnFlights.length > 0) {
            const returnFlight = fetch("/api/flight/booking",
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        firstName: flightCredentials.firstName,
                        lastName: flightCredentials.lastName,
                        email: flightCredentials.email,
                        passportNumber: flightCredentials.passportNumber,
                        flightIds: selectedOutboundFlights,
                    }),
                }
            );

            prisma.itinerary.update({
                where: {
                    userId: user.userId,
                    itineraryRef: itineraryRef
                },
                data: {
                    outboundFlightBookingRef: returnFlight.bookingReference,
                }
            });
        }


        // book hotel if selected



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