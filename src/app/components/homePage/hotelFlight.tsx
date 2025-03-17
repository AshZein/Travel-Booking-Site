import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { searchSuggestAirports, searchSuggestCities } from '@/utils/cleanSearch';

const HotelFlight: React.FC = () => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    return (
        <div className="flex items-center gap-4">
            <div className="search-box">
                <label htmlFor="source-location" className="text-white">Source Location:</label>
                <input 
                    type="text" 
                    id="source-location" 
                    className="text-black p-2 rounded" 
                    placeholder="Enter source location"
                />
            </div>
            <div className="search-box">
                <label htmlFor="destination-location" className="text-white">Destination Location:</label>
                <input 
                    type="text" 
                    id="destination-location" 
                    className="text-black p-2 rounded" 
                    placeholder="Enter destination location"
                />
            </div>
            <div className="search-box">
                <label htmlFor="start-date" className="text-white">Start Date:</label>
                <DatePicker
                    selected={startDate}
                    onChange={(date) => date && setEndDate(date)}
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
            <button className="tripType-button">Search</button>
        </div>
    );
}

export default HotelFlight;