import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { searchSuggestAirports, searchSuggestCities } from '@/utils/cleanSearch';

interface FlightProps {
    sourceLocation: string;
    destinationLocation: string;
    startDate: string;
    endDate: string;
    tType: string;
}

const Flight: React.FC<FlightProps> = ({ sourceLocation, destinationLocation, startDate, endDate, tType }) => {
    const flightRouter = useRouter();
    const [selectedOption, setSelectedOption] = useState('hotel');
    const [start, setStart] = useState<Date | null>(new Date());
    const [end, setEnd] = useState<Date | null>(new Date());
    const [tripType, setTripType] = useState('one-way'); // State for trip type

    const toggleTripType = () => {
        setTripType((prevTripType) => (prevTripType === 'round-trip' ? 'one-way' : 'round-trip'));
    };

    const [source, setSource] = useState(sourceLocation || '');
    const [sourceSuggestions, setSourceSuggestions] = useState<string[]>([]);

    const handleSourceLocationChange = async (value: string) => {
        setSource(value);

        const citySuggestions = await searchSuggestCities(value);
        const airportSuggestions = await searchSuggestAirports(value);
        const suggestions = [...citySuggestions, ...airportSuggestions];
        
        setSourceSuggestions(suggestions);
    };

    const handleSourceSuggestionClick = (suggestion: string) => {
        setSource(suggestion);
        setSourceSuggestions([]);
    };

    const [destination, setDestination] = useState(destinationLocation || '');
    const [destinationSuggestions, setDestinationSuggestions] = useState<string[]>([]);

    const handleDestinationLocationChange = async (value: string) => {
        setDestination(value);

        const citySuggestions = await searchSuggestCities(value);
        const airportSuggestions = await searchSuggestAirports(value);
        const suggestions = [...citySuggestions, ...airportSuggestions];
        
        setDestinationSuggestions(suggestions);
    };

    const handleDestinationSuggestionClick = (suggestion: string) => {
        setDestination(suggestion);
        setDestinationSuggestions([]);
    };

    const handleFlightSearchClick = () => {
        // Use window.location.href to force a full page refresh
        window.location.href = `/flightsearch?tripType=${tripType}&sourceLocation=${source}&destinationLocation=${destination}&startDate=${start?.toISOString()}&endDate=${end?.toISOString()}`;
    };

    useEffect(() => {
        setSource(sourceLocation || '');
        setDestination(destinationLocation || '');
        setStart(startDate ? new Date(startDate) : new Date());
        setEnd(endDate ? new Date(endDate) : new Date());
        setTripType(tType || 'one-way');
    }, [sourceLocation, destinationLocation, startDate, endDate]);

    return (
        <div>
            <div className="flex items-center gap-4 mb-4">
                <button 
                    className={`tripType-button ${tripType === 'round-trip' ? 'bg-blue-700' : 'bg-blue-600'}`}
                    onClick={toggleTripType}
                >
                    {tripType === 'round-trip' ? 'Round Trip' : 'One Way'}
                </button>
            </div>
            <div className="flex items-center gap-4">
                <div className="search-box">
                    <label htmlFor="source-location" className="text-white">Source Location:</label>
                    <input 
                        type="text" 
                        id="source-location" 
                        className="text-black p-2 rounded" 
                        placeholder="Enter source location"
                        onChange={(e) => handleSourceLocationChange(e.target.value)}
                        value={source}
                    />
                    {sourceSuggestions.length > 0 && (
                        <ul className="suggestions-list">
                            {sourceSuggestions.map((suggestion, index) => (
                                <li 
                                    key={index} 
                                    className="suggestion-item"
                                    onClick={() => handleSourceSuggestionClick(suggestion)}
                                >
                                    {suggestion}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="search-box">
                    <label htmlFor="destination-location" className="text-white">Destination Location:</label>
                    <input 
                        type="text" 
                        id="destination-location" 
                        className="text-black p-2 rounded" 
                        placeholder="Enter destination location"
                        onChange={(e) => handleDestinationLocationChange(e.target.value)}
                        value={destination}
                    />
                    {destinationSuggestions.length > 0 && (
                        <ul className="suggestions-list">
                            {destinationSuggestions.map((suggestion, index) => (
                                <li 
                                    key={index} 
                                    className="suggestion-item"
                                    onClick={() => handleDestinationSuggestionClick(suggestion)}
                                >
                                    {suggestion}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="search-box">
                    <label htmlFor="start-date" className="text-white">Start Date:</label>
                    <DatePicker
                        selected={start}
                        onChange={(date) => {
                            if (date) {
                                setStart(date);
                                if (tripType === 'one-way') {
                                    setEnd(date);
                                }
                            }
                        }}
                        className="text-black p-2 rounded"
                        id="start-date"
                    />
                </div>
                {tripType === 'round-trip' && (
                    <div className="search-box">
                        <label htmlFor="end-date" className="text-white">End Date:</label>
                        <DatePicker
                            selected={end}
                            onChange={(date) => date && setEnd(date)}
                            className="text-black p-2 rounded"
                            id="end-date"
                        />
                    </div>
                )}
                <button className="tripType-button search-button mt-10" onClick={handleFlightSearchClick}>Search</button>
            </div>
        </div>
    );
}

export default Flight;