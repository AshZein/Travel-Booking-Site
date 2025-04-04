import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface GetRequest extends Request {
    url: string;
}

interface City {
    city: string;
    country: string;
}

export async function GET(request: GetRequest): Promise<Response> {
    const { searchParams } = new URL(request.url);
    const city: string | null = searchParams.get('city');

    if (!city) {
        return new Response(JSON.stringify({ error: 'City parameter is required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }
    try {
        const cities: City[] = await prisma.city.findMany({
            where: { city: { contains: city } },
            select: {
                city: true,
                country: true,
            },
        });
        return new Response(JSON.stringify(cities), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to fetch cities' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}