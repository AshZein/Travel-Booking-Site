import { prisma } from "@/utils/db";
import { NextResponse } from "next/server";
import { verifyToken } from "@/utils/auth";

//  Add or Update Hotel Amenities (Hotel Manager Only)
export async function POST(request) {
  try {
    const decoded = verifyToken(request);
    if (!decoded) {
      return NextResponse.json({ message: "Unauthorized. Invalid token." }, { status: 401 });
    }

    const { name, address, amenities } = await request.json();

    // Validate input
    if (!name || !address || !Array.isArray(amenities)) {
      return NextResponse.json({ message: "Invalid input data" }, { status: 400 });
    }

    // Find the hotel using name and address
    const hotel = await prisma.Hotel.findUnique({
      where: {
         name_address:{
          name: name,
          address: address
        }
      },
    });

    if (!hotel) {
      return NextResponse.json({ message: "Hotel not found" }, { status: 404 });
    }

    // Check if the user is a hotel manager
    const manager = await prisma.HotelManager.findUnique({
      where: {
        userId_hotelId: {
          userId: decoded.userId,
          hotelId: hotel.hotelId
        }
      },
    });

    if (!manager) {
      return NextResponse.json({ message: "Unauthorized. You are not a hotel manager." }, { status: 403 });
    }

    // Remove old amenities before adding new ones
    await prisma.Amenity.deleteMany({
      where: { hotelId: hotel.hotelId },
    });

    // Insert new amenities
    const newAmenities = amenities.map((amenity) => ({
      hotelId: hotel.hotelId,
      amenity,
    }));

    await prisma.Amenity.createMany({ data: newAmenities });

    return NextResponse.json({ message: "Hotel amenities updated successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}

//  Retrieve Hotel Amenities
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name");
    const address = searchParams.get("address");

    if (!name || !address) {
      return NextResponse.json({ message: "Hotel name and address are required" }, { status: 400 });
    }

    // Find hotel
    const hotel = await prisma.Hotel.findUnique({
      where: {
        name_address:{
         name: name,
         address: address
       }
     },
    });

    if (!hotel) {
      return NextResponse.json({ message: "Hotel not found" }, { status: 404 });
    }

    // Get amenities
    const amenities = await prisma.Amenity.findMany({
      where: { hotelId: hotel.hotelId },
      select: { amenity: true },
    });

    return NextResponse.json({ hotelId: hotel.hotelId, amenities: amenities.map(a => a.amenity) }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}

//  Delete All Amenities for a Hotel (Hotel Manager Only)
export async function DELETE(request) {
    try {
      const decoded = verifyToken(request);
      if (!decoded) {
        return NextResponse.json({ message: "Unauthorized. Invalid token." }, { status: 401 });
      }
  
      const { name, address, amenity } = await request.json(); // `amenity` is optional
  
      if (!name || !address) {
        return NextResponse.json({ message: "Hotel name and address are required" }, { status: 400 });
      }
  
      // Find the hotel
      const hotel = await prisma.Hotel.findUnique({
        where: {
          name_address:{
           name: name,
           address: address
         }
       },
      });
  
      if (!hotel) {
        return NextResponse.json({ message: "Hotel not found" }, { status: 404 });
      }
  
      // Check if the user is a hotel manager
      const manager = await prisma.HotelManager.findUnique({
        where: {
          userId_hotelId: {
            userId: decoded.userId,
            hotelId: hotel.hotelId
          }
        },
      });
  
      if (!manager) {
        return NextResponse.json({ message: "Unauthorized. You are not a hotel manager." }, { status: 403 });
      }
  
      if (amenity) {
        // Delete only the specified amenity
        const deletedAmenity = await prisma.Amenity.deleteMany({
          where: { hotelId: hotel.hotelId, amenity },
        });
  
        if (deletedAmenity.count === 0) {
          return NextResponse.json({ message: `Amenity '${amenity}' not found in this hotel` }, { status: 404 });
        }
  
        return NextResponse.json({ message: `Amenity '${amenity}' removed successfully` }, { status: 200 });
      } else {
        // Delete all amenities if no specific one is provided
        await prisma.Amenity.deleteMany({
          where: { hotelId: hotel.hotelId },
        });
  
        return NextResponse.json({ message: "All amenities removed successfully" }, { status: 200 });
      }
    } catch (error) {
      return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
    }
}

//  Block unsupported methods
export async function PATCH() {
  return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
}
