import React from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { useItinerary } from '@/context/ItineraryContext';

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
    onClick: () => void; // Add onClick prop
    onAddToItinerary: () => void;
}

const FlightCard: React.FC<FlightCardProps> = ({ legs, flights, onClick }) => {
    const { state, dispatch } = useItinerary();
    const firstFlightId = flights[0].id;
    const lastFlightId = flights[flights.length - 1].id;
    // a flight is selected if the state has a flight selected, and the flight id of the first leg is the same, and the flight of the last leg is the same as the one selected
    const isSelected = state.selectedFlights.length > 0 && 
                        state.selectedFlights[0].id === firstFlightId && 
                        state.selectedFlights[state.selectedFlights.length - 1].id === lastFlightId;

    const handleSelectClick = (flights: Flight[]) => {
        if (isSelected) {
            flights.forEach(flight =>{
                dispatch({ type: 'UNSELECT_FLIGHT', payload: flight });
            });
        } else {
            flights.forEach(flight => {
                dispatch({ type: 'SELECT_FLIGHT', payload: flight });
            });
        }
    };

    const renderFlight = (outBoundFlight: Flight, inBoundFlight: Flight) => {
        const departurePieces = dateSplitter(outBoundFlight.departureTime);
        const arrivalPieces = dateSplitter(inBoundFlight.arrivalTime);
        
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
                <button 
                    className={`select-button ${isSelected ? 'bg-green-500' : 'bg-blue-500'} text-white p-2 rounded`}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleSelectClick(flights);
                        console.log("selected flight", flights); 
                    }}
                >
                    {isSelected ? 'Selected' : 'Select'}
                </button>
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
}

export default FlightCard;