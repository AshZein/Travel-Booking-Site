import React, { useEffect } from 'react';
import { Hotel } from '@/types/Hotel';
import { dateSplitter } from '@/utils/flight'; // Assuming dateSplitter is imported from utils

interface HotelBookingProps {
    hotel: Hotel | null;
    checkinDate: string | null;
    checkoutDate: string | null;
}

const HotelBooking: React.FC<HotelBookingProps> = ({ hotel, checkinDate, checkoutDate }) => {
    const dateCache: { [key: string]: { [key: string]: string } } = {}; // Cache for dateSplitter

    // Process checkin and checkout dates
    const checkinPieces = checkinDate ? dateSplitter(checkinDate, dateCache) : null;
    const checkoutPieces = checkoutDate ? dateSplitter(checkoutDate, dateCache) : null;

    useEffect(() => {
        console.log('Hotel Booking Page');
    }, []);

    return (
        <div className="hotel-booking-card">
            {hotel && (
                <div className="flex flex-col justify-left">
                    <p><strong>Hotel Name:</strong> {hotel.name}</p>
                    <p><strong>Address:</strong> {hotel.address}</p>
                </div>
            )}
            {checkinPieces && (
                <div>
                    <p>
                        <strong>Check-in:</strong> {checkinPieces.day} {checkinPieces.month} {checkinPieces.year} at {checkinPieces.hour}:{checkinPieces.minute}
                    </p>
                </div>
            )}
            {checkoutPieces && (
                <div>
                    <p>
                        <strong>Check-out:</strong> {checkoutPieces.day} {checkoutPieces.month} {checkoutPieces.year} at {checkoutPieces.hour}:{checkoutPieces.minute}
                    </p>
                </div>
            )}
        </div>
    );
};

export default HotelBooking;