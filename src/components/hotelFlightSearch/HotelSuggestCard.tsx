"use client";
import React from 'react';
import {useRouter} from "next/navigation";
import { Hotel } from '@/types/Hotel';

interface HotelSuggestCardProps {
    hotel: Hotel;
    hotelImg: string;
    checkin: string;
    checkout: string;
}

const HotelSuggestCard: React.FC<HotelSuggestCardProps> = ({hotel, hotelImg, checkin, checkout}) => {
    const router = useRouter();
    
    const handleHotelClick = (hotelId: number, name: string) => {
        router.push(`/hotelsearch/roomInfo?hotelId=${hotelId}&name=${name}&checkin=${checkin}&checkout=${checkout}`);
    }
    
    return( 
        <div
            key={hotel.hotelId}
            onClick={() => handleHotelClick(hotel.hotelId, hotel.name)}
            className="border p-4 rounded-lg shadow-md bg-white"
        >
            <img
                src={hotelImg} // Use default image if not available
                alt={hotel.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h2 className="text-xl font-semibold text-gray-800">{hotel.name}</h2>
            <div className="flex justify-between">
            <div>
            <p className="text-gray-600">{hotel.address}</p>
            <p className="text-yellow-500">⭐ {hotel.starRating} Stars</p>
            <p className="text-green-600">Starting Price: ${hotel.startingPrice}</p>
            </div>
            </div>
        </div>
        
    );
}

export default HotelSuggestCard;