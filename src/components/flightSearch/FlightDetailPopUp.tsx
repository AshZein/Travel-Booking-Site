import React from 'react';
import 'react-datepicker/dist/react-datepicker.css';

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
    return (
        <div>
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