import React from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { useItinerary } from '@/context/ItineraryContext';
import { dateSplitter, totalFlightCost } from '@/utils/flight';
import { Flight } from '@/types/flight';

interface FlightCardProps {
    legs: number;
    flights: Flight[];
    onClick: () => void;
    onAddToItinerary: () => void;
    type: string;
}

const CheckoutFlightCard: React.FC<FlightCardProps> = ({ legs, flights, onClick, onAddToItinerary, type }) => {
    return(
        <div>
            <h1>Checkout Flight Card</h1>
        </div>
    );
}

export default CheckoutFlightCard;