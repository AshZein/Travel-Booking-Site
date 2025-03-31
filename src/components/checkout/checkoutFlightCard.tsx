import React from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { useItinerary } from '@/context/ItineraryContext';
import { dateSplitter, totalFlightCost } from '@/utils/flight';
import { Flight } from '@/types/flight';

const dateCache: { [key: string]: { [key: string]: string } } = {};

interface FlightCardProps {
    legs: number;
    flights: Flight[];
    type: string;
}

const CheckoutFlightCard: React.FC<FlightCardProps> = ({ legs, flights, type }) => {
    const renderFlight = (outBoundFlight: Flight, inBoundFlight: Flight) => {
        const departurePieces = dateSplitter(outBoundFlight.departureTime, dateCache);
        const arrivalPieces = dateSplitter(inBoundFlight.arrivalTime, dateCache);

        return (
            <div key={outBoundFlight.id} className="flight-details flex flex-col gap-6 p-6 border rounded-lg shadow-md bg-white">
                <p className="text-black">{type}</p>
                {/* Flight Times and Locations */}
                <div className="flex justify-between items-center">
                    <div className="flex flex-col items-center">
                        <p className="text-black font-semibold">{departurePieces.hour}:{departurePieces.minute}</p>
                        <p className="text-sm text-gray-500">{outBoundFlight.origin.code} - {departurePieces.day} {departurePieces.month}</p>
                    </div>
                    <div className="text-center text-sm text-gray-600">
                        {legs - 1 > 1 ? (
                            <>{legs - 1} Stops</>
                        ) : legs - 1 === 1 ? (
                            <>1 Stop</>
                        ) : (
                            <>Direct</>
                        )}
                    </div>
                    <div className="flex flex-col items-center">
                        <p className="text-black font-semibold">{arrivalPieces.hour}:{arrivalPieces.minute}</p>
                        <p className="text-sm text-gray-500">{inBoundFlight.destination.code} - {arrivalPieces.day} {arrivalPieces.month}</p>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-300"></div>

                {/* Flight Cost */}
                <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600">Total Cost:</p>
                    <p className="text-lg font-bold text-blue-600">{outBoundFlight.currency} {totalFlightCost(flights)}</p>
                </div>
            </div>
        );
    };

    return (
        <div className="checkout-flight-card bg-gray-50 p-4 rounded-lg shadow-md">
            {renderFlight(flights[0], flights[flights.length - 1])}
        </div>
    );
};

export default CheckoutFlightCard;