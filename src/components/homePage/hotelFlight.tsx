import React, { useState, useEffect } from 'react';
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
    const [start, setStartDate] = useState<Date>(new Date());
    const [end, setEndDate] = useState<Date>(new Date());
    const [source, setSource] = useState(sourceLocation || '');
    const [sourceSuggestions, setSourceSuggestions] = useState<string[]>([]);
    const [destination, setDestination] = useState(destinationLocation || '');
    const [destinationSuggestions, setDestinationSuggestions] = useState<string[]>([]);
    const [tripType, setTripType] = useState('one-way');

    const toggleTripType = () => {
        setTripType((prevTripType) => (prevTripType === 'round-trip' ? 'one-way' : 'round-trip'));
    };

    const handleSourceLocationChange = async (value: string) => {
        setSource(value);
        const normalizedSource = normalizeLocationInput(value);
        const citySuggestions = await searchSuggestCities(normalizedSource);
        const airportSuggestions = await searchSuggestAirports(normalizedSource);
        setSourceSuggestions([...citySuggestions, ...airportSuggestions]);
    };

    const handleSourceSuggestionClick = (suggestion: string) => {
        setSource(suggestion);
        setSourceSuggestions([]);
    };

    const handleDestinationLocationChange = async (value: string) => {
        setDestination(value);
        const normalizedDestination = normalizeLocationInput(value);
        const citySuggestions = await searchSuggestCities(normalizedDestination);
        const airportSuggestions = await searchSuggestAirports(normalizedDestination);
        setDestinationSuggestions([...citySuggestions, ...airportSuggestions]);
    };

    const handleDestinationSuggestionClick = (suggestion: string) => {
        setDestination(suggestion);
        setDestinationSuggestions([]);
    };

    const handleFlightSearchClick = () => {
        const normalizedSource = normalizeLocationInput(source);
        const normalizedDestination = normalizeLocationInput(destination);
        window.location.href = `/hotelflightsearch?direction=${direction}&tripType=${tripType}&sourceLocation=${normalizedSource}&destinationLocation=${normalizedDestination}&startDate=${start?.toISOString()}&endDate=${end?.toISOString()}`;
    };

    useEffect(() => {
        setSource(sourceLocation || '');
        setDestination(destinationLocation || '');
        setStartDate(startDate ? new Date(startDate) : new Date());
        setEndDate(endDate ? new Date(endDate) : new Date());
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
                        selected={start instanceof Date && !isNaN(start.getTime()) ? start : new Date()}
                        onChange={(date) => date && setStartDate(date)}
                        className="text-black p-2 rounded"
                        id="start-date"
                    />
                </div>
            
                <div className="search-box">
                    <label htmlFor="end-date" className="text-white">End Date:</label>
                    <DatePicker
                        selected={end instanceof Date && !isNaN(end.getTime()) ? end : new Date()}
                        onChange={(date) => date && setEndDate(date)}
                        className="text-black p-2 rounded"
                        id="end-date"
                    />
                </div>
                
                <button className="tripType-button mt-10" onClick={handleFlightSearchClick}>Search</button>
            </div>
        </div>
    );
};

export default HotelFlight;