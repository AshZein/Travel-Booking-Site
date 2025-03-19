import React, { useState, useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import FlightCard from './FlightCard';
import FlightDetailPopUp from './FlightDetailPopUp';

async function searchFlights(source: string, destination: string, startDate: string, endDate: string) {
    try {
        const response = await fetch(`http://localhost:3000/api/flight/list?origin=${source}&destination=${destination}&startDate=${startDate}&endDate=${endDate}`);
        const data = await response.json();
        console.log('API Response:', data); // Debugging statement

        // Ensure we always return an array
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error('Error fetching flights:', error);
        return [];
    }
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

interface FlightResultsProps {
    sourceLocation: string;
    destinationLocation: string;
    startDate: string;
    endDate: string;
    tripType: string;
}

const FlightResults: React.FC<FlightResultsProps> = ({ sourceLocation, destinationLocation, startDate, endDate, tripType }) => {
    const [outboundFlights, setOutboundFlights] = useState<any[]>([]);
    const [inboundFlights, setInboundFlights] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedFlight, setSelectedFlight] = useState<Flight[] | null>(null); // State for selected flight
    const [showPopup, setShowPopup] = useState(false); // State for showing popup
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        console.log("useEffect is running");
        console.log("Search parameters:", { sourceLocation, destinationLocation, startDate, endDate, tripType });
        
        if (!sourceLocation || !destinationLocation) {
            setOutboundFlights([]);
            setInboundFlights([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        console.log(sourceLocation, destinationLocation, startDate, endDate);
        const fetchFlights = async () => {
            const outBoundFlight = await searchFlights(sourceLocation, destinationLocation, startDate, startDate);
            setOutboundFlights(Array.isArray(outBoundFlight) ? outBoundFlight : []);
            
            if (tripType === 'round-trip') {
                const inBoundFlight = await searchFlights(destinationLocation, sourceLocation, endDate, endDate);
                setInboundFlights(Array.isArray(inBoundFlight) ? inBoundFlight : []);
            }
        };

        fetchFlights().catch((error) => {
            console.error('Error fetching flights:', error);
            setError('Failed to fetch flights. Please try again.');
        }).finally(() => {
            setLoading(false);
        });
    }, [sourceLocation, destinationLocation, startDate, endDate, tripType]);

    const handleFlightClick = (flights: Flight[]) => {
        setSelectedFlight(flights);
        setShowPopup(true);
    };

    const closePopup = () => {
        setShowPopup(false);
        setSelectedFlight(null);
    };

    if (loading) {
        return <div className="text-center p-8">Loading flights...</div>;
    }

    if (error) {
        return <div className="text-center p-8 text-red-500">{error}</div>;
    }

    return (
        <div className="flight-results flex flex-col md:flex-row justify-between">
            <div className="flex-1 mr-0 md:mr-2.5 mb-4 md:mb-0">
                <h2 className="text-xl font-bold mb-4">Outbound Flights</h2>
                {outboundFlights && outboundFlights.length > 0 ? (
                    outboundFlights.map((flightGroup, index) => (
                        <FlightCard 
                            key={index} 
                            legs={flightGroup.legs} 
                            flights={flightGroup.flights} 
                            onClick={() => handleFlightClick(flightGroup.flights)} 
                        />
                    ))
                ) : (
                    <div className="p-4 bg-white text-black rounded">No outbound flights found for selected criteria.</div>
                )}
            </div>
            {tripType === 'round-trip' && (
                <div className="flex-1 ml-0 md:ml-2.5">
                    <h2 className="text-xl font-bold mb-4">Return Flights</h2>
                    {inboundFlights && inboundFlights.length > 0 ? (
                        inboundFlights.map((flightGroup, index) => (
                            <FlightCard 
                                key={index} 
                                legs={flightGroup.legs} 
                                flights={flightGroup.flights} 
                                onClick={() => handleFlightClick(flightGroup.flights)} 
                            />
                        ))
                    ) : (
                        <div className="p-4 bg-white text-black rounded">No return flights found for selected criteria.</div>
                    )}
                </div>
            )}
            {showPopup && selectedFlight && (
                <div className="popup">
                    <div className="popup-content">
                        <button onClick={closePopup} className="absolute top-2 right-2 p-2">✕</button>
                        <FlightDetailPopUp legs={selectedFlight.length} flights={selectedFlight} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default FlightResults;