import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { searchSuggestAirports, searchSuggestCities } from '@/utils/cleanSearch';
import { normalizeLocationInput } from '@/utils/normalizeLocationInput';

interface HotelFlightProps {
    sourceLocation: string;
    destinationLocation: string;
    startDate: string;
    endDate: string;
    tType: string;
    direction: string;
}


const HotelFlight: React.FC<HotelFlightProps> = ({ sourceLocation, destinationLocation, startDate, endDate, tType, direction }) => {
    const [start, setStartDate] = useState(new Date());
    const [end, setEndDate] = useState(new Date());

    const [source, setSource] = useState(sourceLocation || '');
    const [sourceSuggestions, setSourceSuggestions] = useState<string[]>([]);
    const [tripType, setTripType] = useState('one-way');

    const toggleTripType = () => {
        setTripType((prevTripType) => (prevTripType === 'round-trip' ? 'one-way' : 'round-trip'));
    };

    const handleSourceLocationChange = async (value: string) => {
        console.log('Source location changed:', value);
        setSource(value);

        const normalizedSource = normalizeLocationInput(value); // Normalize the input
        const citySuggestions = await searchSuggestCities(normalizedSource);
        const airportSuggestions = await searchSuggestAirports(normalizedSource);
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
            const normalizedSource = normalizeLocationInput(sourceLocation);
            const normalizedDestination = normalizeLocationInput(destinationLocation);
    
            // Use window.location.href to force a full page refresh
            window.location.href = `/hotelflightsearch?direction=${direction}&tripType=${tripType}&sourceLocation=${normalizedSource}&destinationLocation=${normalizedDestination}&startDate=${start?.toISOString()}&endDate=${end?.toISOString()}`;
        };

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
            <div  className="flex items-center gap-4">
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
                        selected={new Date(startDate)}
                        onChange={(date) => date && setEndDate(date)}
                        className="text-black p-2 rounded"
                        id="start-date"
                    />
                </div>
                <div className="search-box">
                    <label htmlFor="end-date" className="text-white">End Date:</label>
                    <DatePicker
                        selected={new Date(endDate)}
                        onChange={(date) => date && setEndDate(date)}
                        className="text-black p-2 rounded"
                        id="end-date"
                    />
                </div>
                <button className="tripType-button mt-10" onClick={handleFlightSearchClick}>Search</button>
            </div>
        </div>
    );
}

export default HotelFlight;