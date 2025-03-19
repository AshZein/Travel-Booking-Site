import React from 'react';

interface Flight {
    id: string;
    flightNumber: string;
    departureTime: string;
    arrivalTime: string;
    origin: {
        code: string;
        name: string;
        city: string;
        country: string;
    };
    destination: {
        code: string;
        name: string;
        city: string;
        country: string;
    };
    duration: number;
    price: number;
    currency: string;
    availableSeats: number;
    status: string;
    airline: {
        code: string;
        name: string;
    };
}

interface FlightBookingProps {
    flights: Flight[];
    outBoundFlight: boolean;
}
const FlightBooking: React.FC = (flights) => {
    return (
        <div>
            <p>TEST ONE</p>
        </div>
    );
}

export default FlightBooking;