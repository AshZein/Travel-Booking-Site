import React, { useEffect, useState } from 'react';
import { Hotel } from '@/types/Hotel';
import { dateSplitter } from '@/utils/flight'; // Assuming dateSplitter is imported from utils
import { useHotelItinerary } from '@/context/HotelItineraryContext'; // Import the HotelItineraryContext

interface HotelBookingProps {
    hotel: Hotel | null;
    checkinDate: string | null;
    checkoutDate: string | null;
    bookingReference: string; // Add bookingReference as a prop
    bookingCanceled: boolean; // Add bookingCanceled as a prop
}

const HotelCard: React.FC<HotelBookingProps> = ({ hotel, checkinDate, checkoutDate, bookingReference, bookingCanceled }) => {
    const dateCache: { [key: string]: { [key: string]: string } } = {}; // Cache for dateSplitter
    const { state: hotelState, dispatch: hotelDispatch } = useHotelItinerary();
    const [isCancelling, setIsCancelling] = useState(false);
    const [cancelError, setCancelError] = useState<string | null>(null);

    // Process checkin and checkout dates
    const checkinPieces = checkinDate ? dateSplitter(checkinDate, dateCache) : null;
    const checkoutPieces = checkoutDate ? dateSplitter(checkoutDate, dateCache) : null;

    const handleCancelBooking = async () => {
        setIsCancelling(true);
        setCancelError(null);

        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                setCancelError('User is not authenticated.');
                setIsCancelling(false);
                return;
            }

            const response = await fetch('/api/hotel/booking', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ referenceId: bookingReference }),
            });

            if (!response.ok) {
                // Check if the response has a body
                const contentType = response.headers.get('Content-Type');
                if (contentType && contentType.includes('application/json')) {
                    const errorData = await response.json();
                    setCancelError(errorData.message || 'Failed to cancel booking.');
                } else {
                    setCancelError('Failed to cancel booking. No additional information provided.');
                }
                setIsCancelling(false);
                return;
            }

            // Successfully canceled
            alert('Booking successfully canceled.');
            hotelDispatch({ type: 'UNSELECT_HOTEL_ROOM' });
        } catch (error) {
            console.error('Error canceling booking:', error);
            setCancelError('An unexpected error occurred.');
        } finally {
            setIsCancelling(false);
        }
    };

    useEffect(() => {
        console.log('Hotel Booking Page');
    }, []);

    return (
        <div
            className={`hotel-booking-card border p-4 rounded shadow-md ${
                bookingCanceled ? 'bg-gray-200 text-gray-500' : 'bg-white text-black'
            }`}
        >
            <div className="align-center">
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
                    <div className="mb-4 flex flex-col justify-left">
                        <p>
                            <strong>Check-out:</strong> {checkoutPieces.day} {checkoutPieces.month} {checkoutPieces.year} at {checkoutPieces.hour}:{checkoutPieces.minute}
                        </p>
                    </div>
                )}
                <p>
                    <strong>Total Cost:</strong> ${checkinDate && checkoutDate ? 
                    (hotelState.selectedRoom?.price || 0) * Math.ceil((new Date(checkoutDate).getTime() - 
                    new Date(checkinDate).getTime()) / (1000 * 60 * 60 * 24)) 
                    : 'N/A'}
                </p>
                {cancelError && <p className="text-red-500">{cancelError}</p>}
                {!bookingCanceled && (
                    <button
                        onClick={handleCancelBooking}
                        disabled={isCancelling}
                        className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:bg-gray-400"
                    >
                        {isCancelling ? 'Cancelling...' : 'Cancel Booking'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default HotelCard;