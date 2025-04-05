import React from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { dateSplitter, totalFlightCost } from '@/utils/flight';
import { Flight } from '@/types/flight';

const dateCache: { [key: string]: { [key: string]: string } } = {};

interface FlightCardProps {
    legs: number;
    flights: Flight[];
    onClick: () => void;
    type: string;
}

const FlightCard: React.FC<FlightCardProps> = ({ legs, flights, onClick, type }) => {
    const renderFlight = (outBoundFlight: Flight, inBoundFlight: Flight) => {
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
                        <>1 Stop</>
                    ) : (
                        <>DIRECT</>
                    )}
                </div>
                <div className="flex flex-col items-center gap-1">
                    <p>{arrivalPieces.hour}:{arrivalPieces.minute}</p>
                    <p>{inBoundFlight.destination.code} - {arrivalPieces.day} {arrivalPieces.month}</p>
                </div>
                <div className="vertical-line border-l-2 border-black h-full pl-4">
                    <p><strong>{outBoundFlight.currency} {totalFlightCost(flights)}</strong></p>
                </div>
            </div>
        );
    };

    return (
        <div className="flight-card">
            <>
                {renderFlight(flights[0], flights[flights.length - 1])}
            </>
        </div>
    );
};

export default FlightCard;