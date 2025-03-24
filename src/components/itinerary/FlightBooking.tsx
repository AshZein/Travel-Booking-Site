import React from 'react';
import { Flight } from '@/types/flight';
import { useItinerary } from '@/context/ItineraryContext';
import { dateSplitter, totalFlightCost } from '@/utils/flight';

const dateCache: { [key: string]: { [key: string]: string } } = {};

interface FlightBookingProps {
    flights: Flight[];
    legs: number;
    outBoundFlight: boolean;
    onClick: () => void;
}

const FlightBooking: React.FC<FlightBookingProps> = ({ legs, flights, outBoundFlight, onClick }) => {
    // const { state, dispatch } = useItinerary();

    const renderFlight = (outBoundFlight: Flight, inBoundFlight: Flight) => {
        console.log("OUTBOUND FLIGHT:", outBoundFlight);
        console.log("INBOUND FLIGHT:", inBoundFlight);
        const departurePieces = dateSplitter(outBoundFlight.departureTime, dateCache);
        const arrivalPieces = dateSplitter(inBoundFlight.arrivalTime, dateCache);

        return (
            <div key={outBoundFlight.id} className="flight-details flex items-center gap-20" onClick={onClick}>
                <div className="flex flex-col items-center gap-1">
                    <p>{departurePieces.hour}:{departurePieces.minute}</p>
                    <p>{outBoundFlight.origin.code} - {departurePieces.day} {departurePieces.month}</p>
                </div>
                <div>
                    {legs - 1 > 1 ? (
                        <>{legs - 1} Stops</>
                    ) : legs - 1 === 1 ? (
                        <>1 Stop  </>
                    ) : (
                        <>DIRECT</>
                    )}
                </div>
                <div className="flex flex-col items-center gap-1">
                    <p>{arrivalPieces.hour}:{arrivalPieces.minute}</p>
                    <p>{inBoundFlight.destination.code} - {arrivalPieces.day} {arrivalPieces.month}</p>
                </div>

                <div className="vertical-line border-l-2 border-black h-full pl-4">
                    <p><strong>{totalFlightCost(flights)}</strong></p>
                    <p>currency: {outBoundFlight.currency}</p>
                </div>
            </div>
        );
    };

    return (
        <div className="flight-card">
            {outBoundFlight ? <h3>Outbound Flight</h3> : <h3>Return Flight</h3>}
            {flights.length > 0 && flights[0] && flights[flights.length - 1] ? (
                renderFlight(flights[0], flights[flights.length - 1])
            ) : (
                <p>No flights available</p>
            )}
        </div>
    );
};

export default FlightBooking;