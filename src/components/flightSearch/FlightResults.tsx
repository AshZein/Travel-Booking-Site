import React, { useState, useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import FlightCard from './FlightCard';
import FlightDetailPopUp from './FlightDetailPopUp';

async function searchFlights(source: string, destination: string, startDate: string, endDate: string) {
    try {
        const response = await fetch(`http://localhost:3000/api/flight/list?origin=${source}&destination=${destination}&startDate=${startDate}&endDate=${endDate}`);
        const data = await response.json();
        console.log('API Response:', data); // Debugging statement

        // Assuming the API response is an array of flight groups
        return data;
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


const FlightResults: React.FC = () => {
    const [outboundFlights, setOutboundFlights] = useState<any[]>([]);
    const [inboundFlights, setInboundFlights] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [tripType, setTripType] = useState('one-way');
    const [selectedFlight, setSelectedFlight] = useState<Flight[] | null>(null); // State for selected flight
    const [showPopup, setShowPopup] = useState(false); // State for showing popup

    useEffect(() => {
        console.log("useEffect is running"); // Debugging statement

        const searchParams = new URLSearchParams(window.location.search);
        const sourceLocation = searchParams.get('sourceLocation') || '';
        const destinationLocation = searchParams.get('destinationLocation') || '';
        const startDate = searchParams.get('startDate') || '';
        const endDate = searchParams.get('endDate') || '';
        const tripType = searchParams.get('tripType') || 'one-way';

        console.log("Search Params:", sourceLocation, destinationLocation, startDate, endDate); // Debugging statement

        searchFlights(sourceLocation, destinationLocation, startDate, endDate).then((flights) => {
            console.log('Fetched Flights:', flights); // Debugging statement
            setOutboundFlights(flights);
            setTripType(tripType);
        });
        searchFlights(destinationLocation, sourceLocation, endDate, startDate).then((flights) => {
            console.log('Fetched Flights:', flights); // Debugging statement
            setInboundFlights(flights);
            setLoading(false);
        });
    }, []);

    const handleFlightClick = (flights: Flight[]) => {
        setSelectedFlight(flights);
        setShowPopup(true);
    };

    const closePopup = () => {
        setShowPopup(false);
        setSelectedFlight(null);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flight-results flex justify-between">
            <div className="flex-1 mr-2.5">
                {outboundFlights.map((flightGroup, index) => (
                    <FlightCard key={index} legs={flightGroup.legs} flights={flightGroup.flights} onClick={() => handleFlightClick(flightGroup.flights)} />
                ))}
            </div>
            {tripType === 'round-trip' && (
                <div className="flex-1 ml-2.5">
                    {inboundFlights.length > 0 ? (
                        inboundFlights.map((flightGroup, index) => (
                            <FlightCard key={index} legs={flightGroup.legs} flights={flightGroup.flights} onClick={() => handleFlightClick(flightGroup.flights)} />
                        ))
                    ) : (
                        <div>No return flights found for selected date</div>
                    )}
                </div>
            )}
            {showPopup && selectedFlight && (
                <div className="popup">
                    <div className="popup-content">
                        <button onClick={closePopup}>Close</button>
                        <FlightDetailPopUp legs={selectedFlight.length} flights={selectedFlight} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default FlightResults;