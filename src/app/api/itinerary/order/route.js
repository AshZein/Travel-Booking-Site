import { prisma } from "@/utils/db";
import { NextResponse } from "next/server";
import { verifyToken } from "@/utils/auth";

// Luhn algorithm to validate credit card number
function isValidCreditCardNumber(number) {
    const reversedDigits = number.split('').reverse().map(digit => parseInt(digit, 10));
    const sum = reversedDigits.reduce((acc, digit, idx) => {
        if (idx % 2 === 1) {
            const doubled = digit * 2;
            return acc + (doubled > 9 ? doubled - 9 : doubled);
        }
        return acc + digit;
    }, 0);
    return sum % 10 === 0;
}

export async function POST(request){
    // verify user token
    const user = verifyToken(request);
    if (!user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // retrieve parameters
    const { email, itineraryRef, creditCardNumber, creditCardExpiry, creditCardCVC } = await request.json();

    if (!email || !itineraryRef || !creditCardNumber || !creditCardExpiry || !creditCardCVC){
        return NextResponse.json({ message: "email, itineraryRef, creditCardNumber, creditCardExpiry, and creditCardCVC are required parameters" }, { status: 400 });
    }

    if (typeof email !== 'string' || typeof itineraryRef !== 'string' || typeof creditCardNumber !== 'string' || typeof creditCardExpiry !== 'string' || typeof creditCardCVC !== 'string'){
        return NextResponse.json({ message: "email, itineraryRef, creditCardNumber, creditCardExpiry, and creditCardCVC must be strings" }, { status: 400 });
    }

    // check if credit card expiry is greater than now
    const currentDate = new Date();
    const [month, year] = creditCardExpiry.split('/').map(Number);
    const expiryDate = new Date(year, month);

    if (expiryDate <= currentDate) {
        return NextResponse.json({ message: "Credit card has expired" }, { status: 400 });
    }

    // check if credit card number is valid
    if (!isValidCreditCardNumber(creditCardNumber)){
        return NextResponse.json({ message: "Invalid credit card number" }, { status: 400 });
    }

    // retrieve itinerary
    const itinerary = await prisma.Itinerary.findUnique({ 
        where: {
            itineraryRef
        }
    });

    if (!itinerary){
        return NextResponse.json({ message: "Itinerary not found" }, { status: 404 });
    }

    // check if hotel booking exists and is not cancelled
    const hotelBooking = await prisma.hotelBooking.findUnique({
        where: {
            hotelBookingRef: itinerary.hotelBookingRef
        }
    });

    if (!hotelBooking || hotelBooking.bookingCanceled){
        return NextResponse.json({ message: "Hotel booking not found or has been cancelled" }, { status: 404 });
    }

    // check if forward flight booking exists and is not cancelled
    const forwardFlightBooking = await prisma.FlightBooking.findUnique({
        where: {
            flightBookingRef: itinerary.forwardFlightBookingRef
        }
    });

    if (!forwardFlightBooking || forwardFlightBooking.bookingCanceled){
        return NextResponse.json({ message: "Forward flight booking not found or has been cancelled" }, { status: 404 });
    }   

    // check if return flight booking exists and is not cancelled
    const returnFlightBooking = await prisma.FlightBooking.findUnique({
        where: {
            flightBookingRef: itinerary.returnFlightBookingRef
        }
    });

    if(!returnFlightBooking || returnFlightBooking.bookingCanceled){
        return NextResponse.json({ message: "Return flight booking not found or has been cancelled" }, { status: 404 });
    }
}
