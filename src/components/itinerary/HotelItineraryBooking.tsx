import React, { useEffect } from 'react';
import { Hotel } from '@/types/Hotel';
import { dateSplitter } from '@/utils/flight'; // Assuming dateSplitter is imported from utils
import { useHotelItinerary } from '@/context/HotelItineraryContext'; // Import the HotelItineraryContext

interface HotelBookingProps {
    hotel: Hotel | null;
    checkinDate: string | null;
    checkoutDate: string | null;
}

const HotelItineraryBooking: React.FC<HotelBookingProps> = ({ hotel, checkinDate, checkoutDate }) => {
    const dateCache: { [key: string]: { [key: string]: string } } = {}; // Cache for dateSplitter
    const {state: hotelState, dispatch: hotelDispatch } = useHotelItinerary();
    // Process checkin and checkout dates
    const checkinPieces = checkinDate ? dateSplitter(checkinDate, dateCache) : null;
    const checkoutPieces = checkoutDate ? dateSplitter(checkoutDate, dateCache) : null;

    const handleRemoveHotel = () => {
        const data = {
            hotel: hotelState.selectedHotel,
            room: hotelState.selectedRoom,
            checkin: hotelState.selectedHotelCheckIn,
            checkout: hotelState.selectedHotelCheckOut,
            price: hotelState.selectedRoom?.price ? hotelState.selectedRoom.price : 0,
        };
        hotelDispatch({ type: 'UNSELECT_HOTEL_ROOM' });
    };

    useEffect(() => {
        console.log('Hotel Booking Page');
    }, []);

    return (
        <div className="hotel-booking-card border p-4 rounded shadow-md">
            {hotel && (
                <div className="flex flex-col justify-left mb-4">
                    <p><strong>Hotel Name:</strong> {hotel.name}</p>
                    <p><strong>Address:</strong> {hotel.address}</p>
                </div>
            )}
            {checkinPieces && (
                <div className="mb-2">
                    <p>
                        <strong>Check-in:</strong> {checkinPieces.day} {checkinPieces.month} {checkinPieces.year} at {checkinPieces.hour}:{checkinPieces.minute}
                    </p>
                </div>
            )}
            {checkoutPieces && (
                <div className="mb-4">
                    <p>
                        <strong>Check-out:</strong> {checkoutPieces.day} {checkoutPieces.month} {checkoutPieces.year} at {checkoutPieces.hour}:{checkoutPieces.minute}
                    </p>
                </div>
            )}
            <button
                onClick={handleRemoveHotel}
                disabled={!hotel} // Ensure this logic is consistent between server and client
                className={`tripType-button ${
                    !hotel ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
            >
                Remove
            </button>
        </div>
    );
};

export default HotelItineraryBooking;