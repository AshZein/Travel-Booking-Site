import React, { useState, useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import FlightCard from './FlightCard';

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

const FlightResults: React.FC = () => {
    const [outboundFlights, setOutboundFlights] = useState<any[]>([]);
    const [inboundFlights, setInboundFlights] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [tripType, setTripType] = useState('one-way');

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

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flight-results flex justify-between">
            <div className="flex-1 mr-2.5">
            {outboundFlights.map((flightGroup, index) => (
                <FlightCard key={index} legs={flightGroup.legs} flights={flightGroup.flights} />
            ))}
            </div>
            {tripType === 'round-trip' && (
            <div className="flex-1 ml-2.5">
                {inboundFlights.length > 0 ? (
                inboundFlights.map((flightGroup, index) => (
                    <FlightCard key={index} legs={flightGroup.legs} flights={flightGroup.flights} />
                ))
                ) : (
                <div>No return flights found for selected date</div>
                )}
            </div>
            )}
        </div>
    );
}

export default FlightResults;