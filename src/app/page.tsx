"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { searchSuggestAirports, searchSuggestCities } from '@/utils/cleanSearch';

const Page = () => {
    const router = useRouter();
    const [selectedOption, setSelectedOption] = useState('hotel');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [tripType, setTripType] = useState('round-trip'); // State for trip type

    const handleLoginClick = () => {
        router.push('/login');
    };

    const handleRegisterClick = () => {
        router.push('/register');
    };

    const handleLogoClick = () => {
        router.push('/');
    };

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
    
    return (
        <div className="page-container">
            <header className="header flex justify-between items-center text-white p-4">
                <div className="items-center flex gap-2">
                    <img src="logo_no_back.png" alt="FlyNext Logo" className="h-8" onClick={handleLogoClick}/>
                    <h1 className="text-2xl" onClick={handleLogoClick}>FlyNext</h1>
                </div>
                
                <div className="auth-buttons flex gap-4">
                    <button 
                        className="auth-button text-white font-bold py-2 px-4 rounded"
                        onClick={handleLoginClick}
                    >
                        Login
                    </button>
                    <button className="auth-button text-white font-bold py-2 px-4 rounded"
                        onClick={handleRegisterClick}
                    >
                        Register
                    </button>
                </div>
            </header>
            <main>
                <div>
                    <div> 
                        <ul className="flex items-center gap-4">
                            <li className={`hotel-flight-button flex items-center justify-center ${selectedOption === 'hotel' ? 'selected border border-white' : 'border border-black'}`} onClick={() => setSelectedOption('hotel')}>
                                <img src="hotel.png" className="h-8"/>Hotel
                            </li>
                            <li className={`hotel-flight-button flex items-center justify-center ${selectedOption === 'flight' ? 'selected border border-white' : ''}`} onClick={() => setSelectedOption('flight')}>
                                <img src="airplane.png" className="h-8"/>Flight
                            </li>
                            <li className={`hotel-flight-button flex items-center justify-center ${selectedOption === 'hotel-flight' ? 'selected border border-white' : ''}`} onClick={() => setSelectedOption('hotel-flight')}>
                                <img src="hotelplane.png" className="h-8"/>Hotel + Flight
                            </li>
                        </ul>
                        {selectedOption === 'flight' && (
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
                                            onChange={(date) => date && setEndDate(date)}
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
                                    <button className="tripType-button">Search</button>
                                </div>
                            </div>
                        )}
                        {selectedOption === 'hotel' && (
                            <div className="flex items-center gap-4">
                                <div className="search-box">
                                    <label htmlFor="hotel-location" className="text-white">Location:</label>
                                    <input 
                                        type="text" 
                                        id="hotel-location" 
                                        className="text-black p-2 rounded" 
                                        placeholder="Enter location"
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
                        )}
                        {selectedOption === 'hotel-flight' && (
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
                        )}
                    </div>
                </div>
            </main>
            <footer className="footer bg-white text-white p-4 text-center">
                <p className="text-black">&copy; 2025 FlyNext</p>
            </footer>
        </div>
    );
}

export default Page;