import React from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { useItinerary } from '@/context/ItineraryContext';
import { dateSplitter, totalFlightCost } from '@/utils/flight';
import { Flight } from '@/types/flight';

const dateCache: { [key: string]: { [key: string]: string } } = {};

interface FlightCardProps {
    legs: number;
    flights: Flight[];
    onClick: () => void;
    onAddToItinerary: () => void;
    type: string;
}

const FlightCard: React.FC<FlightCardProps> = ({ legs, flights, onClick, type }) => {
    const { state, dispatch } = useItinerary();
    const firstFlightId = flights[0].id;
    const lastFlightId = flights[flights.length - 1].id;
    var isSelected = false;
    // a flight is selected if the state has a flight selected, and the flight id of the first leg is the same, and the flight of the last leg is the same as the one selected
    if (type === 'outbound') {
        isSelected = state.selectedOutboundFlights.length > 0 && 
                            state.selectedOutboundFlights[0].id === firstFlightId && 
                            state.selectedOutboundFlights[state.selectedOutboundFlights.length - 1].id === lastFlightId;
    }
    else {
        isSelected = state.selectedReturnFlights.length > 0 &&
                            state.selectedReturnFlights[0].id === firstFlightId &&
                            state.selectedReturnFlights[state.selectedReturnFlights.length - 1].id === lastFlightId;
    }

    const handleSelectClick = (flights: Flight[]) => {
        if (isSelected) {
            if (type === 'outbound') {
                flights.forEach(flight => {
                    dispatch({ type: 'UNSELECT_OUTBOUND_FLIGHT', payload: flight });
                });
            } else {
                flights.forEach(flight => {
                    dispatch({ type: 'UNSELECT_RETURN_FLIGHT', payload: flight });
                });
            }
        } else {
            if (type === 'outbound') {
                flights.forEach(flight => {
                    dispatch({ type: 'SELECT_OUTBOUND_FLIGHT', payload: flight });
                });
            } else {
                flights.forEach(flight => {
                    dispatch({ type: 'SELECT_RETURN_FLIGHT', payload: flight });
                });
            }
        }
    };

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
                    <p><strong>{outBoundFlight.currency} {totalFlightCost(flights)}</strong></p>
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