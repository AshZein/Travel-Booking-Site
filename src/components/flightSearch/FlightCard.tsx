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

const FlightCard: React.FC<FlightCardProps> = ({ legs, flights }) => {
    return (
        <div className="flight-card bg-gray-200 p-4 text-black">
            <h3>Legs: {legs}</h3>
            {flights.map((flight) => (
                <div key={flight.id} className="flight-details">
                    <p>Flight Number: {flight.flightNumber}</p>
                    <p>Departure Time: {new Date(flight.departureTime).toLocaleString()}</p>
                    <p>Arrival Time: {new Date(flight.arrivalTime).toLocaleString()}</p>
                    <p>Origin: {flight.origin.name} ({flight.origin.code}), {flight.origin.city}, {flight.origin.country}</p>
                    <p>Destination: {flight.destination.name} ({flight.destination.code}), {flight.destination.city}, {flight.destination.country}</p>
                    <p>Duration: {flight.duration} minutes</p>
                    <p>Price: {flight.price} {flight.currency}</p>
                    <p>Available Seats: {flight.availableSeats}</p>
                    <p>Status: {flight.status}</p>
                    <p>Airline: {flight.airline.name} ({flight.airline.code})</p>
                </div>
            ))}
        </div>
    );
}

export default FlightCard;