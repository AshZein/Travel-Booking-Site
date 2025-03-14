// api/airport
import { prisma } from "@/utils/db";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  try {
    const cities = await prisma.City.findMany({
      where: {
        city: {
          contains: query
        },
      },
      select: {
        city: true,
        country: true
      },
    });

    const airports = await prisma.Airport.findMany({
      where: {
        OR: [
          {
            city: {
              contains: query
            },
          },
          {
            name: {
              contains: query
            },
          },
          {
            code: {
              contains: query
            },
          },
        ],
      },
      select: {
        name: true,
        code: true,
        country: true
      },
    });

    const suggestions = {};
    suggestions.cities = cities;
    suggestions.airports = airports;

    return NextResponse.json({data: suggestions});
  } catch (error) {
    console.error('Error fetching suggestions:');
    return NextResponse.json({ error: 'Failed to fetch suggestions' }, { status: 500 });
  }
}

export async function PATCH() {
  return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
}
export async function POST(){
  return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
}