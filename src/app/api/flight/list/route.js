// api/flight/list
import { NextResponse } from "next/server";
import { isValidDate } from "@/utils/inputValid";

const AFS_API_URL = process.env.AFS_API_URL;
const API_KEY = process.env.AFS_KEY;

export async function GET(request){
    // date format: YYYY-MM-DD
    const { searchParams } = new URL(request.url);
    const origin = searchParams.get('origin');
    const destination = searchParams.get('destination');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    //need input validation
    if (!origin || !destination || !startDate || !endDate){
        return NextResponse.json({error: 'origin, destination, startDate, and endDate are required parameters'}, {status: 400});
    }

    if (!isValidDate(startDate) || !isValidDate(endDate)){
        return NextResponse.json({error: 'startDate and endDate must be in the format YYYY-MM-DD'}, {status: 400});
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    let flights = [];

    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)){
        const formattedDate = date.toISOString().split('T')[0];
        const response = await fetch(`${AFS_API_URL}/api/flights?origin=${origin}&destination=${destination}&date=${formattedDate}`, {
            method: 'GET',
            headers: {
                'x-api-key': API_KEY
            }});

        if(response.ok){
            const dailyFlights = await response.json();
            flights = dailyFlights.results;

        } else{
            console.error(`Failed to fetch flights for date: ${formattedDate}`);
        }
    }

    return NextResponse.json(flights);
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
  