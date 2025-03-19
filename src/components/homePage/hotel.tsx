import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { searchSuggestCities } from '@/utils/cleanSearch';

const Hotel: React.FC = () => {
    const hotelRouter = useRouter();

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    const [destinationLocation, setDestinationLocation] = useState('');
    const [destinationSuggestions, setDestinationSuggestions] = useState<string[]>([]);

    const handleDestinationLocationChange = async (value: string) => {
        setDestinationLocation(value);

        const suggestions = await searchSuggestCities(value);
        
        setDestinationSuggestions(suggestions);
    };

    const handleDestinationSuggestionClick = (suggestion: string) => {
        setDestinationLocation(suggestion);
        setDestinationSuggestions([]);
    };

    const handleHotelSearchClick = () => {
        hotelRouter.push(`/hotelsearch?destinationLocation=${destinationLocation}&startDate=${startDate}&endDate=${endDate}`);
    }

    return (
        <div className="flex items-center gap-4">
            <div className="search-box">
                <label htmlFor="hotel-location" className="text-white">Location:</label>
                <input 
                    type="text" 
                    id="hotel-location" 
                    className="text-black p-2 rounded" 
                    placeholder="Enter location"
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
            <div className="search-box">
                <label htmlFor="end-date" className="text-white">End Date:</label>
                <DatePicker
                    selected={endDate}
                    onChange={(date) => date && setEndDate(date)}
                    className="text-black p-2 rounded"
                    id="end-date"
                />
            </div>
            <button className="tripType-button mt-10" onClick={handleHotelSearchClick}>Search</button>
        </div>
    );
}

export default Hotel;