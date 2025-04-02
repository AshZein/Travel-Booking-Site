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

export async function POST(request) {
    // Verify user token (uncomment if needed)
    // const user = verifyToken(request);
    // if (!user) {
    //     return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    const { cardName, cardNumber, cvcNumber, expiryMonth, expiryYear } = await request.json();

    // Validate required fields
    if (!cardName || !cardNumber || !cvcNumber || !expiryMonth || !expiryYear) {
        return NextResponse.json(
            { message: "cardName, cardNumber, cvcNumber, expiryMonth, and expiryYear are required parameters" },
            { status: 400 }
        );
    }

    // Validate field types
    if (
        typeof cardName !== 'string' ||
        typeof cardNumber !== 'string' ||
        typeof cvcNumber !== 'string' ||
        typeof expiryMonth !== 'string' ||
        typeof expiryYear !== 'string'
    ) {
        return NextResponse.json(
            { message: "cardName, cardNumber, cvcNumber, expiryMonth, and expiryYear must be strings" },
            { status: 400 }
        );
    }

    // Check if credit card expiry is greater than now
    const currentDate = new Date();
    const expiryDate = new Date(Number(expiryYear), Number(expiryMonth) - 1); // Month is 0-indexed in JavaScript

    if (expiryDate <= currentDate) {
        return NextResponse.json({ message: "Credit card has expired" }, { status: 400 });
    }

    // Check if credit card number is valid
    if (!isValidCreditCardNumber(cardNumber)) {
        return NextResponse.json({ message: "Invalid credit card number" }, { status: 400 });
    }

    // If all validations pass
    return NextResponse.json({ message: "Credit card is valid" }, { status: 200 });
}