import React from 'react';
import 'react-datepicker/dist/react-datepicker.css';

const dateCache: { [key: string]: { [key: string]: string } } = {};

function dateSplitter(dateString: string) {
    if (dateCache[dateString]) {
        return dateCache[dateString];
    }

    const pieces: { [key: string]: string } = {};

    const splitDate = dateString.split('T');
    if (splitDate.length !== 2) {
        console.error('Invalid date format:', dateString);
        return pieces;
    }

    const [datePart, timePart] = splitDate;
    const [year, month, day] = datePart.split('-');
    const [hour, minute] = timePart.split(':');

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    pieces.day = day;
    pieces.month = monthNames[parseInt(month) - 1];
    pieces.monthNumeric = month;
    pieces.year = year;
    pieces.hour = hour;
    pieces.minute = minute;

    dateCache[dateString] = pieces;
    return pieces;
}

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

interface FlightCardProps {
    legs: number;
    flights: Flight[];
}

const FlightCard: React.FC<FlightCardProps> = ({ legs, flights }) => {
    const renderFlight = (flight: Flight) => {
        const departurePieces = dateSplitter(flight.departureTime);
        const arrivalPieces = dateSplitter(flight.arrivalTime);
        return (
            <div key={flight.id} className="flight-details flex items-center gap-20">
                <div>
                    <p>{departurePieces.hour}:{departurePieces.minute}</p>
                    <p>{flight.origin.code} - {departurePieces.day} {departurePieces.month}</p>
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
                <div>
                    <p>{arrivalPieces.hour}:{arrivalPieces.minute}</p>
                    <p>{flight.destination.code} - {arrivalPieces.day} {arrivalPieces.month}</p>
                </div>
            </div>
        );
    };

    return (
        <div className="flight-card bg-gray-200 p-4 text-black">
            {legs > 1 ? (
                <>
                    {renderFlight(flights[0])}
                    {renderFlight(flights[flights.length - 1])} 
                </>
            ) : (
                flights.map((flight) => renderFlight(flight)) 
            )}
        </div>
    );
}

export default FlightCard;