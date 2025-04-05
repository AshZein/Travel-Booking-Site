import React, { useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { dateSplitter, totalFlightCost } from '@/utils/flight';
import { Flight } from '@/types/flight';

const dateCache: { [key: string]: { [key: string]: string } } = {};

interface FlightCardProps {
    legs: number;
    flights: Flight[];
    onClick: () => void;
    type: string;
    bookingReference: string; // Add bookingReference as a prop
    bookingCanceled: boolean; // Add bookingCanceled as a prop
}

const FlightCard: React.FC<FlightCardProps> = ({ legs, flights, onClick, type, bookingReference, bookingCanceled }) => {
    const [isCancelling, setIsCancelling] = useState(false);
    const [cancelError, setCancelError] = useState<string | null>(null);

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

            const response = await fetch('/api/flight/booking', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ bookingReference }),
            });

            if (!response.ok) {
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

            alert('Booking successfully canceled.');
        } catch (error) {
            console.error('Error canceling booking:', error);
            setCancelError('An unexpected error occurred.');
        } finally {
            setIsCancelling(false);
        }
    };

    const renderFlight = (outBoundFlight: Flight, inBoundFlight: Flight) => {
        const departurePieces = dateSplitter(outBoundFlight.departureTime, dateCache);
        const arrivalPieces = dateSplitter(inBoundFlight.arrivalTime, dateCache);

        return (
            <div key={outBoundFlight.id} className="flight-details flex items-center gap-20" onClick={onClick}>
                <div className="flex flex-col items-center gap-1">
                    <p>{departurePieces.hour}:{departurePieces.minute}</p>
                    <p>{outBoundFlight.origin.code} - {departurePieces.day} {departurePieces.month}</p>
                </div>
                <div>
                    {legs - 1 > 1 ? (
                        <>{legs - 1} Stops</>
                    ) : legs - 1 === 1 ? (
                        <>1 Stop</>
                    ) : (
                        <>DIRECT</>
                    )}
                </div>
                <div className="flex flex-col items-center gap-1">
                    <p>{arrivalPieces.hour}:{arrivalPieces.minute}</p>
                    <p>{inBoundFlight.destination.code} - {arrivalPieces.day} {arrivalPieces.month}</p>
                </div>
                <div className="vertical-line border-l-2 border-black h-full pl-4">
                    <p><strong>{outBoundFlight.currency} {totalFlightCost(flights)}</strong></p>
                </div>
            </div>
        );
    };

    return (
        <div
            className={`flight-card border p-4 rounded shadow-md ${
                bookingCanceled ? 'bg-gray-200 text-gray-500' : 'bg-white text-black'
            }`}
        >
            <>
                {renderFlight(flights[0], flights[flights.length - 1])}
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
                {bookingCanceled && (
                    <p className="mt-4 text-center text-xl font-bold text-red-600">
                        CANCELLED
                    </p>
                )}
            </>
        </div>
    );
};

export default FlightCard;