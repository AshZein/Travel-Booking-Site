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

function totalFlightCost(flights: Flight[]) {
    return flights.reduce((total, flight) => total + flight.price, 0);
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

const FlightDetailPopUp: React.FC<FlightCardProps> = ({ legs, flights }) => {
    const renderFlight = (flight: Flight) => {
        const departurePieces = dateSplitter(flight.departureTime);
        const arrivalPieces = dateSplitter(flight.arrivalTime);
        
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