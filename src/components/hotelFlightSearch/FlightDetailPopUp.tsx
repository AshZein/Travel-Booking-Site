import React from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { Flight } from '@/types/flight';
import { dateSplitter } from '@/utils/flight';

const dateCache: { [key: string]: { [key: string]: string } } = {};

interface FlightCardProps {
    legs: number;
    flights: Flight[];
}

const FlightDetailPopUp: React.FC<FlightCardProps> = ({ legs, flights }) => {
    const renderFlight = (flight: Flight) => {
        const departurePieces = dateSplitter(flight.departureTime, dateCache);
        const arrivalPieces = dateSplitter(flight.arrivalTime, dateCache);
        
        return (
            <div key={flight.id} className="flight-details flex items-center gap-20">
                <div className="flex flex-col items-center gap-1">
                    <p>{departurePieces.hour}:{departurePieces.minute}</p>
                    <p>{flight.origin.code} - {departurePieces.day} {departurePieces.month}</p>
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
                    <p>{flight.destination.code} - {arrivalPieces.day} {arrivalPieces.month}</p>
                </div>
                
                <div className="vertical-line border-l-2 border-black h-full pl-4">
                    <p><strong>{flight.price}</strong></p>
                    <p>currency: {flight.currency}</p>
                </div>
            </div>
        );
    };

    return (
        <div>
            {flights.map((flight, index) => (
                <div key={flight.id} className="mb-8 mt-4">
                    <h3>Leg {index + 1} of {legs}</h3>
                    {renderFlight(flight)}
                    <div style={{ marginBottom: '20px' }}>
                        <p><strong>Flight Number:</strong> {flight.flightNumber}</p>
                        <p><strong>Departure:</strong> {flight.origin.city}, {flight.origin.country} ({flight.origin.code}) at {flight.departureTime}</p>
                        <p><strong>Arrival:</strong> {flight.destination.city}, {flight.destination.country} ({flight.destination.code}) at {flight.arrivalTime}</p>
                        <p><strong>Duration:</strong> {flight.duration} minutes</p>
                        <p><strong>Price:</strong> {flight.price} {flight.currency}</p>
                        <p><strong>Available Seats:</strong> {flight.availableSeats}</p>
                        <p><strong>Status:</strong> {flight.status}</p>
                        <p><strong>Airline:</strong> {flight.airline.name} ({flight.airline.code})</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default FlightDetailPopUp;