import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { searchSuggestAirports, searchSuggestCities } from '@/utils/cleanSearch';

const Flight: React.FC = () => {
    const flightRouter = useRouter();
    const [selectedOption, setSelectedOption] = useState('hotel');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [tripType, setTripType] = useState('round-trip'); // State for trip type

    const toggleTripType = () => {
        setTripType((prevTripType) => (prevTripType === 'round-trip' ? 'one-way' : 'round-trip'));
    };

    const [sourceLocation, setSourceLocation] = useState('');
    const [sourceSuggestions, setSourceSuggestions] = useState<string[]>([]);

    const handleSourceLocationChange = async (value: string) => {
        setSourceLocation(value);

        const citySuggestions = await searchSuggestCities(value);
        const airportSuggestions = await searchSuggestAirports(value);
        const suggestions = [...citySuggestions, ...airportSuggestions];
        
        setSourceSuggestions(suggestions);
    };

    const handleSourceSuggestionClick = (suggestion: string) => {
        setSourceLocation(suggestion);
        setSourceSuggestions([]);
    };

    const [destinationLocation, setDestinationLocation] = useState('');
    const [destinationSuggestions, setDestinationSuggestions] = useState<string[]>([]);

    const handleDestinationLocationChange = async (value: string) => {
        setDestinationLocation(value);

        const citySuggestions = await searchSuggestCities(value);
        const airportSuggestions = await searchSuggestAirports(value);
        const suggestions = [...citySuggestions, ...airportSuggestions];
        
        setDestinationSuggestions(suggestions);
    };

    const handleDestinationSuggestionClick = (suggestion: string) => {
        setDestinationLocation(suggestion);
        setDestinationSuggestions([]);
    };

    const handleFlightSearchClick = () => {
        flightRouter.push(`/flightsearch?sourceLocation=${sourceLocation}&destinationLocation=${destinationLocation}&startDate=${startDate}&endDate=${endDate}`);
    }

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
                        value={sourceLocation}
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
                        value={destinationLocation}
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
                        selected={startDate}
                        onChange={(date) => date && setStartDate(date)}
                        className="text-black p-2 rounded"
                        id="start-date"
                    />
                </div>
                {tripType === 'round-trip' && (
                    <div className="search-box">
                        <label htmlFor="end-date" className="text-white">End Date:</label>
                        <DatePicker
                            selected={endDate}
                            onChange={(date) => date && setEndDate(date)}
                            className="text-black p-2 rounded"
                            id="end-date"
                        />
                    </div>
                )}
                <button className="tripType-button" onClick={handleFlightSearchClick}>Search</button>
            </div>
        </div>

    );
}

export default Flight;