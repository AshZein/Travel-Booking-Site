import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { searchSuggestCities } from '@/utils/cleanSearch';

const HotelCreate: React.FC = () => {
    const hotelRouter = useRouter();

    const [country, setCountry] = useState("");
    const [city, setCity] = useState("");
    const [address, setAddress] = useState("");
    const [longitude, setLongitude] = useState("");
    const [latitude, setLatitude] = useState("");
    const [starRating, setStarRating] = useState(1);
    const [name, setName] = useState("");

    const [destinationLocation, setDestinationLocation] = useState('');
    const [destinationSuggestions, setDestinationSuggestions] = useState<string[]>([]);

    const handleDestinationLocationChange = async (value: string) => {
        setDestinationLocation(value);
        setCountry(value?.split(',')[1] || '');
        setCity(value?.split(',')[0] || '');
        const suggestions = await searchSuggestCities(value);
        
        setDestinationSuggestions(suggestions);

    };

    const handleDestinationSuggestionClick = (suggestion: string) => {
        setDestinationLocation(suggestion);
        setCountry(suggestion?.split(',')[1] || '');
        setCity(suggestion?.split(',')[0] || '');
        setDestinationSuggestions([]);

    };

    async function handleHotelCreation() {
        const token = localStorage.getItem('accessToken');
        console.log("yo " + localStorage.getItem('accessToken'));

        const response = await fetch('http://localhost:3000/api/hotel', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
                name: name,
                address: address,
                city: city,
                country: country,
                latitude: 37.1234,
                longitude: -122.5678,
                starRating: 5
}),

        });
        console.log("hihi")
    
        const data = await response.json();
        console.log(data);
      }


    return (
        <div>
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
                <label htmlFor="longitude" className="text-white">Longitute:</label>
                <input 
                    type="text" 
                    id="hotel-location" 
                    className="text-black p-2 rounded" 
                    placeholder="Enter longitute"
                    onChange={(e) => setLongitude(e.target.value)}
                    value={longitude}
                />
            </div>
            <div className="search-box">
                <label htmlFor="latitude" className="text-white">Latitute</label>
                <input 
                    type="text" 
                    id="hotel-location" 
                    className="text-black p-2 rounded" 
                    placeholder="Enter latitude"
                    onChange={(e) => setLatitude(e.target.value)}
                    value={latitude}
                />
            </div>
            <div className="search-box">
                <label htmlFor="hotel-name" className="text-white">Hotel Name:</label>
                <input 
                    type="text" 
                    id="hotel-location" 
                    className="text-black p-2 rounded" 
                    placeholder="Enter hotel name"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                />
                </div>

            </div>
            <div className="flex items-center gap-5 mt-4">
            <div className="search-box">
                <label htmlFor="hotel-address" className="text-white">Address:</label>
                <input 
                    type="text" 
                    id="hotel-location" 
                    className="text-black p-2 rounded" 
                    placeholder="Enter address"
                    onChange={(e) => setAddress(e.target.value)}
                    value={address}
                />
                </div>
                <div className="flex flex-col space-y-3 mt-6">
            <label htmlFor="roomPrice" className="text-white">Star Rating:</label>
            <input
                type="range"
                id="roomPrice"
                min="1"
                max="5"
                onChange={(e) => setStarRating(Number(e.target.value))}
                value={starRating}
                className="w-50 h-3 bg-gray-200 rounded-lg cursor-pointer"
                style={{
                    background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(starRating - 1) / 4 * 100}%, #e5e7eb ${(starRating - 1) / 4 * 100}%, #e5e7eb 100%)`,
                }}
            />
            <label htmlFor="roomPrice" className="text-white">
                {starRating >= 1 && starRating <= 5 ? "⭐".repeat(starRating) : "No Rating"}
            </label>

        </div>

<button className="tripType-button mt-10" onClick={handleHotelCreation}>Search</button>

                </div>
        </div>
    );
}

export default HotelCreate;