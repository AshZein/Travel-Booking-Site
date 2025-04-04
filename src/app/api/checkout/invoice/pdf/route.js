import { prisma } from "@/utils/db";
import { NextResponse } from "next/server";
import { PDFDocument, rgb } from "pdf-lib";

export async function POST(request) {
    try {
        const { itineraryRef } = await request.json();

        if (!itineraryRef) {
            return NextResponse.json(
                { error: "itineraryRef is required" },
                { status: 400 }
            );
        }

        // Fetch the invoice data from the database
        const invoice = await prisma.invoice.findUnique({
            where: { itineraryRef },
            include: {
                user: true, // Include user details
            },
        });

        if (!invoice) {
            return NextResponse.json(
                { error: "Invoice not found" },
                { status: 404 }
            );
        }

        // Create a new PDF document
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([600, 800]); // Width: 600, Height: 800

        // Add content to the PDF
        const { width, height } = page.getSize();
        const fontSize = 12;

        page.drawText("Invoice", {
            x: 50,
            y: height - 50,
            size: 24,
            color: rgb(0, 0, 0),
        });

        page.drawText(`Invoice ID: ${invoice.invoiceId}`, {
            x: 50,
            y: height - 100,
            size: fontSize,
        });

        page.drawText(`User: ${invoice.billingFirstName} ${invoice.billingLastName}`, {
            x: 50,
            y: height - 120,
            size: fontSize,
        });

        page.drawText(`Passport Number: ${invoice.passportNum}`, {
            x: 50,
            y: height - 140,
            size: fontSize,
        });

        page.drawText(`Billing Address:`, {
            x: 50,
            y: height - 160,
            size: fontSize,
        });

        page.drawText(
            `${invoice.billingStreet}, ${invoice.billingCity}, ${invoice.billingProvince}, ${invoice.billingCountry}`,
            {
                x: 50,
                y: height - 180,
                size: fontSize,
            }
        );

        page.drawText(`Phone: ${invoice.billingPhoneNum}`, {
            x: 50,
            y: height - 200,
            size: fontSize,
        });

        page.drawText(`Email: ${invoice.billingEmail}`, {
            x: 50,
            y: height - 220,
            size: fontSize,
        });

        page.drawText(`Itinerary Reference: ${invoice.itineraryRef}`, {
            x: 50,
            y: height - 240,
            size: fontSize,
        });

        page.drawText(`Hotel Cost: $${invoice.hotelCost.toFixed(2)}`, {
            x: 50,
            y: height - 260,
            size: fontSize,
        });

        page.drawText(`Departure Flight Cost: $${invoice.departureFlightCost.toFixed(2)}`, {
            x: 50,
            y: height - 280,
            size: fontSize,
        });

        page.drawText(`Return Flight Cost: $${invoice.returnFlightCost.toFixed(2)}`, {
            x: 50,
            y: height - 300,
            size: fontSize,
        });

        const totalCost =
            invoice.hotelCost + invoice.departureFlightCost + invoice.returnFlightCost;

        page.drawText(`Total Cost: $${totalCost.toFixed(2)}`, {
            x: 50,
            y: height - 320,
            size: fontSize,
            color: rgb(0, 0, 1),
        });

        // Serialize the PDF to bytes
        const pdfBytes = await pdfDoc.save();

        // Return the PDF as a response
        return new Response(pdfBytes, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="invoice_${itineraryRef}.pdf"`,
            },
        });
    } catch (error) {
        console.error("Error generating PDF invoice:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}