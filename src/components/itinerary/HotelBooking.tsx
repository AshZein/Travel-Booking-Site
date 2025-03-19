import React, { useEffect } from 'react';

async function getHotelData(hotelName: string, hotelAddress: string) {
    const response = await fetch(`http://localhost:3000/api/hotel?name=${hotelName}&address=${hotelAddress}`);
    const data = await response.json();

    return data;
}

interface Hotel {
    hotelName: string;
    hotelAddress: string;
    hotelCity: string;
    hotelCountry: string;
    hotelPrice: number;
    hotelCurrency: string;
    hotelRating: number;
}

interface HotelBookingProps {
    hotel: Hotel;

    checkinDate: string;
    checkoutDate: string;
}

const HotelBooking: React.FC<HotelBookingProps> = ( {hotel, checkinDate, checkoutDate} ) => {
    
    useEffect (() => {
        console.log('Hotel Booking Page');

    }, []);
    
    return (
        <div>
            <p>{hotel.hotelName}</p>
            <p>{hotel.hotelAddress}</p>
        </div>
    );
}

export default HotelBooking;