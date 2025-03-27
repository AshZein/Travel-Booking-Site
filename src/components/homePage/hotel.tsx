import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { searchSuggestCities } from '@/utils/cleanSearch';

const Hotel: React.FC = () => {
    const hotelRouter = useRouter();

    const [startDate, setStartDate] = useState<Date | null>(new Date());
    const [endDate, setEndDate] = useState<Date | null>(new Date());
    const [minRating, setMinRating] = useState(1);
    const [maxRating, setMaxRating] = useState(5);
    const [minPrice, setMinPrice] = useState(1);
    const [maxPrice, setMaxPrice] = useState(10000);
    const [name, setName] = useState("");

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
        hotelRouter.push(`/hotelsearch?destinationLocation=${destinationLocation}&startDate=${startDate?.toISOString()}&endDate=${endDate?.toISOString()}&minStarRating=${minRating}&maxStarRating=${maxRating}&name=${name}&startPrice=${minPrice}&endPrice=${maxPrice}`);
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
                <div className="flex flex-col space-y-3">
  <label htmlFor="minStarRating" className="text-white">
    Minimum Star Rating:
  </label>
  <label htmlFor="minStarRating" className="text-white">
    {minRating} stars
  </label>
  <input
    type="range"
    id="minStarRating"
    min="1"
    max="5"
    onChange={(e) => setMinRating(Number(e.target.value))}
    value={minRating}
    className="w-50 h-3s bg-gray-200 rounded-lg appearance-none cursor-pointer"
    style={{
        background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${
          ((minRating - 1) / 4) * 100
        }%, #e5e7eb ${((minRating - 1) / 4) * 100}%, #e5e7eb 100%)`,
      }}
  />
</div>
<div className="flex flex-col space-y-3 pl-3">
  <label htmlFor="maxStarRating" className="text-white">
    Maximum Star Rating:
  </label>
  <label htmlFor="maxStarRating" className="text-white">
    {maxRating} stars
  </label>
  <input
    type="range"
    id="maxStarRating"
    min="1"
    max="5"
    onChange={(e) => setMaxRating(Number(e.target.value))}
    value={maxRating}
    className="w-50 h-3s bg-gray-200 rounded-lg appearance-none cursor-pointer"
    style={{
        background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${
          ((maxRating - 1) / 4) * 100
        }%, #e5e7eb ${((maxRating - 1) / 4) * 100}%, #e5e7eb 100%)`,
      }}
  />
</div>
<div className="flex flex-col space-y-3 pl-3">
  <label htmlFor="minPrice" className="text-white">
    Minimum Price:
  </label>
  <label htmlFor="minPrice" className="text-white">
    ${minPrice}
  </label>
  <input
    type="range"
    id="minPrice"
    min="1"
    max="10000"
    onChange={(e) => setMinPrice(Number(e.target.value))}
    value={minPrice}
    className="w-50 h-3s bg-gray-200 rounded-lg appearance-none cursor-pointer"
    style={{
        background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${
          ((minPrice - 1) / 9999) * 100
        }%, #e5e7eb ${((minPrice - 9999) / 4) * 100}%, #e5e7eb 100%)`,
      }}
  />
</div>
<div className="flex flex-col space-y-3 pl-3">
  <label htmlFor="maxPrice" className="text-white">
    Maximum Price:
  </label>
  <label htmlFor="maxPrice" className="text-white">
    ${maxPrice} 
  </label>
  <input
    type="range"
    id="maxPrice"
    min="1"
    max="10000"
    onChange={(e) => setMaxPrice(Number(e.target.value))}
    value={maxPrice}
    className="w-50 h-3s bg-gray-200 rounded-lg appearance-none cursor-pointer"
    style={{
        background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${
          ((maxPrice - 1) / 9999) * 100
        }%, #e5e7eb ${((maxPrice - 1) / 9999) * 100}%, #e5e7eb 100%)`,
      }}
  />
</div>
<button className="tripType-button mt-10" onClick={handleHotelSearchClick}>Search</button>

                </div>
        </div>
    );
}

export default Hotel;