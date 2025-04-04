import React, { useState, useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { useItinerary } from '@/context/ItineraryContext';


interface HotelSuggestionsProps {
    city: string;
    country: string;
    checkInDate: string;
    checkOutDate: string;
}

const HotelSuggestions: React.FC<HotelSuggestionsProps> = ({ city, country, checkInDate, checkOutDate }) => {
    const [hotelSuggestions, setHotelSuggestions] = useState<any[]>([]);
    const [hotelImages, setHotelImages] = useState<any[]>([]);
    const fetchHotelSuggestions = async () => {
        const response = await fetch(`/api/hotel/suggestions?city=${city}&country=${country}`);
        const data = await response.json();
        console.log('Hotel Suggestions:', data); // Debugging statement
        setHotelSuggestions(data);
    }

    const fetchHotelImages = async (hotelId: string) => {
        const response = await fetch(`/api/hotel/images?hotelId=${hotelId}`);
        const data = await response.json();
        console.log('Hotel Images:', data); // Debugging statement
        setHotelImages(data);
    }

    useEffect(() => {
        fetchHotelSuggestions();
    }, [city, country, checkInDate, checkOutDate]);

    useEffect(() => {
        hotelSuggestions.forEach((hotel) => {
            fetchHotelImages(hotel.id);
        });
    }, [hotelSuggestions]);
    
    return (
        <div>

        </div>
    );
}

export default HotelSuggestions;