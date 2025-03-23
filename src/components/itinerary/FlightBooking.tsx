import React from 'react';
import { Flight } from '@/types/flight';
import { useItinerary } from '@/context/ItineraryContext';

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