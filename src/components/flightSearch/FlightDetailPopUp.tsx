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
    const renderFlight = (outBoundFlight: Flight, inBoundFlight: Flight) => {
        const departurePieces = dateSplitter(outBoundFlight.departureTime);
        const arrivalPieces = dateSplitter(inBoundFlight.arrivalTime);
        
        return (
            <div key={outBoundFlight.id} className="flight-details flex items-center gap-20">
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
        <div>
            <div className="mb-8 mt-4">{renderFlight(flights[0], flights[flights.length - 1])}</div>
            {flights.map((flight, index) => (
                <div key={flight.id} style={{ marginBottom: '20px' }}>
                    <h3>Leg {index + 1} of {legs}</h3>
                    <p><strong>Flight Number:</strong> {flight.flightNumber}</p>
                    <p><strong>Departure:</strong> {flight.origin.city}, {flight.origin.country} ({flight.origin.code}) at {flight.departureTime}</p>
                    <p><strong>Arrival:</strong> {flight.destination.city}, {flight.destination.country} ({flight.destination.code}) at {flight.arrivalTime}</p>
                    <p><strong>Duration:</strong> {flight.duration} minutes</p>
                    <p><strong>Price:</strong> {flight.price} {flight.currency}</p>
                    <p><strong>Available Seats:</strong> {flight.availableSeats}</p>
                    <p><strong>Status:</strong> {flight.status}</p>
                    <p><strong>Airline:</strong> {flight.airline.name} ({flight.airline.code})</p>
                </div>
            ))}
        </div>
    )
}

export default FlightDetailPopUp;